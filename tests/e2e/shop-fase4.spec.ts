import { expect, test, type Page } from "@playwright/test";
import { guardNetwork } from "./helpers";

const sounds = (page: Page) => page.evaluate(() => window.__velmarSounds ?? []);

test("configurador de collar: formato, cordón, material y talle por cuello cambian la vista previa y el precio", async ({ page }) => {
  const assertNoExternal = guardNetwork(page);
  await page.goto("p/collar-con-nombre/");
  await expect(page.getByRole("heading", { name: "Armá tu collar" })).toBeVisible();
  await page.getByLabel("Nombre", { exact: true }).fill("Simba");
  const preview = page.getByRole("img", { name: "Vista previa del collar Simba" }).first();
  await expect(preview).toBeVisible();
  // Letras sueltas: una pieza por letra
  await expect(preview.locator("text")).toHaveText(["S", "I", "M", "B", "A"]);
  await page.locator("label", { hasText: "Nombre de corrido" }).click();
  await expect(preview.locator("text")).toHaveText(["Simba"]);
  await page.locator("label", { hasText: "Biothane" }).click();
  await page.getByTitle("Terracota").click();
  await expect(page.getByText("Color del cordón: Terracota")).toBeVisible();
  // Precio: base del talle elegido + nombre de corrido 1.500 + biothane 3.000
  await page.getByLabel("Contorno de cuello").fill("40");
  await expect(page.getByText(/Te corresponde Mediano \(36–45 cm\)/)).toBeVisible();
  await expect(page.getByText(/\$\s?20\.900/).first()).toBeVisible();
  await page.getByLabel("Contorno de cuello").fill("90");
  await expect(page.getByText(/fuera de los talles/)).toBeVisible();
  await page.getByLabel("Contorno de cuello").fill("40");

  await page.getByRole("button", { name: /Agregar al carrito/ }).last().click();
  await page.goto("carrito/");
  await expect(page.getByText(/Nombre de corrido · Biothane terracota · dije patita · cuello 40 cm/)).toBeVisible();
  await expect(page.getByRole("img", { name: /Collar con nombre.*Simba/ }).first()).toBeVisible();
  assertNoExternal();
});

test("combinaciones listas: tocar una carga el configurador", async ({ page }) => {
  await page.goto("p/collar-con-nombre/");
  await page.getByRole("button", { name: /Usar la combinación Rosa y corazón/ }).click();
  await expect(page.getByLabel("Nombre", { exact: true })).toHaveValue("Mora");
  await expect(page.getByText("Color del cordón: Rosa")).toBeVisible();
  await expect(page.getByRole("img", { name: "Vista previa del collar Mora" }).first()).toBeVisible();
});

test("ruleta: se gira arrastrándola y da un premio", async ({ page }) => {
  await page.goto("club/");
  const disc = page.getByRole("button", { name: "Ruleta: tocala o arrastrala para girar" });
  await disc.scrollIntoViewIfNeeded();
  const box = (await disc.boundingBox())!;
  const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  await page.mouse.move(cx, cy - box.height * 0.4);
  await page.mouse.down();
  await page.mouse.move(cx + box.width * 0.3, cy - box.height * 0.3, { steps: 4 });
  await page.mouse.move(cx + box.width * 0.4, cy, { steps: 4 });
  await page.mouse.up();
  await expect(page.getByText("¡Ganaste!")).toBeVisible();
  const played = await sounds(page);
  expect(played).toContain("spin");
  expect(played).toContain("win");
  expect(played).toContain("tick");
});

test("ruleta: también se gira con un toque o con el teclado", async ({ page }) => {
  await page.goto("club/");
  const disc = page.getByRole("button", { name: "Ruleta: tocala o arrastrala para girar" });
  await disc.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("¡Ganaste!")).toBeVisible();
  await expect(disc).toHaveCount(0);
});

test("sonidos: suenan al agregar y en favoritos; el silencio se recuerda", async ({ page }) => {
  await page.goto("p/vela-caniche/");
  await page.getByRole("button", { name: "Agregar al carrito" }).last().click();
  expect(await sounds(page)).toContain("add");
  await page.keyboard.press("Escape");
  const toggle = page.getByRole("button", { name: "Silenciar los sonidos" });
  await toggle.click();
  await expect(page.getByRole("button", { name: "Activar los sonidos" })).toHaveAttribute("aria-pressed", "false");
  await page.reload();
  await expect(page.getByRole("button", { name: "Activar los sonidos" })).toBeVisible();
  await page.evaluate(() => { window.__velmarSounds = []; });
  await page.getByRole("button", { name: /favoritos/i }).first().click();
  expect(await sounds(page)).toEqual([]);
  await page.getByRole("button", { name: "Activar los sonidos" }).click();
  await page.getByRole("button", { name: /favoritos/i }).first().click();
  expect(await sounds(page)).toContain("unfavorite");
});
