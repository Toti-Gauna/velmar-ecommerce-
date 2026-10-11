import { expect, test, type Page } from "@playwright/test";

/** Polish 8.4 · Lote 3: texto premium sobre la pieza (8.4.1), migas fijas (8.4.2) y orden del checkout (8.4.4 y 8.4.5). */

const TEXT_PRODUCTS = [
  { slug: "vela-souvenir-flores", finish: "engraved", sample: "Ámbar" },
  { slug: "comedero-elevado-madera", finish: "engraved", sample: "TOBY" },
  { slug: "colgador-de-correa", finish: "engraved", sample: null },
  { slug: "comedero-perro-globo", finish: "raised", sample: null },
] as const;

for (const p of TEXT_PRODUCTS) {
  test(`8.4.1 ${p.slug}: el texto se dibuja sobre la pieza (${p.finish === "engraved" ? "grabado" : "en relieve"}), sin cartel blanco ni el nombre de muestra`, async ({ page }) => {
    await page.goto(`p/${p.slug}/`);
    await page.getByLabel("Texto", { exact: true }).fill("Lucía");
    const mark = page.locator(`[data-finish="${p.finish}"]`).first();
    await expect(mark).toBeAttached();
    await expect(mark.locator("text").first()).toHaveText("Lucía");
    const svg = mark.locator("xpath=ancestor::*[local-name()='svg'][1]");
    // Ningún rectángulo tapa la pieza y el nombre de muestra de la ilustración no aparece debajo.
    expect(await svg.locator("rect").count()).toBe(0);
    if (p.sample) expect(await svg.locator("xpath=..").locator("svg text", { hasText: p.sample }).count()).toBe(0);
  });
}

test("8.4.1 en el carrito, la vela muestra el nombre del cliente grabado (antes quedaba el de muestra)", async ({ page }) => {
  await page.goto("p/vela-souvenir-flores/");
  await page.getByLabel("Texto", { exact: true }).fill("Bauti");
  await page.getByRole("button", { name: "Agregar al carrito" }).filter({ visible: true }).click();
  await page.goto("carrito/");
  const thumb = page.locator("main [data-finish='engraved']").first();
  await expect(thumb.locator("text").first()).toHaveText("Bauti");
});

test.describe("escritorio", () => {
  test.use({ viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false });

  test("8.4.2 al bajar por la compra, las migas quedan fijas arriba de la galería", async ({ page }) => {
    await page.goto("p/comedero-perro-globo/");
    const crumbs = page.getByRole("navigation", { name: "Ruta de navegación" });
    const gallery = page.locator("[data-vt-hero]").first();
    await page.mouse.wheel(0, 700);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(400);
    await expect(crumbs).toBeInViewport();
    const c = (await crumbs.boundingBox())!, g = (await gallery.boundingBox())!;
    expect(c.y + c.height).toBeLessThanOrEqual(g.y + 1);
    expect(g.y - (c.y + c.height)).toBeLessThan(40);
  });
});

async function toCheckout(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem("velmar-demo:cart", JSON.stringify({ state: { lines: [{ id: "l1", productSlug: "vela-en-lata", variantId: "vel-patria", quantity: 2 }] }, version: 0 }));
    localStorage.setItem("velmar-demo:account", JSON.stringify({ state: { wheelPrize: { code: "DEMO", label: "Premio", at: "2026-10-10T12:00:00.000Z" } }, version: 0 }));
  });
  await page.goto("checkout/");
}

/** Arriba hacia abajo: fin de las opciones del paso, cupón, resumen y botones. */
const order = (page: Page) => page.evaluate(() => {
  const box = (sel: string) => document.querySelector(sel)?.getBoundingClientRect() ?? null;
  const buttons = [...document.querySelectorAll("main button")].filter((b) => /^(Atrás|Continuar al pago|Revisar pedido|Confirmar pedido de demostración)$/.test(b.textContent?.trim() ?? ""));
  return {
    options: Math.max(0, ...[...document.querySelectorAll("main form#checkout-paso fieldset, main form#checkout-paso dl")].map((f) => f.getBoundingClientRect().bottom)),
    coupon: box("section[aria-label='Cupón del pedido']"),
    summary: box("section[aria-label='Resumen de tu compra']"),
    buttons: buttons.map((b) => ({ t: b.textContent?.trim(), top: b.getBoundingClientRect().top, x: b.getBoundingClientRect().x })),
  };
});

for (const width of [1180, 820, 390]) {
  test(`8.4.4 y 8.4.5 a ${width}px: en Datos no está el carrito; después, cupón y resumen arriba de Atrás/Siguiente`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await toCheckout(page);
    await expect(page.getByRole("heading", { level: 2, name: "Datos" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Resumen de tu compra" })).toHaveCount(0);
    await expect(page.getByRole("region", { name: "Cupón del pedido" })).toHaveCount(0);
    await page.getByLabel("Nombre y apellido").fill("Juana Pérez");
    await page.getByLabel("Email").fill("juana@ejemplo.com");
    await page.getByLabel("Teléfono / WhatsApp").fill("223 555-1234");
    await page.getByRole("button", { name: "Continuar a la entrega" }).click();
    await page.getByText("Retiro en persona").click();
    for (const next of ["Continuar al pago", "Revisar pedido", "Confirmar pedido de demostración"]) {
      const o = await order(page);
      expect(o.coupon!.top, "cupón debajo de las opciones").toBeGreaterThanOrEqual(o.options - 1);
      expect(o.summary!.top).toBeGreaterThan(o.coupon!.top);
      expect(o.buttons.map((b) => b.t)).toEqual(["Atrás", next]);
      for (const b of o.buttons) expect(b.top, `${b.t} debajo del resumen`).toBeGreaterThan(o.summary!.bottom);
      expect(o.buttons[0]!.x).toBeLessThanOrEqual(o.buttons[1]!.x);
      if (next === "Revisar pedido") await page.getByText("Transferencia bancaria").click();
      if (next !== "Confirmar pedido de demostración") await page.getByRole("button", { name: next }).click();
    }
    // El botón de afuera sigue enviando el paso: sin aceptar los términos avisa; aceptados, confirma.
    await page.getByRole("button", { name: "Confirmar pedido de demostración" }).click();
    await expect(page.getByText("Para continuar, aceptá los términos.")).toBeVisible();
    await page.getByRole("checkbox", { name: /Acepto los/ }).check();
    await page.getByRole("button", { name: "Confirmar pedido de demostración" }).click();
    await expect(page).toHaveURL(/checkout\/confirmacion\/$/);
  });
}
