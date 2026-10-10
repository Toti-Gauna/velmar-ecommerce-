/**
 * Configurador del collar con nombre (pedido de Ignacio, fuera de la especificación). Opciones según la
 * investigación de la Fase 0 (docs/investigacion.md): formato de las letras, material, color del cordón, dije y
 * talle por contorno de cuello. Precios de MUESTRA, en pesos enteros.
 */

export type CollarFormat = "letters" | "joined" | "tag";
export type CollarMaterial = "paracord" | "biothane" | "nylon";
export type CollarCharm = "none" | "paw" | "bone" | "heart" | "phone";

export interface CollarOption<T extends string> {
  id: T;
  name: string;
  hint: string;
  /** Recargo en pesos enteros sobre el precio de la variante. */
  delta: number;
}

export interface CollarSpec {
  formats: CollarOption<CollarFormat>[];
  materials: CollarOption<CollarMaterial>[];
  charms: CollarOption<CollarCharm>[];
  cordColors: { name: string; hex: string }[];
  /** Contorno de cuello por variante (cm, ambos incluidos). */
  sizes: { variantId: string; min: number; max: number }[];
}

export interface CollarConfig {
  format: CollarFormat;
  material: CollarMaterial;
  cordColor: string;
  cordColorName: string;
  charm: CollarCharm;
  /** Contorno de cuello medido (opcional): elige el talle. */
  neckCm?: number;
}

export const collarSpec: CollarSpec = {
  formats: [
    { id: "letters", name: "Letras sueltas", hint: "Cada letra cuelga por separado, como en el Instagram", delta: 0 },
    { id: "joined", name: "Nombre de corrido", hint: "El nombre en una sola pieza", delta: 1500 },
    { id: "tag", name: "Chapita con nombre", hint: "Hueso con el nombre y un teléfono", delta: 1000 },
  ],
  materials: [
    { id: "paracord", name: "Paracord trenzado", hint: "El clásico de Velmar, trenzado a mano", delta: 0 },
    { id: "biothane", name: "Biothane", hint: "Impermeable, ideal para la playa", delta: 3000 },
    { id: "nylon", name: "Nylon 20 mm", hint: "Liviano y suave", delta: 0 },
  ],
  charms: [
    { id: "paw", name: "Patita", hint: "Incluido", delta: 0 },
    { id: "bone", name: "Hueso", hint: "Incluido", delta: 0 },
    { id: "heart", name: "Corazón", hint: "Incluido", delta: 0 },
    { id: "phone", name: "Chapita con teléfono", hint: "Por si se pierde", delta: 1500 },
    { id: "none", name: "Sin dije", hint: "", delta: 0 },
  ],
  cordColors: [
    { name: "Verde oliva", hex: "#5a6b3a" },
    { name: "Negro", hex: "#26282a" },
    { name: "Rosa", hex: "#e38aa3" },
    { name: "Celeste", hex: "#7fb2dc" },
    { name: "Terracota", hex: "#c0643f" },
    { name: "Crema", hex: "#efe2c6" },
  ],
  sizes: [
    { variantId: "col-xs", min: 20, max: 27 },
    { variantId: "col-s", min: 28, max: 35 },
    { variantId: "col-m", min: 36, max: 45 },
    { variantId: "col-l", min: 46, max: 55 },
    { variantId: "col-xl", min: 56, max: 65 },
  ],
};

export const defaultCollarConfig: CollarConfig = { format: "letters", material: "paracord", cordColor: "#5a6b3a", cordColorName: "Verde oliva", charm: "paw" };

/** Combinaciones listas para inspirarse y pedir con un toque (galería de la ficha). Nombres de muestra. */
export interface CollarPreset {
  id: string;
  title: string;
  name: string;
  font: string;
  letterColor: string;
  letterColorName: string;
  config: CollarConfig;
}

export const collarPresets: CollarPreset[] = [
  { id: "olivia", title: "Clásico oliva", name: "Olivia", font: "Redondeada", letterColor: "#ffffff", letterColorName: "Blanco", config: { format: "letters", material: "paracord", cordColor: "#5a6b3a", cordColorName: "Verde oliva", charm: "paw" } },
  { id: "mora", title: "Rosa y corazón", name: "Mora", font: "Manuscrita", letterColor: "#ffffff", letterColorName: "Blanco", config: { format: "letters", material: "paracord", cordColor: "#e38aa3", cordColorName: "Rosa", charm: "heart" } },
  { id: "pancho", title: "Playa todo el año", name: "Pancho", font: "Redondeada", letterColor: "#1f1f1f", letterColorName: "Negro", config: { format: "joined", material: "biothane", cordColor: "#7fb2dc", cordColorName: "Celeste", charm: "bone" } },
  { id: "kira", title: "Negro elegante", name: "Kira", font: "Clásica", letterColor: "#d9667f", letterColorName: "Rosa", config: { format: "letters", material: "paracord", cordColor: "#26282a", cordColorName: "Negro", charm: "phone" } },
  { id: "simba", title: "Terracota", name: "Simba", font: "Redondeada", letterColor: "#ffffff", letterColorName: "Blanco", config: { format: "tag", material: "nylon", cordColor: "#c0643f", cordColorName: "Terracota", charm: "none" } },
  { id: "luna", title: "Crema suave", name: "Luna", font: "Manuscrita", letterColor: "#3d4a2a", letterColorName: "Verde oliva", config: { format: "letters", material: "paracord", cordColor: "#efe2c6", cordColorName: "Crema", charm: "paw" } },
];
