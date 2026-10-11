import { expect, test, type Page } from "@playwright/test";
import { horizontalOverflow } from "./helpers";

/** Polish 8.4 · Lote 6: transferir los pedidos de un día que se cierra (8.4.15) y botones de la cola de producción (8.4.17). */

const toast = (page: Page, text: string | RegExp) => page.getByRole("status").filter({ hasText: text });
const day = (page: Page, d: string) => page.locator(`td[data-day="${d}"]`);
const openDay = (page: Page, d: string) => day(page, d).locator("> button").click({ position: { x: 6, y: 6 } });

async function closeDay(page: Page, d: string, title: string, reason: string) {
  await page.goto("admin-demo/calendario/");
  await openDay(page, d);
  const dialog = page.getByRole("dialog", { name: `Día ${title}` });
  await dialog.getByRole("button", { name: "Cerrar el taller este día" }).click();
  await dialog.getByLabel("Motivo del cierre").fill(reason);
  await dialog.getByRole("button", { name: "Cerrar el taller ese día" }).click();
  await dialog.getByRole("alertdialog", { name: "Cambio que toca entregas" }).getByRole("button", { name: "Cerrar igual" }).click();
  await expect(dialog.getByRole("heading", { name: "¿Querés transferir los pedidos de este día a otro?" })).toBeVisible();
  return dialog;
}

test.describe("escritorio con mouse", () => {
  test.use({ viewport: { width: 1440, height: 1000 }, isMobile: false, hasTouch: false });

  test("8.4.15 al cerrar un día con entregas ofrece pasarlas a otro: avisa si tiene pedidos o se pasa, no deja un día sin taller y transfiere", async ({ page }) => {
    const dialog = await closeDay(page, "2026-10-09", "viernes, 9 de octubre", "Corte de luz");
    const days = dialog.getByRole("radiogroup", { name: "Próximos días con taller" });
    await expect(days.getByRole("radio")).toHaveCount(5);
    await expect(days.getByRole("radio", { name: /13 oct/ })).toHaveAttribute("aria-checked", "true");
    await expect(dialog.getByRole("list", { name: "Pedidos a transferir" }).getByRole("listitem")).toHaveCount(3);
    await expect(dialog.getByRole("status").filter({ hasText: "Ese día no tiene otros pedidos: queda en 3 de 3." })).toBeVisible();
    // Un día que ya tiene pedidos: lo avisa y, si se pasa, el botón lo dice.
    await days.getByRole("radio", { name: /14 oct/ }).click();
    await expect(days.getByRole("radio", { name: /14 oct/ })).toContainText("1 de 3 pedidos · se pasa");
    await expect(dialog.getByRole("status").filter({ hasText: "Ese día ya tiene 1 pedido: con estos queda en 4 de 3 y se pasa de la capacidad del taller." })).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Transferir igual" })).toBeEnabled();
    // Cualquier otra fecha: un domingo no se puede.
    await dialog.getByLabel("O elegí cualquier otra fecha").fill("2026-10-11");
    await dialog.getByRole("button", { name: "Elegir" }).click();
    await expect(dialog.getByRole("alert").filter({ hasText: "Domingo sin taller: el taller no trabaja ese día." })).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Transferir los pedidos" })).toBeDisabled();
    await days.getByRole("radio", { name: /13 oct/ }).click();
    await dialog.getByRole("button", { name: "Transferir los pedidos" }).click();
    await expect(toast(page, "Los 3 pedidos pasan al mar, 13 oct")).toBeVisible();
    await expect(dialog.getByRole("region", { name: "Entregas del día" })).toContainText("Entregas (0)");
    await page.keyboard.press("Escape");
    await expect(day(page, "2026-10-13").getByRole("button", { name: /^VEL-000110,/ })).toBeVisible();
    await expect(page.getByRole("status").filter({ hasText: /quedó en un día cerrado|quedaron en un día cerrado/ })).toHaveCount(0);
  });

  test("8.4.15 un día por pedido; y \"Dejarlos para después\" los deja marcados para reprogramar", async ({ page }) => {
    let dialog = await closeDay(page, "2026-10-09", "viernes, 9 de octubre", "Corte de luz");
    await dialog.getByRole("radio", { name: "Un día por pedido" }).click();
    await dialog.getByLabel("Nueva fecha para VEL-000110").fill("2026-10-15");
    await dialog.getByRole("listitem").filter({ hasText: "VEL-000110" }).getByRole("button", { name: "Elegir" }).click();
    await expect(dialog.getByRole("listitem").filter({ hasText: "VEL-000110" }).getByRole("status")).toContainText("queda en 1 de 3");
    await dialog.getByRole("button", { name: "Transferir los pedidos" }).click();
    await expect(toast(page, "3 pedidos reprogramados")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(day(page, "2026-10-15").getByRole("button", { name: /^VEL-000110,/ })).toBeVisible();
    await expect(day(page, "2026-10-13").getByRole("button", { name: /^VEL-000109,/ })).toBeVisible();

    dialog = await closeDay(page, "2026-10-14", "miércoles, 14 de octubre", "Mudanza");
    await expect(dialog.getByRole("button", { name: "Transferir el pedido" })).toBeVisible();
    await dialog.getByRole("button", { name: "Dejarlos para después" }).click();
    await expect(dialog.getByRole("region", { name: "Entregas del día" })).toContainText("VEL-000123");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("status").filter({ hasText: "1 pedido quedó en un día cerrado" })).toBeVisible();
  });
});

