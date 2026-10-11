import { expect, test, type Page } from "@playwright/test";

/** Polish 8.2 · Lote 5: el resumen y el total se actualizan en cada paso y la opción de tarjetas (orden revisado en 8.4.5). */

async function toCheckout(page: Page) {
  // Un producto en el carrito y un premio de la ruleta ya guardado (así no se abre la ruleta antes del checkout).
  await page.addInitScript(() => {
    localStorage.setItem("velmar-demo:cart", JSON.stringify({ state: { lines: [{ id: "l1", productSlug: "vela-en-lata", variantId: "vel-patria", quantity: 2 }] }, version: 0 }));
    localStorage.setItem("velmar-demo:account", JSON.stringify({ state: { wheelPrize: { code: "DEMO", label: "Premio", at: "2026-10-10T12:00:00.000Z" } }, version: 0 }));
  });
  await page.goto("checkout/");
  await page.getByLabel("Nombre y apellido").fill("Juana Pérez");
  await page.getByLabel("Email").fill("juana@ejemplo.com");
  await page.getByLabel("Teléfono / WhatsApp").fill("223 555-1234");
}

/**
 * 8.2.9 quedó revertido por 8.4.4 y 8.4.5 (pedido de Ignacio): en "Datos" no está el resumen y, desde "Entrega", el
 * cupón y el resumen van arriba de Atrás/Siguiente (ver polish-84-product.spec.ts). Acá queda que el total se actualiza.
 */
for (const width of [1180, 390]) {
  test(`8.2.9 a ${width}px: el resumen se actualiza con la entrega y el medio de pago`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await toCheckout(page);
    const summary = page.getByRole("region", { name: "Resumen de tu compra" });
    await expect(summary).toHaveCount(0);
    await page.getByRole("button", { name: "Continuar a la entrega" }).click();
    await expect(summary.getByText("2 × Vela en lata pintada")).toBeVisible();
    await expect(summary.getByText("Elegí la entrega")).toBeVisible();
    await page.getByText("Envío al resto del país").click();
    await expect(summary.getByText("Elegí la entrega")).toHaveCount(0);
    await page.getByLabel("Calle").fill("Güemes");
    await page.getByLabel("Altura").fill("2500");
    await page.getByLabel("Código postal").fill("1000");
    await page.getByLabel("Ciudad").fill("CABA");
    await page.getByLabel("Provincia").fill("Buenos Aires");
    await page.getByRole("button", { name: "Continuar al pago" }).click();
    // Medio de pago: con transferencia aparece el descuento y baja el total; con tarjeta, no.
    const total = () => summary.locator("dd").last().textContent();
    await page.getByText("Tarjetas de débito, crédito y prepagas", { exact: true }).click();
    const withCard = await total();
    await expect(summary.getByText("Descuento transferencia/QR")).toHaveCount(0);
    await page.getByText("Transferencia bancaria").click();
    await expect(summary.getByText("Descuento transferencia/QR")).toBeVisible();
    expect(await total()).not.toBe(withCard);
    await page.getByText("Tarjetas de débito, crédito y prepagas", { exact: true }).click();
    await expect(summary.getByText("Descuento transferencia/QR")).toHaveCount(0);
    expect(await total()).toBe(withCard);
  });
}

test("8.2.10 tarjetas de débito, crédito y prepagas: se entiende cómo se pagaría y en la demo no se cobra", async ({ page }) => {
  await toCheckout(page);
  await page.getByRole("button", { name: "Continuar a la entrega" }).click();
  await page.getByText("Retiro en persona").click();
  await page.getByRole("button", { name: "Continuar al pago" }).click();
  const card = page.locator("label", { hasText: "Tarjetas de débito, crédito y prepagas" });
  await expect(card).toContainText("Pagá con tarjeta de débito, crédito o prepaga de forma segura. En esta demostración no se realiza ningún cobro real.");
  await expect(card).toContainText("vía Mercado Pago");
  // Siguen transferencia y QR con aprobación manual, y el aviso de que nada cobra.
  await expect(page.getByText("Transferencia bancaria")).toBeVisible();
  await expect(page.getByText("QR", { exact: true })).toBeVisible();
  await expect(page.getByText(/ningún medio cobra de verdad/)).toBeVisible();
  await card.click();
  await page.getByRole("button", { name: "Revisar pedido" }).click();
  await expect(page.getByText(/Tarjeta de débito, crédito o prepaga, vía Mercado Pago \(muestra\)/)).toBeVisible();
});
