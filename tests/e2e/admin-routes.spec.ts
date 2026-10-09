import { expect, test } from "@playwright/test";
import { horizontalOverflow } from "./helpers";

const ADMIN_ROUTES = [
  ["admin-demo/", "Buen día, Velmar"], ["admin-demo/pedidos/", "Pedidos"], ["admin-demo/pedidos/detalle/?codigo=VEL-000123", "VEL-000123"],
  ["admin-demo/pagos/", "Pagos manuales"], ["admin-demo/productos/", "Productos y stock"], ["admin-demo/productos/editar/?id=vela-caniche", "Editar: Vela caniche"],
  ["admin-demo/categorias/", "Categorías y personalización"], ["admin-demo/stock/", "Stock"], ["admin-demo/planilla/", "Planilla"], ["admin-demo/importar/", "Importar desde Excel"], ["admin-demo/misiones/", "Misiones y premios"], ["admin-demo/cupones/", "Cupones"],
  ["admin-demo/calendario/", "Calendario de entregas"], ["admin-demo/produccion/", "Cola de producción"], ["admin-demo/costos/", "Costos y margen"], ["admin-demo/insumos/", "Insumos"],
  ["admin-demo/usuarios/ficha/?email=diego.a@ejemplo.com", "Diego Álvarez"],
  ["admin-demo/usuarios/", "Clientes"], ["admin-demo/reclamos/", "Reclamos"], ["admin-demo/contenido/", "Contenido"], ["admin-demo/ajustes/", "Ajustes"],
] as const;

test.describe("panel demo: rutas directas y refresh", () => {
  for (const [path, heading] of ADMIN_ROUTES) {
    test(`/${path}`, async ({ page }) => {
      expect((await page.goto(path))?.status()).toBe(200);
      await expect(page.getByText("Panel de demostración · datos ficticios")).toBeVisible();
      await expect(page.getByRole("heading", { level: 1, name: new RegExp(heading) })).toBeVisible();
      await page.reload();
      await expect(page.getByRole("heading", { level: 1, name: new RegExp(heading) })).toBeVisible();
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
      await expect(page.getByText(/acreditad/i)).toHaveCount(0);
    });
  }
});
