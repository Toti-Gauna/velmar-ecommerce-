import { expect, test, type Page } from "@playwright/test";

/** Polish 8.4 · Lote 4: Mi cuenta con direcciones (8.4.6), volver a Mis pedidos (8.4.7), mascotas (8.4.14) y tarjetas (8.4.22). */

const login = async (page: Page, tab: string) => {
  await page.goto("cuenta/");
  await page.getByRole("button", { name: "Entrar a la cuenta demo" }).click();
  await page.getByRole("link", { name: new RegExp(tab) }).first().click();
};
const toast = (page: Page, text: string | RegExp) => page.getByRole("status").filter({ hasText: text });
const stored = (page: Page, key: string) => page.evaluate((k) => localStorage.getItem(`velmar-demo:${k}`) ?? "", key);

test("8.4.6 direcciones: agregar en un modal (con validación), elegir la principal, editar y quitar", async ({ page }) => {
  await login(page, "Direcciones");
  const section = page.locator("#cuenta-seccion");
  await expect(section.getByText("Calle de Muestra 1234")).toBeVisible();
  await expect(section.getByText("Principal")).toHaveCount(1);
  await section.getByRole("button", { name: "Agregar dirección" }).click();
  const dialog = page.getByRole("dialog", { name: "Nueva dirección" });
  await dialog.getByRole("button", { name: "Guardar dirección" }).click();
  await expect(dialog.getByText("Poné un nombre corto (ej.: Casa, Trabajo).")).toBeVisible();
  await expect(dialog.getByLabel("Nombre de la dirección")).toBeFocused();
  await dialog.getByLabel("Nombre de la dirección").fill("Trabajo");
  await dialog.getByLabel("Calle").fill("Güemes");
  await dialog.getByLabel("Altura").fill("2500");
  await dialog.getByLabel("Código postal").fill("76");
  await dialog.getByRole("button", { name: "Guardar dirección" }).click();
  await expect(dialog.getByText("Código postal de 4 dígitos (ej.: 7600).")).toBeVisible();
  await dialog.getByLabel("Código postal").fill("7600");
  await dialog.getByRole("button", { name: "Guardar dirección" }).click();
  await expect(dialog).toBeHidden();
  await expect(toast(page, "Dirección guardada")).toBeVisible();
  await expect(section.getByText("Güemes 2500, Mar del Plata (7600), Buenos Aires")).toBeVisible();
  await section.getByRole("button", { name: "Usar como principal" }).click();
  await expect(section.locator("li", { hasText: "Trabajo" }).getByText("Principal")).toBeVisible();
  await section.getByRole("button", { name: "Editar Trabajo" }).click();
  await page.getByRole("dialog", { name: "Editar dirección" }).getByLabel("Altura").fill("2600");
  await page.getByRole("dialog", { name: "Editar dirección" }).getByRole("button", { name: "Guardar dirección" }).click();
  await expect(section.getByText("Güemes 2600")).toBeVisible();
  await page.reload();
  await expect(page.locator("#cuenta-seccion").getByText("Güemes 2600")).toBeVisible();
  await page.locator("#cuenta-seccion li", { hasText: "Casa" }).getByRole("button", { name: "Quitar" }).click();
  await page.locator("dialog[open]").getByRole("button", { name: "Quitar" }).click();
  await expect(page.locator("#cuenta-seccion").getByText("Calle de Muestra 1234")).toHaveCount(0);
});

test("8.4.6 en el checkout se elige una dirección guardada; \"Otra dirección\" se escribe y se puede guardar", async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem("seeded")) return;
    sessionStorage.setItem("seeded", "1");
    localStorage.setItem("velmar-demo:cart", JSON.stringify({ state: { lines: [{ id: "l1", productSlug: "vela-en-lata", variantId: "vel-patria", quantity: 2 }] }, version: 0 }));
    localStorage.setItem("velmar-demo:account", JSON.stringify({ state: { user: { name: "Sofía Demo", email: "sofia.demo@ejemplo.com" }, wheelPrize: { code: "DEMO", label: "Premio", at: "2026-10-10T12:00:00.000Z" } }, version: 0 }));
  });
  await page.goto("checkout/");
  await page.getByLabel("Nombre y apellido").fill("Sofía Demo");
  await page.getByLabel("Email").fill("sofia.demo@ejemplo.com");
  await page.getByLabel("Teléfono / WhatsApp").fill("223 555-1234");
  await page.getByRole("button", { name: "Continuar a la entrega" }).click();
  await page.getByText("Cadete en Mar del Plata").click();
  const saved = page.getByRole("group", { name: "¿A qué dirección?" });
  await expect(saved.getByRole("radio", { name: /Casa/ })).toBeChecked();
  await expect(page.getByLabel("Calle", { exact: true })).toHaveCount(0);
  await saved.getByText("Otra dirección").click();
  await expect(page.getByLabel("Calle", { exact: true })).toHaveValue("");
  await page.getByLabel("Calle", { exact: true }).fill("Colón");
  await page.getByLabel("Altura").fill("1500");
  await page.getByLabel("Código postal").fill("7600");
  await page.getByLabel("Ciudad").fill("Mar del Plata");
  await page.getByLabel("Provincia").fill("Buenos Aires");
  await page.getByLabel("Guardarla en Mis direcciones").check();
  await page.getByLabel("Nombre de la dirección").fill("Lo de mamá");
  await page.getByRole("button", { name: "Continuar al pago" }).click();
  await expect(page.getByRole("heading", { level: 2, name: "Pago" })).toBeVisible();
  await page.getByRole("button", { name: "Atrás" }).click();
  // Vuelve con la recién guardada elegida.
  await expect(page.getByRole("group", { name: "¿A qué dirección?" }).getByRole("radio", { name: /Lo de mamá/ })).toBeChecked();
  await page.goto("cuenta/#direcciones");
  await expect(page.locator("#cuenta-seccion").getByText("Colón 1500, Mar del Plata (7600), Buenos Aires")).toBeVisible();
});

