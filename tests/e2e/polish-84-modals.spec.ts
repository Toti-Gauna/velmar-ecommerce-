import { expect, test, type Locator, type Page } from "@playwright/test";

/** Polish 8.4 · Lote 1: base de modales (8.4.10, 8.4.11, 8.4.16, 8.4.20 y 8.4.21). */

const giftDialog = (page: Page) => page.getByRole("dialog", { name: "Es para regalar" });

/**
 * Arrastra un dedo sobre `el` con eventos táctiles sintéticos y devuelve si la página los canceló (así frena el scroll
 * de atrás Safari de iPhone/iPad, que ignora `overflow: hidden`). `up` = el dedo sube (el contenido baja).
 */
const swipeBlocked = (el: Locator, up = true) =>
  el.evaluate((node, up) => {
    const r = node.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + Math.min(r.height / 2, 200);
    const touch = (dy: number) => new Touch({ identifier: 1, target: node, clientX: x, clientY: y + dy });
    node.dispatchEvent(new TouchEvent("touchstart", { bubbles: true, cancelable: true, touches: [touch(0)] }));
    const moved = node.dispatchEvent(new TouchEvent("touchmove", { bubbles: true, cancelable: true, touches: [touch(up ? -40 : 40)] }));
    node.dispatchEvent(new TouchEvent("touchend", { bubbles: true, cancelable: true, touches: [] }));
    return !moved;
  }, up);

test("8.4.11 con un modal abierto, arrastrar el dedo fuera de lo que se desplaza no mueve la página; al cerrar vuelve", async ({ page }) => {
  await page.goto("p/home-spray/");
  await page.locator("#personalizar").getByRole("button", { name: "Regalar ahora" }).click();
  const modal = giftDialog(page);
  await expect(modal.getByLabel("Para", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("hidden");
  // El velo y el título (que no se desplazan) no arrastran la página de atrás.
  await expect.poll(() => swipeBlocked(page.locator(".fixed.inset-0.z-\\[70\\] > div").first())).toBe(true);
  await expect.poll(() => swipeBlocked(modal.getByRole("heading", { level: 2 }), false)).toBe(true);
  // El cuerpo del modal sí se desplaza mientras tenga recorrido.
  const body = modal.locator("form > div").first();
  expect(await body.evaluate((n) => n.scrollHeight > n.clientHeight)).toBe(true);
  expect(await swipeBlocked(modal.getByLabel("Mensaje"))).toBe(false);
  await page.keyboard.press("Escape");
  await expect(modal).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
  expect(await swipeBlocked(page.locator("main"))).toBe(false);
});

test("8.4.11 la confirmación nativa sobre la página también frena el scroll y lo devuelve al cerrarse", async ({ page }) => {
  await page.goto("admin-demo/contenido/carrusel/");
  await page.getByRole("button", { name: "Quitar", exact: true }).first().click();
  const confirm = page.locator("dialog[open]");
  await expect(confirm).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("hidden");
  expect(await swipeBlocked(confirm.getByRole("heading"))).toBe(true);
  await confirm.getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(confirm).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
});

for (const [width, height] of [[820, 1180], [1180, 820], [375, 812]] as const) {
  test(`8.4.10 a ${width}×${height}: el modal de regalo (el mismo de la ficha y del checkout) muestra su contenido, no solo el velo`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("p/home-spray/");
    await page.locator("#personalizar").getByRole("button", { name: "Regalar ahora" }).click();
    const modal = giftDialog(page);
    await expect(modal.getByLabel("Para", { exact: true })).toBeInViewport();
    await expect(modal.getByRole("button", { name: "Agregar regalo al carrito" })).toBeInViewport();
    const box = (await modal.boundingBox())!;
    expect(box.height).toBeGreaterThan(Math.min(420, height * 0.5));
    expect(box.y + box.height).toBeLessThanOrEqual(height + 1);
    // El formulario no usa hijos flex-1/min-h-0 (Safari los colapsa a cero en un modal con alto de contenido).
    expect(await modal.locator("form, form > div").evaluateAll((els) => els.filter((e) => e.classList.contains("flex-1")).length)).toBe(0);
    await modal.getByLabel("Para", { exact: true }).fill("Sofía");
    await modal.getByLabel("De parte de").fill("Lucía");
    await modal.getByRole("button", { name: "Agregar regalo al carrito" }).click();
    await expect(modal).toBeHidden();
  });
}

test.describe("escritorio con mouse", () => {
  test.use({ viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false });
  test.beforeEach(async ({ page }) => { await page.mouse.move(1400, 300); });

  const centered = async (dialog: Locator) => {
    const box = (await dialog.boundingBox())!;
    expect(Math.abs(box.x + box.width / 2 - 720), "centrado horizontal").toBeLessThan(4);
    expect(box.x, "no pegado al costado").toBeGreaterThan(100);
  };

  test("8.4.16 la entrega del calendario se abre en un modal centrado y sigue reprogramando", async ({ page }) => {
    await page.goto("admin-demo/calendario/");
    await page.getByRole("button", { name: /^VEL-000115,/ }).first().click();
    const dialog = page.getByRole("dialog", { name: "Entrega VEL-000115" });
    await expect(dialog.getByText("Entrega comprometida")).toBeVisible();
    await centered(dialog);
    await expect(dialog.getByRole("heading", { name: "Reprogramar" })).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Abrir el pedido completo" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("8.4.21 el editor de una temática es un modal centrado; cerrar con cambios pide confirmar", async ({ page }) => {
    await page.goto("admin-demo/tematicas/");
    await page.getByRole("button", { name: "Editar Navidad" }).click();
    const editor = page.getByRole("dialog", { name: "Editar Navidad" });
    await centered(editor);
    await expect(editor.getByRole("button", { name: "Guardar temática" })).toBeDisabled();
    await editor.getByLabel("Titular").fill("Navidad en el taller");
    await page.keyboard.press("Escape");
    await expect(editor.getByText("Tenés cambios sin guardar.")).toBeVisible();
    // "Seguir editando" no guarda ni cierra (el mismo toque ya no cae en el botón de guardar).
    await editor.getByRole("button", { name: "Seguir editando" }).click();
    await expect(editor.getByLabel("Titular")).toHaveValue("Navidad en el taller");
    await editor.getByRole("button", { name: "Guardar temática" }).click();
    await expect(editor).toBeHidden();
    await page.getByRole("button", { name: "Editar Navidad" }).click();
    await expect(page.getByRole("dialog", { name: "Editar Navidad" }).getByLabel("Titular")).toHaveValue("Navidad en el taller");
  });

  test("8.4.20 un email de la bandeja de salida se abre en un modal centrado", async ({ page }) => {
    await page.goto("admin-demo/usuarios/ficha/?email=diego.a@ejemplo.com");
    await page.getByRole("button", { name: /Simular el email del día: Cumple de Ñoqui/ }).click();
    await page.goto("admin-demo/emails/?vista=enviados");
    await page.getByRole("region", { name: "Bandeja de salida" }).getByRole("button", { name: /¡Feliz cumple, Ñoqui!/ }).click();
    const mail = page.getByRole("dialog", { name: /Email: ¡Feliz cumple, Ñoqui!/ });
    await centered(mail);
    await expect(mail.getByRole("heading", { level: 2 }).first()).toContainText("¡Feliz cumple, Ñoqui!");
    await expect(mail.getByText(/Simulado: en la demo no sale ningún email/)).toBeVisible();
  });
});
