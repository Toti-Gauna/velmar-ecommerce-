import type { SeasonId } from "@/demo/types";

/**
 * Colores de la tienda durante cada temática, en claro y oscuro (pedido de Ignacio, fuera de la especificación).
 * Pisan los tokens de marca con `html[data-season]`: todo el sitio cambia de color sin tocar componentes.
 * El contraste AA de cada par se verifica en tests/unit/palettes.test.ts.
 */
export interface Palette {
  primary: string; primaryHover: string; onPrimary: string; accent: string;
  background: string; surface: string; text: string; muted: string; border: string;
  night: string; night2: string; brassInk: string;
}

type Pair = { light: Palette; dark: Palette };
const p = (v: string): Palette => {
  const [primary, primaryHover, onPrimary, accent, background, surface, text, muted, border, night, night2, brassInk] = v.split(" ") as [string, string, string, string, string, string, string, string, string, string, string, string];
  return { primary, primaryHover, onPrimary, accent, background, surface, text, muted, border, night, night2, brassInk };
};

// primary · hover · texto sobre primary · acento · fondo · superficie · texto · apagado · borde · noche · noche 2 · dorado de texto
export const PALETTES: Record<SeasonId, Pair> = {
  "dia-de-la-madre": { light: p("#8f3a5e #7a2f50 #fffafb #f5e3ea #fbf4f5 #fffafb #2a1520 #6e5562 #eedae1 #4a1830 #5e2440 #8a3d62"), dark: p("#f5a8c6 #f8c0d6 #3a1226 #301a24 #160b10 #211118 #f7e9ef #c7a9b6 #3e2330 #0c0508 #1c0d14 #f3b3cd") },
  halloween: { light: p("#5b2a86 #4a2170 #fffaf5 #f3e3d3 #faf4ee #fffaf5 #1f1426 #66586f #eadccf #1d1426 #2a1c38 #a3470d"), dark: p("#ffa64d #ffb96f #1d1426 #2a1f35 #120d18 #1b1424 #efe6f5 #b3a5c2 #33263f #0b0810 #171020 #ffb877") },
  "black-friday": { light: p("#141416 #000000 #f3dca6 #ece8e1 #f4f2ee #ffffff #121214 #5f5c56 #e2ddd4 #0b0b0d #1c1c20 #7a5c26"), dark: p("#f3dca6 #f8e8c4 #0b0b0d #1b1b1f #070708 #111113 #f2efe8 #a8a49b #2a2a2f #000000 #0e0e10 #f3dca6") },
  navidad: { light: p("#a32630 #8a1f28 #fffcf6 #efe4d4 #f8f3ea #fffcf6 #1d1f17 #5f5d50 #e6dccb #0e2a1f #153a2b #8a6a1c"), dark: p("#ff9a9a #ffb3b3 #2a0b0e #1b2e25 #0b1712 #12211a #eef0e6 #a8b5a8 #243b30 #06100c #0c1b14 #f3c84c") },
  "ano-nuevo": { light: p("#1f2a5c #18214a #fffdf8 #ece6d6 #f7f4ec #fffdf8 #161a2c #5b5e70 #e5dfcf #0d1330 #18204a #85641a"), dark: p("#f3dca6 #f8e8c4 #0d1330 #1b2344 #0a0e20 #121831 #eceaf5 #a7abc6 #263058 #05081a #0c1230 #f3dca6") },
  "san-valentin": { light: p("#a8274a #8e1f3e #fffafa #f6e1e5 #fbf3f4 #fffafa #2a1218 #6d525a #efd9dd #3b0d1c #561428 #9c3555"), dark: p("#ff9bb3 #ffb6c8 #3b0d1c #321821 #170a0f #221017 #f7e8ec #c9a7b1 #3f1f2b #0d0508 #1b0a11 #ffa9c0") },
  "san-patricio": { light: p("#1b6b3a #155a30 #fbfdf9 #e3efe1 #f4f8f1 #fbfdf9 #142017 #54604f #d9e6d6 #0c3f24 #135432 #6f5a10"), dark: p("#8fdc9f #aae7b6 #08140d #16301f #08140d #0f1f15 #e6f2e8 #9fb9a5 #1f3d2a #040c07 #0a1a10 #f6c84c") },
  pascuas: { light: p("#6a4a9e #5a3e88 #fffcff #efe6f6 #faf6fb #fffcff #211a2c #625a6e #e8ddef #3f2a66 #50367f #8a5a12"), dark: p("#cdb3f5 #dccaf8 #241539 #261d35 #110c18 #1a1424 #f0eaf7 #b6a8c8 #322745 #0a0710 #170f22 #ffe28a") },
  "dia-del-animal": { light: p("#3a4527 #283019 #fffdf8 #efe3cc #f7f1e6 #fffdf8 #1c2016 #5d6050 #e4d9c3 #283019 #343e22 #7a5c26"), dark: p("#c5d19e #d6e0b4 #151910 #262b20 #121510 #1b1f17 #ece6d8 #a9a591 #2f3528 #0a0c08 #16190f #d9b878") },
  "hot-sale": { light: p("#b23a0a #963108 #fffaf6 #fbe6d6 #fbf4ee #fffaf6 #24140d #6b5549 #f0dccd #3d0f06 #5e1508 #a3360a"), dark: p("#ff9f6b #ffb78d #2a0c04 #321a10 #160b07 #22110a #f8ebe3 #c9ab9b #422417 #0d0503 #1d0c06 #ffb78d") },
  "dia-del-padre": { light: p("#2e4862 #24394e #fdfcfa #e4e9ee #f5f4f1 #fdfcfa #161d24 #57606a #dfe2e4 #16222f #22344a #7a5c26"), dark: p("#a9c6e6 #c1d6ee #0b1118 #1b2633 #0b1118 #121a24 #e8edf2 #a3afbc #263443 #060a0f #0e1620 #e9c27a") },
  "dia-del-amigo": { light: p("#44622a #3a5424 #fdfdf7 #ebeedc #f6f5ec #fdfdf7 #1a2014 #596050 #e0e3cf #22381f #2f4a2a #7a5c26"), dark: p("#b7d68f #cbe3aa #121a0c #1f2a18 #0d120a #151d10 #edf1e4 #a9b39a #2c3a22 #060a04 #111a0c #f3dca6") },
  "dia-del-nino": { light: p("#1a6390 #155377 #fbfdff #e2eff7 #f3f8fb #fbfdff #122029 #52616b #d6e6f0 #0b4468 #0f5884 #8a5a12"), dark: p("#8fd0f5 #ace0fa #062033 #142a3a #07121a #0d1c27 #e6f2f9 #9fb8c8 #1d3a50 #030a10 #0a1822 #ffd34d") },
};

function vars(c: Palette): string {
  return [
    `--brand-primary:${c.primary}!important`, `--brand-primary-hover:${c.primaryHover}!important`, `--brand-on-primary:${c.onPrimary}!important`,
    `--brand-accent:${c.accent}!important`, `--brand-background:${c.background}!important`, `--brand-surface:${c.surface}!important`,
    `--brand-text:${c.text}!important`, `--brand-muted:${c.muted}!important`, `--brand-border:${c.border}!important`,
    `--c-night:${c.night}`, `--c-night-2:${c.night2}`, `--c-brass-ink:${c.brassInk}`,
  ].join(";");
}

/** CSS de las paletas (va en <head>): claro con :not([data-theme=dark]) para no pisar el oscuro. */
export function seasonPaletteCss(): string {
  return Object.entries(PALETTES).map(([id, { light, dark }]) =>
    `html[data-season="${id}"]:not([data-theme="dark"]){${vars(light)}}html[data-season="${id}"][data-theme="dark"]{${vars(dark)}}`).join("");
}