test("8.4.7 desde el detalle de un pedido se vuelve a Mis pedidos", async ({ page }) => {
  await login(page, "Mis pedidos");
  await page.locator("#cuenta-seccion").getByRole("link", { name: /VEL-DEMO-0000/ }).click();
  await expect(page).toHaveURL(/pedido\/demo-velmar\/$/);
  await page.getByRole("link", { name: "Volver a Mis pedidos" }).click();
  await expect(page).toHaveURL(/cuenta\/#pedidos$/);
  await expect(page.getByRole("heading", { level: 2, name: "Mis pedidos" })).toBeVisible();
});

test("8.4.14 el cliente carga a su mascota con el cumpleaños y el dueño la ve en la ficha del cliente", async ({ page }) => {
  await login(page, "Mis mascotas");
  const section = page.locator("#cuenta-seccion");
  await section.getByRole("button", { name: "Agregar mascota" }).click();
  const dialog = page.getByRole("dialog", { name: "Nueva mascota" });
  await dialog.getByRole("button", { name: "Guardar mascota" }).click();
  await expect(dialog.getByText("Escribí su nombre.")).toBeVisible();
  await dialog.getByLabel("Nombre").fill("Ñoqui");
  await dialog.getByLabel("Raza o color (opcional)").fill("Mestizo");
  await dialog.getByLabel("Día del cumpleaños").selectOption("09");
  await dialog.getByLabel("Mes del cumpleaños").selectOption("10");
  await dialog.getByRole("button", { name: "Guardar mascota" }).click();
  await expect(toast(page, "Ñoqui guardado")).toBeVisible();
  await expect(section.getByText("9 de octubre")).toBeVisible();
  await page.goto("admin-demo/usuarios/ficha/?email=sofia.demo@ejemplo.com");
  await expect(page.getByRole("region", { name: "Mascotas" })).toContainText("Ñoqui");
  await expect(page.getByRole("region", { name: "Mascotas" })).toContainText("9 de octubre");
});

test("8.4.22 tarjetas: validación, tarjeta de prueba y se guardan solo marca, últimos 4 y vencimiento", async ({ page }) => {
  await login(page, "Mis tarjetas");
  const section = page.locator("#cuenta-seccion");
  await expect(section.getByText(/nunca el número completo ni el código/)).toBeVisible();
  await section.getByRole("button", { name: "Agregar tarjeta" }).click();
  const dialog = page.getByRole("dialog", { name: "Nueva tarjeta" });
  await dialog.getByLabel("Número de la tarjeta").fill("4242424242424241");
  await expect(dialog.getByLabel("Número de la tarjeta")).toHaveValue("4242 4242 4242 4241");
  await dialog.getByRole("button", { name: "Guardar tarjeta" }).click();
  await expect(dialog.getByText("Revisá el número: no es una tarjeta válida.")).toBeVisible();
  await dialog.getByRole("button", { name: "Usar tarjeta de prueba" }).click();
  await expect(dialog.getByText("Visa detectada")).toBeVisible();
  await dialog.getByRole("button", { name: "Guardar tarjeta" }).click();
  await expect(dialog).toBeHidden();
  await expect(section.getByText("Visa terminada en 4242", { exact: true })).toBeVisible();
  await expect(section.getByText("Vence 12/29")).toBeVisible();
  const saved = await stored(page, "profile");
  expect(saved).toContain("\"last4\":\"4242\"");
  expect(saved).not.toMatch(/4242 ?4242 ?4242/);
  expect(saved).not.toContain("Prueba Velmar");
  expect(saved).not.toContain("\"cvv\"");
  await section.getByRole("button", { name: "Quitar" }).click();
  await page.locator("dialog[open]").getByRole("button", { name: "Quitar" }).click();
  await expect(section.getByText("Visa terminada en 4242", { exact: true })).toHaveCount(0);
});

for (const [width, height] of [[1180, 820], [820, 1180], [375, 812]] as const) {
  test(`8.4.6/8.4.22 a ${width}×${height}: los modales de la cuenta entran enteros y sin desborde`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await login(page, "Mis tarjetas");
    await page.locator("#cuenta-seccion").getByRole("button", { name: "Agregar tarjeta" }).click();
    const dialog = page.getByRole("dialog", { name: "Nueva tarjeta" });
    await expect(dialog.getByRole("button", { name: "Guardar tarjeta" })).toBeInViewport();
    const box = (await dialog.boundingBox())!;
    expect(box.y + box.height).toBeLessThanOrEqual(height + 1);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
  });
}
