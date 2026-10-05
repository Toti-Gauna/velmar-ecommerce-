import { defineConfig, devices } from "@playwright/test";

/**
 * E2E contra el export estático (out/) servido bajo el mismo basePath que GitHub Pages.
 * Local: PAGES_BASE_PATH=/velmar-ecommerce- npm run build && PAGES_BASE_PATH=/velmar-ecommerce- npm run e2e
 */
const port = Number(process.env.E2E_PORT ?? 4173);
const base = (process.env.PAGES_BASE_PATH ?? "").replace(/\/+$/, "");
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 45_000,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${port}${base}/`,
    trace: "retain-on-failure",
    locale: "es-AR",
    launchOptions: executablePath ? { executablePath } : undefined,
    // Movimiento reducido por defecto: sin la pantalla de carga de 5 s ni el autoplay del carrusel.
    // Los tests de splash y de animaciones lo cambian a "no-preference" explícitamente.
    contextOptions: { reducedMotion: "reduce" },
    // La guía del panel se da por vista; su propio test la vuelve a habilitar.
    storageState: { cookies: [], origins: [{ origin: `http://localhost:${port}`, localStorage: [{ name: "velmar-tour:admin", value: "done" }] }] },
  },
  projects: [{ name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 375, height: 812 } } }],
  webServer: { command: "node tests/e2e/static-server.mjs", port, reuseExistingServer: !process.env.CI },
});
