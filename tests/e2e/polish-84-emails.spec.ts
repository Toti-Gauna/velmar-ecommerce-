import { expect, test, type Page } from "@playwright/test";
import { horizontalOverflow } from "./helpers";

/** Polish 8.4 · Lote 8: editor de emails en cuatro pasos (8.4.19) y bandeja de salida arriba, en tarjeta (8.4.20). */

const toast = (page: Page, text: string | RegExp) => page.getByRole("status").filter({ hasText: text });
const steps = (page: Page) => page.getByRole("navigation", { name: "Pasos del editor" });
const stepTitle = (page: Page) => page.locator("#e-step-t");

test.describe("escritorio", () => {
  test.use({ viewport: { width: 1440, height: 1000 }, isMobile: false, hasTouch: false });

  test("8.4.19 cuatro pasos con la vista previa al costado: cuándo, asunto (con la bandeja del celular), contenido y revisar", async ({ page }) => {
    await page.goto("admin-demo/emails/editar/?id=tpl-payment-approved");
    await expect(steps(page).getByRole("button")).toHaveCount(4);
    await expect(steps(page).getByRole("button", { name: /Cuándo se envía/ })).toHaveAttribute("aria-current", "step");
    await expect(stepTitle(page)).toHaveText("Cuándo se envía");
    await expect(page.getByText("Sale cuando: Pago aprobado")).toBeVisible();
    await expect(page.getByRole("list", { name: "Momentos del pedido" }).locator("[aria-current=step]")).toHaveText("3. Pago aprobado");
    const preview = page.getByRole("region", { name: "Vista previa" });
    await expect(preview).toBeVisible();
    // Al costado del paso, a la misma altura.
    const s = (await page.locator("#e-step").boundingBox())!, p = (await preview.boundingBox())!;
    expect(p.x).toBeGreaterThan(s.x + s.width - 1);

    await page.getByRole("button", { name: "Siguiente: Asunto" }).click();
    await expect(stepTitle(page)).toHaveText("Asunto");
    await expect(page.locator("#e-step")).toBeFocused();
    const inbox = page.getByRole("figure", { name: "Así aparece en la bandeja del celular" });
    await expect(inbox).toContainText("Velmar");
    await expect(inbox).toContainText(/Pago aprobado/);
    await page.getByRole("textbox", { name: "Asunto" }).click();
    await page.keyboard.press("End");
    await page.keyboard.type(" — gracias por confiar en el taller de Velmar, te contamos todo lo que sigue");
    await expect(inbox).toContainText("te contamos todo lo que sigue");
    await expect(page.getByText(/^\d+ \/ 60$/)).toHaveClass(/text-warning/);
    await expect(page.getByText("Cambios sin guardar")).toBeVisible();

    await page.getByRole("button", { name: "Siguiente: Contenido" }).click();
    await expect(stepTitle(page)).toHaveText("Contenido");
    await expect(page.getByRole("group", { name: "Insertar dato" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Texto 3" })).toBeVisible();

    await page.getByRole("button", { name: "Siguiente: Revisar y probar" }).click();
    const checks = page.getByRole("region", { name: "Antes de dejarlo andando" });
    await expect(checks).toContainText(/El asunto tiene \d+ letras: en el celular se corta después de 60\./);
    await expect(checks).toContainText("Hay cambios sin guardar.");
    await expect(page.getByRole("button", { name: "Enviar prueba" })).toBeDisabled();
    await checks.getByRole("button", { name: "Ir a Asunto" }).click();
    await expect(stepTitle(page)).toHaveText("Asunto");
    await steps(page).getByRole("button", { name: /Revisar y probar/ }).click();
    await page.getByRole("button", { name: "Guardar y volver a Emails" }).click();
    await expect(toast(page, "Plantilla guardada")).toBeVisible();
    await expect(page).toHaveURL(/admin-demo\/emails\/$/);
  });

  test("8.4.19 el último paso manda la prueba cuando está guardado y deja restaurar la original", async ({ page }) => {
    await page.goto("admin-demo/emails/editar/?id=tpl-ready");
    await steps(page).getByRole("button", { name: /Revisar y probar/ }).click();
    await expect(page.getByRole("region", { name: "Antes de dejarlo andando" })).toContainText("Todo guardado.");
    await page.getByRole("button", { name: "Enviar prueba" }).click();
    await expect(toast(page, "Prueba en la bandeja de salida")).toBeVisible();
    await page.getByRole("button", { name: "Restaurar la original" }).click();
    await page.locator("dialog[open]").getByRole("button", { name: "Restaurar" }).click();
    await expect(toast(page, "Plantilla restaurada")).toBeVisible();
    await page.getByRole("link", { name: "Listo, volver a Emails" }).click();
    await expect(page.getByRole("region", { name: "Bandeja de salida" }).getByRole("button", { name: /^Listo para entregar Prueba/ }).first()).toBeVisible();
  });

  test("8.4.20 la bandeja de salida va arriba de las plantillas y cada email se abre en un modal ahí mismo", async ({ page }) => {
    await page.goto("admin-demo/usuarios/ficha/?email=diego.a@ejemplo.com");
    await page.getByRole("button", { name: /Simular el email del día: Cumple de Ñoqui/ }).click();
    await page.goto("admin-demo/emails/");
    const card = page.getByRole("region", { name: "Bandeja de salida" });
    const templates = page.getByRole("list", { name: "Plantillas" });
    expect((await card.boundingBox())!.y + (await card.boundingBox())!.height).toBeLessThanOrEqual((await templates.boundingBox())!.y);
    await card.getByRole("button", { name: /¡Feliz cumple, Ñoqui!/ }).click();
    const mail = page.getByRole("dialog", { name: /Email: ¡Feliz cumple, Ñoqui!/ });
    await expect(mail.getByText(/Simulado: en la demo no sale ningún email/)).toBeVisible();
    const box = (await mail.boundingBox())!;
    expect(Math.abs(box.x + box.width / 2 - 720)).toBeLessThan(4);
    await page.keyboard.press("Escape");
    await card.getByRole("link", { name: "Ver toda la bandeja" }).click();
    await expect(page).toHaveURL(/emails\/enviados\/$/);
    await expect(page.getByLabel("Buscar en la bandeja")).toBeVisible();
  });
});

for (const [width, height] of [[820, 1180], [390, 844]] as const) {
  test(`8.4.19 a ${width}px: pasos en una fila, sin desborde; la vista previa se abre en un modal y se ve entera al revisar`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("admin-demo/emails/editar/?id=tpl-order-created");
    const buttons = steps(page).getByRole("button");
    await expect(buttons).toHaveCount(4);
    const ys = await buttons.evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
    expect(new Set(ys).size, "los cuatro pasos en una fila").toBe(1);
    await expect(page.getByRole("region", { name: "Vista previa" })).toHaveCount(0);
    for (const label of ["Asunto", "Contenido"]) {
      await steps(page).getByRole("button", { name: new RegExp(label) }).click();
      await expect(stepTitle(page)).toHaveText(label);
      expect(await horizontalOverflow(page), label).toBe(0);
    }
    await page.getByRole("button", { name: "Ver cómo queda" }).click();
    const dialog = page.getByRole("dialog", { name: "Vista previa del email" });
    await expect(dialog.getByRole("article", { name: /Email: ¡Gracias por tu compra/ })).toBeVisible();
    const box = (await dialog.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await steps(page).getByRole("button", { name: /Revisar y probar/ }).click();
    await expect(page.getByRole("region", { name: "Vista previa" }).getByRole("article")).toBeVisible();
    await expect(page.getByRole("button", { name: "Ver cómo queda" })).toHaveCount(0);
    expect(await horizontalOverflow(page)).toBe(0);
  });
}

test("8.4.20 a 390px: la tarjeta de la bandeja entra sin desborde", async ({ page }) => {
  await page.goto("admin-demo/emails/");
  await expect(page.getByRole("region", { name: "Bandeja de salida" }).getByRole("link", { name: "Ver toda la bandeja" })).toBeVisible();
  expect(await horizontalOverflow(page)).toBe(0);
});
