import { expect, test } from "@playwright/test";
import { guardNetwork, makePng } from "./helpers";

test("la foto se encuadra en el navegador y nunca sale del dispositivo", async ({ page }) => {
  const assertNoExternal = guardNetwork(page);
  await page.goto("crear/velador-con-foto/");
  await page.getByRole("button", { name: "Siguiente: personalizar" }).click();
  await page.getByRole("button", { name: "Ver vista previa final" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Subí una foto" })).toBeVisible();

  // Archivo inválido y archivo demasiado grande
  await page.getByLabel("Elegir foto").setInputFiles({ name: "falso.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF") });
  await expect(page.getByRole("alert").filter({ hasText: "JPG, PNG o WEBP" })).toBeVisible();
  await page.getByLabel("Elegir foto").setInputFiles({ name: "enorme.jpg", mimeType: "image/jpeg", buffer: Buffer.alloc(11 * 1024 * 1024) });
  await expect(page.getByRole("alert").filter({ hasText: "10 MB" })).toBeVisible();

  await page.getByLabel("Elegir foto").setInputFiles({ name: "perro.png", mimeType: "image/png", buffer: await makePng(page) });
  await expect(page.locator("canvas").first()).toBeVisible();
  await page.getByLabel(/Zoom/).fill("1.6");
  await page.getByRole("button", { name: "Mover a la derecha" }).click();
  await page.getByRole("button", { name: "Ver vista previa final" }).click();
  const preview = page.getByRole("img", { name: /Vista previa final de Velador con foto/ });
  await expect(preview).toBeVisible();
  expect(await preview.getAttribute("src")).toMatch(/^data:image\/jpeg/);
  await page.getByText("Así lo quiero.").click();
  await page.getByRole("button", { name: "Agregar al carrito" }).click();
  await expect(page.getByRole("img", { name: "Vista previa aprobada de Velador con foto" })).toBeVisible();
  assertNoExternal();
});

test("foto de referencia con notas", async ({ page }) => {
  const assertNoExternal = guardNetwork(page);
  await page.goto("crear/velador-pintado-a-mano/");
  await page.getByRole("button", { name: "Siguiente: personalizar" }).click();
  await page.getByLabel("Elegir foto").setInputFiles({ name: "ref.png", mimeType: "image/png", buffer: await makePng(page, "#e88aa0") });
  await expect(page.getByRole("img", { name: "Tu foto de referencia" })).toBeVisible();
  await page.getByLabel("Notas para el taller").fill("Sentado, con collar rojo y fondo verde.");
  await page.getByRole("button", { name: "Ver vista previa final" }).click();
  await page.getByText("Así lo quiero.").click();
  await page.getByRole("button", { name: "Agregar al carrito" }).click();
  await expect(page.getByText(/Notas: Sentado/)).toBeVisible();
  assertNoExternal();
});
