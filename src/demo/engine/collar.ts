import type { CollarConfig, CollarSpec } from "../fixtures/collar";
import type { Product } from "../types";

/** Reglas del configurador de collar: recargos, talle por contorno de cuello y descripción para el taller. */

export function collarSurcharge(spec: CollarSpec | undefined, config: CollarConfig | undefined): number {
  if (!spec || !config) return 0;
  const pick = <T extends { id: string; delta: number }>(list: T[], id: string) => list.find((o) => o.id === id)?.delta ?? 0;
  return pick(spec.formats, config.format) + pick(spec.materials, config.material) + pick(spec.charms, config.charm);
}

/** Talle (variante) para un contorno de cuello; null si está fuera de los talles (se hace a medida por WhatsApp). */
export function sizeForNeck(spec: CollarSpec, product: Product, cm: number): string | null {
  if (!Number.isFinite(cm)) return null;
  const size = spec.sizes.find((s) => cm >= s.min && cm <= s.max && product.variants.some((v) => v.id === s.variantId));
  return size?.variantId ?? null;
}

export function neckRange(spec: CollarSpec, variantId: string): { min: number; max: number } | null {
  const s = spec.sizes.find((x) => x.variantId === variantId);
  return s ? { min: s.min, max: s.max } : null;
}

/** Texto corto para el carrito, el pedido y los emails: "Letras sueltas · Paracord trenzado verde oliva · dije patita". */
export function describeCollar(spec: CollarSpec | undefined, config: CollarConfig | undefined): string {
  if (!spec || !config) return "";
  const format = spec.formats.find((o) => o.id === config.format)?.name;
  const material = spec.materials.find((o) => o.id === config.material)?.name;
  const charm = spec.charms.find((o) => o.id === config.charm);
  return [
    format,
    `${material ?? ""} ${config.cordColorName.toLowerCase()}`.trim(),
    charm && charm.id !== "none" ? `dije ${charm.name.toLowerCase()}` : "sin dije",
    config.neckCm ? `cuello ${config.neckCm} cm` : "",
  ].filter(Boolean).join(" · ");
}

/** Letras que se imprimen (las sueltas se cuentan una por una; los espacios no llevan pieza). */
export function collarPieces(text: string, config: CollarConfig): string[] {
  const clean = text.trim();
  if (config.format !== "letters") return clean ? [clean] : [];
  return [...clean.toUpperCase()].filter((ch) => ch.trim());
}
