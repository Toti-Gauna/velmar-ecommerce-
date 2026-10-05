import { describe, expect, it } from "vitest";
import { PALETTES } from "@/features/themes/palettes";
import { contrastRatio } from "@/lib/color";

describe("paletas de temáticas", () => {
  for (const [id, pair] of Object.entries(PALETTES)) {
    for (const mode of ["light", "dark"] as const) {
      it(`${id} (${mode}) cumple AA`, () => {
        const c = pair[mode];
        for (const [fg, bg, label] of [
          [c.text, c.background, "texto/fondo"], [c.text, c.surface, "texto/superficie"], [c.muted, c.surface, "apagado/superficie"],
          [c.muted, c.background, "apagado/fondo"], [c.primary, c.surface, "primario/superficie"], [c.primary, c.background, "primario/fondo"],
          [c.onPrimary, c.primary, "texto sobre primario"], [c.brassInk, c.background, "dorado/fondo"], [c.text, c.accent, "texto/acento"],
        ] as const) expect(contrastRatio(fg, bg), `${label} ${fg} sobre ${bg}`).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
});
