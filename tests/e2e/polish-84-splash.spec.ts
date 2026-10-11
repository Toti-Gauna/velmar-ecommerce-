import { expect, test, type Page } from "@playwright/test";
import { sampleGifts } from "../../src/demo/fixtures/gifts";

/** Polish 8.4 · Lote 2: pantalla de carga, transiciones y regalos (8.4.3, 8.4.8, 8.4.9, 8.4.25, 8.4.26 y 8.4.27). */

const preview = (page: Page, id: string) =>
  page.addInitScript((v) => localStorage.setItem("velmar-demo:theme-preview", JSON.stringify({ state: { previewId: v }, version: 0 })), id);
const splashOpen = (page: Page) => page.evaluate(() => Boolean(document.querySelector("#velmar-splash:popover-open")) && !document.documentElement.classList.contains("splash-done"));

test.describe("con movimiento", () => {
  test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: "no-preference" }); });

  test("8.4.3 el splash sale al entrar y al recargar, pero no en una carga completa desde adentro de la tienda", async ({ page }) => {
    await page.goto("");
    expect(await splashOpen(page)).toBe(true);
    await page.keyboard.press("Escape");
    // Un link que recarga la página entera (o una versión nueva publicada a mitad de la visita) entra directo.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- a propósito: carga completa desde adentro
    await page.evaluate(() => window.location.assign(`${window.location.pathname}checkout/`));
    await page.waitForURL(/checkout\/$/);
    expect(await splashOpen(page)).toBe(false);
    await expect(page.locator("#velmar-splash")).toBeHidden();
    // Recargar a mano sí la muestra.
    await page.reload();
    expect(await splashOpen(page)).toBe(true);
  });

  test("8.4.3 \"Ver en la tienda\" del panel la pide a propósito aunque venga de adentro", async ({ page }) => {
    await page.goto("admin-demo/tematicas/");
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Ver Navidad en la tienda" }).click();
    await page.waitForURL(/velmar-ecommerce-\/$/);
    expect(await splashOpen(page)).toBe(true);
    await expect(page.locator("html")).toHaveAttribute("data-season", "navidad");
  });

  test("8.4.26 mientras se ve la pantalla de carga la página queda oculta y ninguna transición se anima encima", async ({ page }) => {
    // En tablet: en el celular la tienda no usa View Transitions (8.4.28).
    await page.setViewportSize({ width: 820, height: 1180 });
    await page.goto("p/comedero-perro-globo/");
    expect(await splashOpen(page)).toBe(true);
    await expect(page.locator("html")).toHaveClass(/splash-hold/);
    expect(await page.locator("main").evaluate((m) => getComputedStyle(m).visibility)).toBe("hidden");
    // Una transición mientras se ve el splash no anima nada (termina en el acto); después, sí.
    const animations = () => page.evaluate(async () => {
      const t = document.startViewTransition(() => {});
      await t.ready;
      const n = document.getAnimations().filter((a) => (a.effect as KeyframeEffect | null)?.pseudoElement?.startsWith("::view-transition")).length;
      await t.finished;
      return n;
    });
    expect(await animations()).toBe(0);
    await page.keyboard.press("Escape");
    await expect(page.locator("html")).not.toHaveClass(/splash-hold/);
    expect(await page.locator("main").evaluate((m) => getComputedStyle(m).visibility)).toBe("visible");
  });

  test("8.4.26 sin tocar nada, la página aparece cuando sube el telón (antes de que se vaya el splash)", async ({ page }) => {
    await page.goto("");
    await expect(page.locator("html")).toHaveClass(/splash-hold/);
    // El telón sube a los 4,35 s: ahí la página ya está a la vista (el splash se termina de ir a los 5,2 s).
    await expect(page.locator("html")).not.toHaveClass(/splash-hold/, { timeout: 6000 });
    await expect(page.locator("main")).toBeVisible();
  });

  test("8.4.27 al cambiar de sección, la barra inferior y el header van en su capa, encima de la página", async ({ page }) => {
    // En tablet (la barra inferior está hasta 1024 px); en el celular el cambio va sin View Transitions (8.4.28).
    await page.setViewportSize({ width: 820, height: 1180 });
    await page.goto("cupones/");
    await page.keyboard.press("Escape");
    const nav = page.locator("[data-shop-bottomnav]");
    expect(await nav.evaluate((n) => getComputedStyle(n).viewTransitionName)).toBe("shop-tabbar");
    expect(await page.locator("[data-shop-header]").evaluate((n) => getComputedStyle(n).viewTransitionName)).toBe("shop-header");
    const layers = await page.evaluate(async () => {
      const original = document.startViewTransition.bind(document);
      let ready: Promise<unknown> | null = null;
      document.startViewTransition = ((arg: Parameters<typeof original>[0]) => { const t = original(arg); ready = t.ready; return t; }) as typeof document.startViewTransition;
      document.querySelector<HTMLAnchorElement>('[data-shop-bottomnav] a[href*="categorias"]')!.click();
      for (let i = 0; i < 100 && !ready; i++) await new Promise((r) => setTimeout(r, 20));
      await ready;
      const z = (name: string) => Number(getComputedStyle(document.documentElement, `::view-transition-group(${name})`).zIndex);
      return { tabbar: z("shop-tabbar"), header: z("shop-header") };
    });
    expect(layers.tabbar).toBe(50);
    expect(layers.header).toBe(50);
    await expect(page).toHaveURL(/categorias\/$/);
  });

  test("8.4.25 el link de un regalo con la temática del Día de la Madre deja correr la escena de la pantalla de carga", async ({ page }) => {
    await preview(page, "dia-de-la-madre");
    const g = sampleGifts.find((x) => x.occasion === "dia-de-la-madre")!;
    await page.goto(`regalo/?c=${g.code}`);
    await expect(page.locator("html")).toHaveClass(/stage-open/);
    const petal = page.locator("#velmar-splash .season-scene .md-petal").first();
    await expect(petal).toBeAttached({ timeout: 4500 });
    expect(await petal.evaluate((e) => getComputedStyle(e).animationPlayState)).toBe("running");
  });
});

