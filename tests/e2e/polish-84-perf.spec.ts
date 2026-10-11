import { expect, test, type Page } from "@playwright/test";

/** Fuerza una temática (la del día depende de la fecha en que corre la prueba). */
const preview = (page: Page, id: string) =>
  page.addInitScript((v) => localStorage.setItem("velmar-demo:theme-preview", JSON.stringify({ state: { previewId: v }, version: 0 })), id);

/**
 * Polish 8.4 · Lote 10: rendimiento en el celular (8.4.28). Los fps se midieron aparte (docs/polish-8.4-status.md);
 * acá se cuida que sigan las decisiones que los sostienen.
 */

test.describe("celular", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("8.4.28 el cambio de sección va sin View Transitions y la página entra con el fundido CSS", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("cupones/");
    await page.keyboard.press("Escape");
    await expect(page.locator("html")).toHaveClass(/vt-off/);
    expect(await page.evaluate(() => typeof document.startViewTransition)).toBe("undefined");
    await page.locator("[data-shop-bottomnav]").getByRole("link", { name: "Categorías" }).click();
    await expect(page).toHaveURL(/categorias\/$/);
    expect(await page.locator(".page-enter").first().evaluate((el) => getComputedStyle(el).animationName)).toBe("fade-up");
    // La pastilla del tab activo se mueve con CSS (sin motion): queda sobre "Categorías", el segundo de cinco.
    const pill = page.locator("[data-shop-bottomnav] > span > span").first();
    await expect.poll(() => pill.evaluate((el) => getComputedStyle(el).transform)).toMatch(/matrix\(1, 0, 0, 1, \d+(\.\d+)?, 0\)/);
    const link = (await page.locator("[data-shop-bottomnav]").getByRole("link", { name: "Categorías" }).boundingBox())!;
    await expect.poll(async () => { const b = (await pill.boundingBox())!; return Math.abs(b.x + b.width / 2 - (link.x + link.width / 2)); }).toBeLessThan(3);
    expect(errors).toEqual([]);
  });

  test("8.4.28 menos partículas en el fondo y el banner, collares quietos en las tarjetas y etiquetas sin desenfoque", async ({ page }) => {
    await preview(page, "dia-de-la-madre");
    await page.goto("");
    await page.keyboard.press("Escape");
    const visible = (sel: string) => page.locator(sel).evaluateAll((els) => [els.length, els.filter((e) => getComputedStyle(e).display !== "none").length] as const);
    const [bgAll, bgOn] = await visible(".season-backdrop .amb");
    expect(bgAll).toBeGreaterThan(0);
    expect(bgOn).toBeLessThanOrEqual(Math.ceil(bgAll / 3));
    const [bnAll, bnOn] = await visible("[data-theme-banner] .amb");
    expect(bnOn).toBeLessThanOrEqual(Math.ceil(bnAll / 4));
    const swinging = await page.locator("[data-product-card] .collar-swing").evaluateAll((els) => els.filter((e) => e.getAnimations().length > 0).length);
    expect(swinging).toBe(0);
    const blurred = await page.locator("[data-product-card] span").evaluateAll((els) => els.filter((e) => getComputedStyle(e).backdropFilter !== "none").length);
    expect(blurred).toBe(0);
    expect(await page.evaluate(() => getComputedStyle(document.body, "::before").display)).toBe("none");
  });
});

test("8.4.28 en tablet y escritorio sigue la View Transition entre páginas", async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.goto("cupones/");
  await expect(page.locator("html")).not.toHaveClass(/vt-off/);
  expect(await page.evaluate(() => typeof document.startViewTransition)).toBe("function");
});
