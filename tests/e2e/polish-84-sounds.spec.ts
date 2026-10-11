import { expect, test, type Page } from "@playwright/test";

/** Polish 8.4 · Lote 11: sonidos en toda la tienda y el panel (8.4.29). Se lee el registro de lo que sonó. */

const sounds = (page: Page) => page.evaluate(() => window.__velmarSounds ?? []);
const clear = (page: Page) => page.evaluate(() => { window.__velmarSounds = []; });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => { window.__velmarSounds = []; });
});

test("8.4.29 tienda: links, botones y modales suenan; entrar a un producto, sumar, restar, escribir y quitar también", async ({ page }) => {
  await page.goto("");
  await page.keyboard.press("Escape");
  await clear(page);
  await page.locator("[data-shop-header]").getByRole("button", { name: "Buscar" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(await sounds(page)).toContain("modalOpen");
  await page.keyboard.press("Escape");
  await expect.poll(() => sounds(page)).toContain("modalClose");
  await clear(page);
  await page.locator("[data-shop-bottomnav]").getByRole("link", { name: "Categorías" }).click();
  await expect(page).toHaveURL(/categorias\/$/);
  expect(await sounds(page)).toContain("nav");

  await page.goto("p/collar-con-nombre/");
  await page.keyboard.press("Escape");
  await expect.poll(() => sounds(page)).toContain("product");
  await clear(page);
  await page.getByLabel("Nombre", { exact: true }).pressSequentially("Simba", { delay: 70 });
  expect((await sounds(page)).filter((s) => s === "type").length).toBeGreaterThanOrEqual(3);
  await clear(page);
  await page.getByLabel("Cantidad:").selectOption("2");
  expect(await sounds(page)).toContain("select");
});

test("8.4.29 agregar al carrito suena a \"agregar\" sin el clic encima; sumar y restar suben y bajan; quitar suena a \"se va\"", async ({ page }) => {
  await page.goto("p/vela-caniche/");
  await page.keyboard.press("Escape");
  await clear(page);
  await page.getByRole("button", { name: "Agregar al carrito" }).last().click();
  await expect.poll(() => sounds(page)).toContain("add");
  expect(await sounds(page)).not.toContain("tap");
  const drawer = page.getByRole("dialog", { name: /Carrito/ });
  await expect(drawer).toBeVisible();
  await clear(page);
  await drawer.getByRole("button", { name: "Sumar uno" }).first().click();
  await drawer.getByRole("button", { name: "Restar uno" }).first().click();
  expect(await sounds(page)).toEqual(expect.arrayContaining(["up", "down"]));
  await clear(page);
  await drawer.getByRole("button", { name: /^Quitar / }).first().click();
  expect(await sounds(page)).toContain("remove");
});

test("8.4.29 checkout: avanzar sube y volver baja, sin el clic del botón", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("velmar-demo:cart", JSON.stringify({ state: { lines: [{ id: "l1", productSlug: "vela-en-lata", variantId: "vel-patria", quantity: 1 }] }, version: 0 }));
    localStorage.setItem("velmar-demo:account", JSON.stringify({ state: { wheelPrize: { code: "DEMO", label: "Premio", at: "2026-10-10T12:00:00.000Z" } }, version: 0 }));
  });
  await page.goto("checkout/");
  await page.getByLabel("Nombre y apellido").fill("Juana Pérez");
  await page.getByLabel("Email").fill("juana@ejemplo.com");
  await page.getByLabel("Teléfono / WhatsApp").fill("223 555-1234");
  await clear(page);
  await page.getByRole("button", { name: "Continuar a la entrega" }).click();
  await expect(page.getByRole("heading", { level: 2, name: "Entrega" })).toBeVisible();
  expect(await sounds(page)).toEqual(["step"]);
  await clear(page);
  await page.getByRole("button", { name: "Atrás" }).click();
  expect(await sounds(page)).toEqual(["back"]);
});

test("8.4.29 panel: suena al sumar stock, al guardar, en los interruptores y al vaciar; su botón de silencio es el mismo de la tienda", async ({ page }) => {
  await page.goto("admin-demo/stock/");
  await clear(page);
  await page.getByRole("button", { name: /^Sumar 1 a / }).first().click();
  await expect.poll(() => sounds(page)).toContain("up");
  await page.goto("admin-demo/emails/");
  await clear(page);
  await page.getByRole("switch", { name: "Se envía solo: Gracias por tu compra" }).click();
  await expect.poll(() => sounds(page)).toEqual(expect.arrayContaining(["toggleOff", "success"]));
  // Silencio desde el panel: no suena nada más, tampoco en la tienda.
  const mute = page.getByRole("button", { name: "Sonidos", exact: true });
  await expect(mute).toHaveAttribute("aria-pressed", "true");
  await mute.click();
  await expect(mute).toHaveAttribute("aria-pressed", "false");
  await clear(page);
  await page.getByRole("switch", { name: "Se envía solo: Gracias por tu compra" }).click();
  expect(await sounds(page)).toEqual([]);
  await page.goto("");
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-shop-header]").getByRole("button", { name: "Sonidos", exact: true })).toHaveAttribute("aria-pressed", "false");
  await page.goto("admin-demo/emails/");
  await page.getByRole("button", { name: "Sonidos", exact: true }).click();
  await page.goto("admin-demo/emails/enviados/");
  await clear(page);
  await page.getByRole("button", { name: "Vaciar" }).click();
  await page.locator("dialog[open]").getByRole("button", { name: "Vaciar" }).click();
  await expect.poll(() => sounds(page)).toContain("remove");
});