test("8.4.8 al abrir un regalo de la cuenta el escenario ya está oscuro y no asoman los textos de la página", async ({ page }) => {
  await page.goto("cuenta/");
  await page.getByRole("button", { name: "Entrar a la cuenta demo" }).click();
  await page.getByRole("link", { name: "Mis regalos" }).click();
  await page.getByRole("link", { name: /Sin abrir · de Lucía/ }).click();
  const stage = page.getByRole("dialog", { name: "Regalo de Lucía para Sofía" });
  await expect(stage).toBeVisible();
  await expect(stage).toHaveClass(/immersive-instant/);
  expect(await stage.locator(".immersive-backdrop").evaluate((b) => getComputedStyle(b).animationName)).toBe("none");
  await expect(page.locator("main").getByRole("heading", { level: 1 })).toHaveCount(0);
});

test("8.4.9 al salir de un regalo abierto desde Mis regalos se vuelve a la cuenta, no a otra pantalla para abrirlo", async ({ page }) => {
  await page.goto("cuenta/");
  await page.getByRole("button", { name: "Entrar a la cuenta demo" }).click();
  await page.getByRole("link", { name: "Mis regalos" }).click();
  await page.getByRole("link", { name: /Sin abrir · de Lucía/ }).click();
  const stage = page.getByRole("dialog", { name: "Regalo de Lucía para Sofía" });
  await stage.getByRole("button", { name: "Abrirlo de una vez" }).click();
  await expect(stage.getByText("¡Feliz día, ma!", { exact: false })).toBeVisible();
  await stage.getByRole("button", { name: "Volver a Mis regalos" }).click();
  await expect(page).toHaveURL(/cuenta\/#regalos$/);
  await expect(page.getByRole("link", { name: /Abierto · de Lucía/ })).toBeVisible();
  await expect(page.getByText(/te mandó un regalo|tenés un regalo/)).toHaveCount(0);
});

test("8.4.9 por link: después de abrirlo, al salir queda \"ya lo abriste\" y \"Ver mi regalo\" muestra lo de adentro", async ({ page }) => {
  const g = sampleGifts.find((x) => x.occasion === "pascuas")!;
  await page.goto(`regalo/?c=${g.code}`);
  const stage = page.getByRole("dialog", { name: `Regalo de ${g.from} para ${g.to}` });
  await stage.getByRole("button", { name: "Abrirlo de una vez" }).click();
  await expect(stage.getByRole("heading", { name: g.item.name })).toBeVisible();
  await stage.getByRole("button", { name: "Salir" }).click();
  await expect(page.getByRole("heading", { level: 1, name: `Tu regalo de ${g.from}` })).toBeVisible();
  await expect(page.getByText("tenés un regalo")).toHaveCount(0);
  await page.getByRole("button", { name: "Ver mi regalo" }).click();
  await expect(stage.getByRole("heading", { name: g.item.name })).toBeVisible();
  await expect(stage.getByRole("button", { name: /Golpeá el regalo/ })).toHaveCount(0);
  // Sin abrirlo, salir deja la invitación a abrirlo (no "ya lo abriste").
  const other = sampleGifts.find((x) => x.occasion === "navidad")!;
  await page.goto(`regalo/?c=${other.code}`);
  await page.getByRole("dialog", { name: `Regalo de ${other.from} para ${other.to}` }).getByRole("button", { name: "Salir" }).click();
  await expect(page.getByRole("heading", { level: 1, name: `${other.to}, tenés un regalo de ${other.from}` })).toBeVisible();
  await expect(page.getByRole("button", { name: "Abrir mi regalo" })).toBeVisible();
});
