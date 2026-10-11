import { expect, test } from "@playwright/test";
import { horizontalOverflow } from "./helpers";

/** Polish 8.4 · Lote 7: Costos alineados y explicados (8.4.18), comedero perro globo (8.4.23) y arrepentimiento (8.4.24). */

for (const width of [1440, 1180]) {
  test(`8.4.18 a ${width}px: los tres valores del taller alineados en una fila; indicadores aparte y "Cómo se calcula"`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("admin-demo/costos/");
    const values = page.getByRole("region", { name: "Valores del taller" });
    const inputs = values.getByRole("spinbutton");
    await expect(inputs).toHaveCount(3);
    const boxes = await inputs.evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).map((r) => ({ top: r.top, height: r.height })));
    for (const b of boxes) expect(Math.abs(b.top - boxes[0]!.top), "inputs a la misma altura").toBeLessThan(1);
    // Etiquetas de una sola línea (antes "Hora de trabajo a mano (pesos)" ocupaba dos).
    const labels = await values.locator("label").evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
    for (const h of labels) expect(h).toBeLessThan(26);
    const indicators = page.getByRole("region", { name: "Indicadores" });
    await expect(indicators.getByText("Margen promedio")).toBeVisible();
    await expect(indicators.getByText("Para revisar")).toBeVisible();
    await expect(indicators.getByRole("spinbutton")).toHaveCount(0);
    const how = page.getByRole("region", { name: "Cómo se calcula y para qué sirve" });
    for (const t of ["Costo", "Ganancia y margen", "Precio sugerido", "Para revisar"]) await expect(how.getByText(t, { exact: true })).toBeVisible();
    await expect(how).toContainText("dan 60%");
  });
}

test("8.4.18 cambiar el margen objetivo recalcula el ejemplo y se guarda", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("admin-demo/costos/");
  const how = page.getByRole("region", { name: "Cómo se calcula y para qué sirve" });
  await expect(how).toContainText(/con 50%, ese mismo costo pide \$\s?8\.000/);
  const target = page.getByLabel(/Margen objetivo/);
  await target.fill("60");
  await target.press("Enter");
  await expect(page.getByRole("status").filter({ hasText: "Margen objetivo: 60%" })).toBeVisible();
  await expect(how).toContainText(/con 60%, ese mismo costo pide \$\s?10\.000/);
  await page.reload();
  await expect(page.getByLabel(/Margen objetivo/)).toHaveValue("60");
});

test("8.4.18 a 390px: Costos sin desborde", async ({ page }) => {
  await page.goto("admin-demo/costos/");
  await expect(page.getByRole("region", { name: "Valores del taller" })).toBeVisible();
  expect(await horizontalOverflow(page)).toBe(0);
});

test("8.4.23 el comedero perro globo es un perro de globos con cuatro patas y el plato en el lomo", async ({ page }) => {
  await page.goto("p/comedero-perro-globo/");
  const art = page.locator("[data-vt-hero] svg[role=img]").first();
  await expect(art).toBeVisible();
  // Globos con brillo (cuerpo, patas, cuello, cabeza, orejas, cola): muchas elipses, ningún rectángulo de producto.
  expect(await art.locator("g ellipse").count()).toBeGreaterThan(30);
});

for (const [width, height, side] of [[1280, 900, true], [820, 1180, true], [375, 812, false]] as const) {
  test(`8.4.24 a ${width}px: arrepentimiento ${side ? "con el formulario y \"Cómo funciona\" lado a lado" : "uno debajo del otro"}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto("arrepentimiento/");
    const form = page.locator("form").filter({ has: page.getByRole("button", { name: "Enviar solicitud (demo)" }) });
    const aside = page.getByRole("complementary", { name: "Cómo funciona" });
    await expect(aside.getByText("Plazo: 10 días corridos")).toBeVisible();
    const f = (await form.boundingBox())!, a = (await aside.boundingBox())!;
    if (side) {
      expect(a.x).toBeGreaterThan(f.x + f.width - 1);
      expect(Math.abs(a.y - f.y)).toBeLessThan(4);
      expect(f.x + f.width / 2).toBeLessThan(width / 2 + 40);
    } else {
      expect(a.y).toBeGreaterThan(f.y + f.height - 1);
    }
    expect(await horizontalOverflow(page)).toBe(0);
    await page.getByLabel("Nombre y apellido").fill("Juana Pérez");
    await page.getByLabel("Email").fill("juana@ejemplo.com");
    await page.getByLabel("Motivo").fill("Me arrepentí de la compra.");
    await page.getByRole("button", { name: "Enviar solicitud (demo)" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Solicitud registrada (demo)" })).toContainText(/ARR-DEMO-/);
  });
}
