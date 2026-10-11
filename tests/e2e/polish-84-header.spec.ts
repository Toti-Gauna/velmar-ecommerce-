import { expect, test } from "@playwright/test";
import { horizontalOverflow } from "./helpers";

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
