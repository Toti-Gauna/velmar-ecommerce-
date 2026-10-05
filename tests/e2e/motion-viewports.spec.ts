import { expect, test } from "@playwright/test";
import { horizontalOverflow } from "./helpers";

test.describe("movimiento reducido", () => {
  test("sin splash ni animaciones largas", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("");
    await expect(page.locator("#velmar-splash")).toBeHidden();
    const duration = await page.locator(".page-enter").first().evaluate((el) => getComputedStyle(el).animationDuration);
    expect(["0.001s", "1ms"]).toContain(duration);
  });
});

test("el splash no bloquea clics y se va en menos de 1 s", async ({ page }) => {
  await page.goto("");
  expect(await page.locator("#velmar-splash").evaluate((el) => getComputedStyle(el).pointerEvents)).toBe("none");
  await expect(page.locator("#velmar-splash")).toBeHidden({ timeout: 1000 });
  await page.getByRole("link", { name: "Ver todas" }).click();
  await expect(page).toHaveURL(/categorias\/$/);
});

for (const width of [375, 768, 1440]) {
  test(`capturas a ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["", "p/comedero-perro-globo/", "crear/collar-con-nombre/", "carrito/", "checkout/", "cupones/", "admin-demo/", "admin-demo/pedidos/detalle/?codigo=VEL-000123", "admin-demo/pagos/", "admin-demo/productos/editar/?id=comedero-perro-globo"]) {
      await page.goto(path);
      await page.waitForTimeout(950);
      const overflow = await horizontalOverflow(page);
      expect(overflow, `${path} a ${width}px`).toBeLessThanOrEqual(0);
      await page.screenshot({ path: info.outputPath(`${width}-${path.replace(/\W+/g, "_") || "home"}.png`), fullPage: true });
    }
  });
}
