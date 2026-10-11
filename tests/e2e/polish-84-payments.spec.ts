import { expect, test, type Page } from "@playwright/test";

/** Polish 8.4 · Lote 9: "Tarjeta de crédito o débito" como medio de pago propio, con las tarjetas guardadas (8.4.22). */

const toast = (page: Page, text: string | RegExp) => page.getByRole("status").filter({ hasText: text });

/** Carrito con un producto y el premio de la ruleta ya guardado, una sola vez (después la prueba sigue sola). */
async function seed(page: Page, account: boolean) {
  await page.addInitScript((account) => {
    if (sessionStorage.getItem("seeded")) return;
    sessionStorage.setItem("seeded", "1");
    localStorage.setItem("velmar-demo:cart", JSON.stringify({ state: { lines: [{ id: "l1", productSlug: "vela-en-lata", variantId: "vel-patria", quantity: 1 }] }, version: 0 }));
    const user = account ? { user: { name: "Sofía Demo", email: "sofia.demo@ejemplo.com" } } : {};
    localStorage.setItem("velmar-demo:account", JSON.stringify({ state: { ...user, wheelPrize: { code: "DEMO", label: "Premio", at: "2026-10-10T12:00:00.000Z" } }, version: 0 }));
  }, account);
}

async function toPayment(page: Page) {
  await page.goto("checkout/");
  await page.getByLabel("Nombre y apellido").fill("Sofía Demo");
  await page.getByLabel("Email").fill("sofia.demo@ejemplo.com");
  await page.getByLabel("Teléfono / WhatsApp").fill("223 555-1234");
  await page.getByRole("button", { name: "Continuar a la entrega" }).click();
  await page.getByText("Retiro en persona").click();
  await page.getByRole("button", { name: "Continuar al pago" }).click();
}

test("8.4.22 con cuenta: se agrega la tarjeta de prueba en el checkout, queda en Mis tarjetas y el pedido guarda solo marca y últimos 4", async ({ page }) => {
  await seed(page, true);
  await toPayment(page);
  const methods = page.getByRole("group", { name: "¿Cómo querés pagar?" });
  await expect(methods.getByText("Tarjeta de crédito o débito", { exact: true })).toBeVisible();
  await expect(methods.getByText("Mercado Pago", { exact: true })).toBeVisible();
  await methods.getByText("Tarjeta de crédito o débito", { exact: true }).click();
  await expect(page.getByText("No tenés tarjetas guardadas todavía.")).toBeVisible();
  await page.getByRole("button", { name: "Revisar pedido" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Elegí una tarjeta o agregá una." })).toBeVisible();
  await page.getByRole("button", { name: "Agregar tarjeta" }).click();
  const dialog = page.getByRole("dialog", { name: "Nueva tarjeta" });
  await dialog.getByRole("button", { name: "Usar tarjeta de prueba" }).click();
  await dialog.getByRole("button", { name: "Guardar y usar" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("radio", { name: /Visa terminada en 4242/ })).toBeChecked();
  await page.getByRole("button", { name: "Revisar pedido" }).click();
  await expect(page.getByText("Tarjeta de crédito o débito (muestra) · Visa terminada en 4242")).toBeVisible();
  await page.getByRole("checkbox", { name: /Acepto los/ }).check();
  await page.getByRole("button", { name: "Confirmar pedido de demostración" }).click();
  await expect(page.getByRole("heading", { name: "Pago con tarjeta (muestra)" })).toBeVisible();
  await expect(page.getByText(/Visa terminada en 4242 ·/)).toBeVisible();
  // En ningún lado queda el número completo, el código ni el titular.
  const stored = await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith("velmar-demo:")).map((k) => localStorage.getItem(k)).join("\n"));
  expect(stored).not.toMatch(/4242 ?4242 ?4242/);
  expect(stored).not.toContain("Prueba Velmar");
  expect(stored).not.toContain("\"cvv\"");
  // El panel lo muestra como tarjeta, sin comprobante, y se simula la aprobación.
  await page.goto("admin-demo/pedidos/detalle/?codigo=VEL-DEMO-0001");
  await expect(page.getByText("Tarjeta · Visa terminada en 4242")).toBeVisible();
  await expect(page.getByText("Esperando la aprobación de la tarjeta").first()).toBeVisible();
  await page.getByRole("button", { name: "Simular aprobación de la tarjeta" }).click();
  await page.locator("dialog[open]").getByRole("button", { name: "Simular" }).click();
  await expect(page.getByText("Pagado con tarjeta").first()).toBeVisible();
  await page.goto("admin-demo/pagos/");
  await expect(page.getByText("VEL-DEMO-0001")).toHaveCount(0);
  // Queda en Mis tarjetas y la próxima compra la trae elegida.
  await page.goto("cuenta/#tarjetas");
  await expect(page.locator("#cuenta-seccion").getByText("Visa terminada en 4242", { exact: true })).toBeVisible();
  await page.goto("p/vela-caniche/");
  await page.getByRole("button", { name: "Agregar al carrito" }).last().click();
  await toPayment(page);
  await page.getByText("Tarjeta de crédito o débito", { exact: true }).click();
  await expect(page.getByRole("radio", { name: /Visa terminada en 4242.*en Mis tarjetas/ })).toBeChecked();
});

test("8.4.22 sin cuenta: la tarjeta se usa solo para esta compra y no se guarda", async ({ page }) => {
  await seed(page, false);
  await toPayment(page);
  await page.getByText("Tarjeta de crédito o débito", { exact: true }).click();
  await expect(page.getByText("Cargala para esta compra: sin cuenta no se guarda.")).toBeVisible();
  await page.getByRole("button", { name: "Agregar tarjeta" }).click();
  const dialog = page.getByRole("dialog", { name: "Nueva tarjeta" });
  await dialog.getByLabel("Número de la tarjeta").fill("5555 5555 5555 4444");
  await dialog.getByLabel("Vencimiento (MM/AA)").fill("1130");
  await dialog.getByLabel("Código de seguridad").fill("321");
  await dialog.getByLabel("Nombre como figura en la tarjeta").fill("Juana Pérez");
  await dialog.getByRole("button", { name: "Usar esta tarjeta" }).click();
  await expect(page.getByRole("radio", { name: /Mastercard terminada en 4444.*solo para esta compra/ })).toBeChecked();
  await page.getByRole("button", { name: "Revisar pedido" }).click();
  await expect(page.getByText("Tarjeta de crédito o débito (muestra) · Mastercard terminada en 4444")).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("velmar-demo:profile") ?? "")).not.toContain("4444");
});

test("8.4.22 Ajustes → Medios de pago: \"Tarjetas de crédito y débito\" viene activa y apagarla la saca del checkout", async ({ page }) => {
  await seed(page, false);
  await page.goto("admin-demo/ajustes/pagos/");
  const card = page.getByRole("checkbox", { name: /Tarjetas de crédito y débito/ });
  await expect(card).toBeChecked();
  await expect(page.getByText(/Velmar nunca ve el número/)).toBeVisible();
  await card.uncheck();
  await page.getByRole("button", { name: "Guardar medios de pago" }).click();
  await expect(toast(page, "Medios de pago guardados")).toBeVisible();
  await toPayment(page);
  await expect(page.getByText("Tarjeta de crédito o débito", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Mercado Pago", { exact: true })).toBeVisible();
});