test("8.4.15 a 390px: el panel de transferir entra sin desborde y los botones se alcanzan", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const dialog = await closeDay(page, "2026-10-09", "viernes, 9 de octubre", "Corte de luz");
  const transfer = dialog.getByRole("button", { name: "Transferir los pedidos" });
  await transfer.scrollIntoViewIfNeeded();
  await expect(transfer).toBeInViewport();
  const box = (await dialog.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(391);
  expect(await horizontalOverflow(page)).toBe(0);
});

for (const [width, height] of [[1440, 900], [1024, 768], [390, 844]] as const) {
  test(`8.4.17 a ${width}px: en la cola, el paso siguiente y "Mover etapa" del mismo alto y ocupando el ancho de la tarjeta`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("admin-demo/produccion/");
    const card = page.getByRole("article", { name: "Pedido VEL-000113" });
    const next = card.getByRole("button", { name: "Pasar VEL-000113 a En máquina" });
    const move = card.getByRole("button", { name: "Mover etapa de VEL-000113" });
    await next.scrollIntoViewIfNeeded();
    const n = (await next.boundingBox())!, m = (await move.boundingBox())!;
    const row = (await next.evaluate((el) => el.parentElement!.getBoundingClientRect().toJSON())) as DOMRect;
    expect(Math.round(n.height)).toBe(40);
    expect(Math.round(m.height)).toBe(40);
    const left = Math.min(n.x, m.x), right = Math.max(n.x + n.width, m.x + m.width);
    expect(Math.abs(left - row.left), "arranca en el borde de la tarjeta").toBeLessThan(1.5);
    expect(Math.abs(right - row.right), "llega al otro borde").toBeLessThan(1.5);
    if (Math.abs(n.y - m.y) < 1) {
      expect(Math.abs(n.width - m.width), "lado a lado, mismo ancho").toBeLessThan(1.5);
      expect(m.x, "Mover etapa a la izquierda y el paso siguiente a la derecha").toBeLessThan(n.x);
    } else {
      expect(n.y, "uno arriba del otro, el principal primero").toBeLessThan(m.y);
      expect(Math.abs(n.width - row.width)).toBeLessThan(1.5);
    }
    expect(await horizontalOverflow(page)).toBe(0);
  });
}
