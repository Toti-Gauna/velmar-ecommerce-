import type { CollarConfig } from "../fixtures/collar";
import type { PersonalizationKind } from "../types";

export interface LinePersonalization {
  kind: PersonalizationKind;
  text?: string;
  font?: string;
  color?: string;
  colorName?: string;
  notes?: string;
  /** Vista previa aprobada (data URL generado en el navegador). Nunca se sube a ningún servidor en la demo. */
  previewDataUrl?: string;
  /** Miniatura de la foto de referencia (solo navegador). */
  referenceDataUrl?: string;
  approvedAt: string;
  /** Configuración del collar (solo productos con configurador). */
  collar?: CollarConfig;
}

export interface CartLine {
  id: string;
  productSlug: string;
  variantId: string;
  quantity: number;
  personalization?: LinePersonalization;
}
