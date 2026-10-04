import { baseTemplates } from "../fixtures/templates";
import type { PersonalizationTemplate, Product } from "../types";

/** Plantillas vigentes: las editadas viven dentro de los productos que las usan. */
export function templatesFrom(products: Product[]): PersonalizationTemplate[] {
  const byId = new Map(baseTemplates.map((t) => [t.id, t]));
  for (const p of products) if (p.personalization) byId.set(p.personalization.id, p.personalization);
  return [...byId.values()];
}
