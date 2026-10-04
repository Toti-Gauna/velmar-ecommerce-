import { expect, test } from "@playwright/test";
import { guardNetwork } from "./helpers";

test("flujo móvil completo hasta la confirmación de demostración", async ({ page }) => {
  const assertNoExternal = guardNetwork(page);
  await page.goto("");
  await expect(page.getByText("Demo de venta.")).toBeVisible();

  // Búsqueda tolerante a errores
  await page.goto("buscar/?q=comedro");
  await expect(page.getByRole("status").filter({ hasText: "resultados" })).toBeVisible();
  await page.getByRole("link", { name: "Comedero perro globo" }).click();

  // Ficha → personalizar con texto
  await expect(page.getByRole("heading", { level: 1, name: "Comedero perro globo" })).toBeVisible();
  await page.getByText("Celeste", { exact: true }).first().click();
  await page.getByRole("link", { name: /Personalizar y ver vista previa/ }).last().click();
  await page.getByRole("button", { name: "Siguiente: personalizar" }).click();
  await page.getByLabel("Texto", { exact: true }).fill("Toby 🐶");
  await expect(page.getByRole("alert").filter({ hasText: "emoji" })).toBeVisible();
  await page.getByLabel("Texto", { exact: true }).fill("Ñoqui");
  await page.getByText("Manuscrita").click();
  await page.getByRole("button", { name: "Ver vista previa final" }).click();
  const add = page.getByRole("button", { name: "Agregar al carrito" });
  await expect(add).toBeDisabled();
  await page.getByText("Así lo quiero.").click();
  await add.click();

  // Carrito: cupón vencido, cupón válido
  await expect(page).toHaveURL(/carrito\/$/);
  await expect(page.getByText("✓ Vista previa aprobada")).toBeVisible();
  await page.getByLabel("Cupón de descuento").fill("invierno");
  await page.getByRole("button", { name: "Aplicar" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "venció" })).toBeVisible();
  await page.getByLabel("Cupón de descuento").fill("bienvenida10");
  await page.getByRole("button", { name: "Aplicar" }).click();
  await expect(page.getByText(/BIENVENIDA10: 10%/)).toBeVisible();
  await expect(page.getByRole("progressbar", { name: /Comprá 2 productos/ })).toBeVisible();
  await page.getByRole("link", { name: "Continuar al checkout" }).click();

  // Checkout como invitado
  await page.getByRole("button", { name: "Continuar a la entrega" }).click();
  await expect(page.getByText("Escribí tu nombre y apellido.")).toBeVisible();
  await page.getByLabel("Nombre y apellido").fill("Juana Pérez");
  await page.getByLabel("Email").fill("juana@ejemplo.com");
  await page.getByLabel("Teléfono / WhatsApp").fill("223 555-1234");
  await page.getByRole("button", { name: "Continuar a la entrega" }).click();
  await page.getByText("Cadete en Mar del Plata").click();
  await page.getByLabel("Calle").fill("Güemes");
  await page.getByLabel("Altura").fill("2500");
  await page.getByLabel("Código postal").fill("7600");
  await page.getByRole("button", { name: "Continuar al pago" }).click();
  await page.getByText("Transferencia bancaria").click();
  await expect(page.getByText("Descuento transferencia/QR")).toBeVisible();
  await page.getByRole("button", { name: "Revisar pedido" }).click();
  await page.getByRole("button", { name: "Confirmar pedido de demostración" }).click();
  await expect(page.getByText("Para continuar, aceptá los términos.")).toBeVisible();
  await page.getByText(/Acepto los/).click();
  await page.getByRole("button", { name: "Confirmar pedido de demostración" }).click();

  // Confirmación rotulada como demo; nunca "acreditado"
  await expect(page).toHaveURL(/checkout\/confirmacion\/$/);
  await expect(page.getByText("PEDIDO DE DEMOSTRACIÓN · no es un pedido real")).toBeVisible();
  await expect(page.getByText("Datos de muestra: no transfieras a esta cuenta.")).toBeVisible();
  await page.getByLabel("Subir comprobante (demo)").setInputFiles({ name: "comprobante.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 demo") });
  await expect(page.getByText(/queda en revisión/i)).toBeVisible();
  await expect(page.getByText(/acreditad/i)).toHaveCount(0);

  // Seguimiento con token fijo
  await page.getByRole("link", { name: "Seguir mi pedido", exact: true }).click();
  await expect(page).toHaveURL(/pedido\/demo-velmar\/$/);
  await expect(page.getByText("estado actual")).toBeVisible();
  await expect(page.getByText(/“Ñoqui”/).first()).toBeVisible();

  // Reiniciar demo deja todo vacío
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Reiniciar demo" }).first().click();
  await page.goto("carrito/");
  await expect(page.getByText("Tu carrito está vacío")).toBeVisible();
  assertNoExternal();
});

test("checkout con cuenta demo, retiro y Mercado Pago simulado", async ({ page }) => {
  const assertNoExternal = guardNetwork(page);
  await page.goto("p/vela-caniche/");
  await page.getByRole("button", { name: "Agregar al carrito" }).last().click();
  await expect(page.getByRole("status").filter({ hasText: "Agregado al carrito" })).toBeVisible();
  await page.getByRole("button", { name: "Sumar uno" }).click();
  await page.getByRole("button", { name: "Agregar al carrito" }).last().click();
  await page.goto("checkout/");
  await page.getByRole("button", { name: "Ingresar con cuenta demo" }).click();
  await page.getByRole("button", { name: "Continuar a la entrega" }).click();
  await page.getByText("Retiro en persona").click();
  await page.getByRole("button", { name: "Continuar al pago" }).click();
  await page.getByText("Mercado Pago", { exact: true }).click();
  await page.getByRole("button", { name: "Revisar pedido" }).click();
  await page.getByText(/Acepto los/).click();
  await page.getByRole("button", { name: "Confirmar pedido de demostración" }).click();
  await expect(page.getByRole("progressbar", { name: /Comprá 2 productos/ })).toBeVisible();
  await expect(page.getByText("¡Con este pedido completás la misión!")).toBeVisible();
  await page.getByRole("button", { name: /Simular ida y vuelta/ }).click();
  await expect(page.getByText(/pendiente de confirmación/)).toBeVisible();
  await expect(page.getByText(/acreditad/i)).toHaveCount(0);
  assertNoExternal();
});
