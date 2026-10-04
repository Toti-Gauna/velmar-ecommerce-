import { expect, test } from "@playwright/test";
import { guardNetwork, horizontalOverflow } from "./helpers";

test("ruleta: gira (sin animación con movimiento reducido), emite un cupón y se aplica en el carrito", async ({ page }) => {
  const assertNoExternal = guardNetwork(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("p/home-spray/");
  await page.getByRole("button", { name: "Agregar al carrito" }).last().click();
  await page.keyboard.press("Escape");
  await page.goto("club/");
  await page.getByRole("button", { name: "Girar la ruleta" }).click();
  await expect(page.getByText("¡Ganaste!")).toBeVisible();
  const code = (await page.getByRole("button", { name: /Copiar código/ }).textContent())!.trim();
  expect(code).toMatch(/^RULETA[A-Z0-9]+$/);
  await page.getByRole("button", { name: "Aplicar a mi carrito" }).click();
  await page.goto("carrito/");
  // El premio es aleatorio: puede aplicarse o pedir un mínimo de compra; en ambos casos el cupón existe y se valida.
  await expect(page.getByText(new RegExp(code)).first()).toBeVisible();
  await page.goto("club/");
  await expect(page.getByRole("button", { name: "Girar la ruleta" })).toHaveCount(0);
  await expect(page.getByText("Tu premio")).toBeVisible();
  await page.goto("admin-demo/cupones/");
  await expect(page.getByText(code, { exact: true })).toBeVisible();
  assertNoExternal();
});

test("ficha: recomendaciones, medidor de stock y cantidad también en productos personalizables", async ({ page }) => {
  await page.goto("p/chapita-nfc/");
  await expect(page.getByText(/En stock · 12 disponibles/)).toBeVisible();
  await expect(page.getByRole("heading", { name: /Completá el set/ })).toBeVisible();
  await page.getByRole("button", { name: "Sumar uno" }).first().click();
  await page.getByRole("link", { name: /Personalizar y ver vista previa/ }).last().click();
  await expect(page).toHaveURL(/cantidad=2/);
  await page.getByRole("button", { name: "Siguiente: personalizar" }).click();
  await page.getByLabel("Texto", { exact: true }).fill("Luna");
  await page.getByRole("button", { name: "Ver vista previa final" }).click();
  await page.getByText("Así lo quiero.").click();
  await page.getByRole("button", { name: "Agregar al carrito" }).click();
  await expect(page).toHaveURL(/carrito\/$/);
  await expect(page.getByRole("group", { name: /Cantidad de Chapita/ }).getByRole("status").or(page.getByRole("group", { name: /Cantidad de Chapita/ }).locator("output"))).toHaveText("2");
});

test("menú móvil y carrito lateral se operan con teclado", async ({ page }) => {
  await page.goto("");
  await page.getByRole("button", { name: "Abrir menú" }).click();
  const menu = page.getByRole("dialog", { name: "Menú" });
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await page.getByRole("button", { name: /^Carrito/ }).click();
  await expect(page.getByRole("dialog", { name: "Carrito" })).toBeVisible();
  await expect(page.getByText("Lo más elegido")).toBeVisible();
});

test("sin desborde horizontal a 375 px con productos en carrito, checkout y confirmación", async ({ page }) => {
  await page.goto("p/vela-caniche/");
  await page.getByRole("button", { name: "Agregar al carrito" }).last().click();
  await page.keyboard.press("Escape");
  for (const path of ["carrito/", "checkout/", "p/vela-caniche/", "club/", "pedido/demo-velmar/"]) {
    await page.goto(path);
    await page.waitForTimeout(400);
    expect(await horizontalOverflow(page), path).toBeLessThanOrEqual(0);
  }
});
