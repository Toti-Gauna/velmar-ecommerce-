import { expect, test, type Page } from "@playwright/test";
import { horizontalOverflow } from "./helpers";

/** Fuerza una temática (la del día depende de la fecha en que corre la prueba). */
const preview = (page: Page, id: string) =>
  page.addInitScript((v) => localStorage.setItem("velmar-demo:theme-preview", JSON.stringify({ state: { previewId: v }, version: 0 })), id);

/** Polish 8.4 · Lote 5: íconos del encabezado agrupados (8.4.12) y sin aviso de demo ni "Reiniciar demo" (8.4.13). */

test.describe("escritorio", () => {
  test.use({ viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false });

  test("8.4.12 preferencias en su cápsula, un separador y después buscar, favoritos, cuenta y carrito", async ({ page }) => {
    await page.goto("");
    const header = page.locator("[data-shop-header]");
    const prefs = header.getByRole("group", { name: "Preferencias" });
    const shop = header.getByRole("group", { name: "Tu compra" });
    await expect(prefs.getByRole("button", { name: "Sonidos" })).toBeVisible();
    await expect(prefs.getByRole("button", { name: /modo oscuro/i })).toBeVisible();
    for (const label of ["Buscar", "Favoritos", "Mi cuenta (demo)"]) await expect(shop.getByLabel(label, { exact: true })).toBeVisible();
    await expect(shop.getByRole("button", { name: /^Carrito/ })).toBeVisible();
    const p = (await prefs.boundingBox())!, s = (await shop.boundingBox())!;
    expect(s.x - (p.x + p.width), "separación entre grupos").toBeGreaterThan(16);
    expect(Math.abs((p.y + p.height / 2) - (s.y + s.height / 2))).toBeLessThan(2);
  });
});

for (const width of [390, 320]) {
  test(`8.4.12 a ${width}px: sonido aparte, buscar y carrito juntos, sin desborde`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("");
    const header = page.locator("[data-shop-header]");
    await expect(header.getByRole("group", { name: "Preferencias" }).getByRole("button", { name: "Sonidos" })).toBeVisible();
    await expect(header.getByRole("group", { name: "Tu compra" }).getByRole("button", { name: "Buscar" })).toBeVisible();
    await expect(header.getByRole("group", { name: "Tu compra" }).getByRole("button", { name: /^Carrito/ })).toBeVisible();
    expect(await horizontalOverflow(page)).toBe(0);
    const right = await header.evaluate((h) => Math.max(...[...h.querySelectorAll("button, a")].map((e) => e.getBoundingClientRect().right)));
    expect(right).toBeLessThanOrEqual(width);
  });
}

test("8.4.13 la tienda no muestra el aviso de demo ni \"Reiniciar demo\"; el checkout sigue diciendo que no cobra", async ({ page }) => {
  for (const route of ["", "categorias/", "p/vela-caniche/", "cuenta/"]) {
    await page.goto(route);
    await expect(page.locator("[data-shop-header]")).toBeVisible();
    await expect(page.getByText("Reiniciar demo")).toHaveCount(0);
    await expect(page.getByText("No se cobra nada ni se guarda ningún pedido real")).toHaveCount(0);
  }
  await page.goto("p/vela-caniche/");
  await page.getByRole("button", { name: "Agregar al carrito" }).last().click();
  await page.goto("checkout/");
  await page.getByLabel("Nombre y apellido").fill("Juana Pérez");
  await page.getByLabel("Email").fill("juana@ejemplo.com");
  await page.getByLabel("Teléfono / WhatsApp").fill("223 555-1234");
  await page.getByRole("button", { name: "Continuar a la entrega" }).click();
  await page.getByText("Retiro en persona").click();
  await page.getByRole("button", { name: "Continuar al pago" }).click();
  await expect(page.getByText(/ningún medio cobra de verdad/)).toBeVisible();
});

test("8.4.13 el panel no tiene \"Reiniciar demo\" pero mantiene su aviso de demostración", async ({ page }) => {
  await page.goto("admin-demo/");
  await expect(page.getByText("Panel de demostración · datos ficticios")).toBeVisible();
  await expect(page.getByRole("button", { name: "Reiniciar demo" })).toHaveCount(0);
});

test("8.4.13 sin el aviso de demo, la cinta de la temática se ve arriba del header (su fondo extendido no la tapa)", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await preview(page, "dia-de-la-madre");
  await page.goto("");
  await page.keyboard.press("Escape");
  const ribbon = page.locator("[data-theme-ribbon]");
  await expect(ribbon).toBeVisible();
  const header = page.locator("[data-shop-header]");
  await expect(header).not.toHaveClass(/bleed-top/);
  const r = (await ribbon.boundingBox())!, h = (await header.boundingBox())!;
  expect(h.y).toBeGreaterThanOrEqual(r.y + r.height - 1);
  // Al bajar, el header queda pegado arriba y recién ahí extiende su fondo hacia la franja de la hora.
  await page.evaluate(() => window.scrollTo(0, 600));
  await expect(header).toHaveClass(/bleed-top/);
});
