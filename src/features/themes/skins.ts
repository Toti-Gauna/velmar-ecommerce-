import type { DecorKind } from "@/components/illustrations/seasonal/Decor";
import type { SeasonId } from "@/demo/types";

/**
 * Lo visual de cada temática (fijo en el código; el panel edita textos, fechas y ofertas).
 * Fondos oscuros o saturados con texto claro: contraste AA en modo claro y oscuro por igual.
 */
export interface ThemeSkin {
  /** Fondo del banner y de la cinta. */
  from: string;
  to: string;
  /** Color de acento (cupón, botón) y su texto. */
  accent: string;
  accentInk: string;
  /** Sombrero o adorno que se apoya sobre el logo. */
  topper: DecorKind;
  /** Decoraciones del banner (la primera es la protagonista). */
  decor: DecorKind[];
}

export const SKINS: Record<SeasonId, ThemeSkin> = {
  "dia-de-la-madre": { from: "#5e2440", to: "#a9496d", accent: "#ffe0a8", accentInk: "#4a1830", topper: "tulip", decor: ["tulip", "heart", "gift", "love-letter", "star"] },
  halloween: { from: "#1a1124", to: "#3d2255", accent: "#ff8a1f", accentInk: "#1a1124", topper: "witch-hat", decor: ["pumpkin", "witch-hat", "bat", "ghost", "bat"] },
  "black-friday": { from: "#0b0b0d", to: "#2a2a30", accent: "#f3dca6", accentInk: "#0b0b0d", topper: "price-tag", decor: ["bag", "price-tag", "star", "flame", "star"] },
  navidad: { from: "#0e3526", to: "#1f6243", accent: "#f3c84c", accentInk: "#0e3526", topper: "santa-hat", decor: ["tree", "gift", "ornament", "snowflake", "santa-hat"] },
  "ano-nuevo": { from: "#0d1330", to: "#2a3670", accent: "#f3dca6", accentInk: "#0d1330", topper: "party-hat", decor: ["champagne", "firework", "star", "party-hat", "firework"] },
  "san-valentin": { from: "#5c1028", to: "#a8274a", accent: "#ffd1dc", accentInk: "#5c1028", topper: "heart", decor: ["love-letter", "heart", "tulip", "heart", "star"] },
  "san-patricio": { from: "#0c3f24", to: "#1b7442", accent: "#f6c84c", accentInk: "#0c3f24", topper: "leprechaun-hat", decor: ["shamrock", "pot-of-gold", "leprechaun-hat", "shamrock", "star"] },
  pascuas: { from: "#3f2a66", to: "#7556a8", accent: "#ffe28a", accentInk: "#3f2a66", topper: "bunny-ears", decor: ["easter-egg", "bunny-ears", "tulip", "easter-egg", "star"] },
  "dia-del-animal": { from: "#283019", to: "#4f5d33", accent: "#f3dca6", accentInk: "#283019", topper: "paw", decor: ["paw", "bone", "heart", "paw", "bone"] },
  "hot-sale": { from: "#5e1508", to: "#b8391a", accent: "#ffd34d", accentInk: "#5e1508", topper: "flame", decor: ["flame", "price-tag", "bag", "flame", "star"] },
  "dia-del-padre": { from: "#16222f", to: "#2e4862", accent: "#e9c27a", accentInk: "#16222f", topper: "fedora", decor: ["fedora", "tie", "mustache", "mate", "star"] },
  "dia-del-amigo": { from: "#22381f", to: "#4a6a2c", accent: "#f3dca6", accentInk: "#22381f", topper: "mate", decor: ["mate", "heart", "paw", "star", "mate"] },
  "dia-del-nino": { from: "#0b4468", to: "#1f7fb3", accent: "#ffd34d", accentInk: "#0b4468", topper: "party-hat", decor: ["balloon", "kite", "star", "balloon", "party-hat"] },
};

export function skinOf(id: SeasonId): ThemeSkin {
  return SKINS[id];
}
