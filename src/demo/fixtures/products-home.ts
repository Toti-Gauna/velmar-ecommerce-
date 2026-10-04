import type { Product } from "../types";
import { engravingTemplate, photoLampTemplate, referenceTemplate } from "./templates";

export const homeProducts: Product[] = [
  {
    slug: "velador-con-foto", name: "Velador con foto", short: "Tu foto impresa, con luz LED",
    description: "Velador con tu foto impresa sobre panel en arco y base de madera con luz LED cálida. Subí la foto, encuadrala y mirá la vista previa antes de pagar.",
    categorySlug: "iluminacion", basePrice: 58000, madeToOrderDays: 10, art: "lamp-photo", gallery: ["front", "context"],
    variants: [
      { id: "vcf-m", label: "Mediano (20 cm)", size: "Mediano", priceDelta: 0, stock: -1 },
      { id: "vcf-g", label: "Grande (28 cm)", size: "Grande", priceDelta: 9000, stock: -1 },
    ],
    personalization: photoLampTemplate,
    faqs: [
      { q: "¿Qué foto conviene?", a: "Una foto nítida, con buena luz y la cara de frente. Mejor si es de cámara y no captura de pantalla." },
      { q: "¿Cómo se alimenta?", a: "Con cable USB. Podés usar cualquier cargador de celular." },
      { q: "¿Lo que veo es exacto?", a: "La vista previa es ilustrativa: respeta encuadre y zoom. El color final puede variar levemente." },
    ],
    featured: true, isNew: false, soldCount: 47, tags: ["lámpara", "foto", "regalo", "luz"],
  },
  {
    slug: "velador-pintado-a-mano", name: "Velador pintado a mano", short: "Desde tu foto de referencia",
    description: "Pieza de MDF de 3 mm pintada a mano a partir de tu foto, con luz LED. Mandanos la foto de referencia y notas; te mostramos el boceto antes de producir.",
    categorySlug: "iluminacion", basePrice: 72000, madeToOrderDays: 15, art: "lamp-painted", gallery: ["front", "detail"],
    variants: [{ id: "vpm-unico", label: "Único (30 cm)", size: "30 cm", priceDelta: 0, stock: -1 }],
    personalization: referenceTemplate,
    faqs: [
      { q: "¿Puedo pedir cambios?", a: "Sí, una ronda de ajustes sobre el boceto antes de pintar." },
      { q: "¿Se puede devolver?", a: "Los productos personalizados pueden estar exceptuados del arrepentimiento. Ver términos." },
    ],
    featured: false, isNew: true, soldCount: 12, tags: ["lámpara", "pintado", "foto", "luz"],
  },
  {
    slug: "colgador-de-correa", name: "Colgador de correa con silueta", short: "Madera con gancho, raza a elección",
    description: "Colgador de pared con la silueta de tu perro, listón ranurado y ganchos para correas. Sumá el nombre grabado.",
    categorySlug: "deco", basePrice: 24000, madeToOrderDays: 7, art: "leash-hanger", gallery: ["front", "context"],
    variants: [
      { id: "cdc-natural", label: "Madera natural", color: "Natural", colorHex: "#d8b98c", priceDelta: 0, stock: -1 },
      { id: "cdc-negro", label: "Negro", color: "Negro", colorHex: "#2a2a2a", priceDelta: 1500, stock: -1 },
    ],
    personalization: engravingTemplate,
    faqs: [{ q: "¿Trae tornillos?", a: "Sí, con tarugos para pared de material." }],
    featured: false, isNew: false, soldCount: 28, tags: ["perro", "correa", "pared"],
  },
  {
    slug: "salchicha-geometrico", name: "Perro salchicha geométrico", short: "Madera grabada con láser",
    description: "Figura de perro salchicha en madera, con diseño geométrico grabado con láser. Para apoyar en un estante.",
    categorySlug: "deco", basePrice: 21000, art: "dachshund", gallery: ["front", "detail"],
    variants: [{ id: "sg-unico", label: "Único (25 cm)", priceDelta: 0, stock: 5 }],
    faqs: [{ q: "¿Se puede colgar?", a: "Está pensado para apoyar. Para colgar, consultanos." }],
    featured: false, isNew: false, soldCount: 33, tags: ["perro", "salchicha", "madera"],
  },
  {
    slug: "figura-persona-y-perro", name: "Figura persona y perro", short: "MDF cortado con láser",
    description: "Figura de MDF con la silueta de una persona y su perro. Un regalo para quien siempre sale a pasear.",
    categorySlug: "deco", basePrice: 19500, art: "figure-pair", gallery: ["front"],
    variants: [
      { id: "fpp-mujer", label: "Mujer & perro", size: "Mujer & perro", priceDelta: 0, stock: 4 },
      { id: "fpp-hombre", label: "Hombre & perro", size: "Hombre & perro", priceDelta: 0, stock: 2 },
    ],
    faqs: [{ q: "¿Qué medida tiene?", a: "Unos 30 cm de alto." }],
    featured: false, isNew: false, soldCount: 17, tags: ["perro", "regalo", "mdf"],
  },
  {
    slug: "vela-caniche", name: "Vela caniche", short: "Aromática, sobre base de madera",
    description: "Vela aromática con forma de caniche, moldeada a mano, sobre base de madera reutilizable.",
    categorySlug: "velas", basePrice: 11900, art: "candle-poodle", gallery: ["front", "context"],
    variants: [
      { id: "vc-vainilla", label: "Vainilla", color: "Vainilla", colorHex: "#f3e6cf", priceDelta: 0, stock: 8 },
      { id: "vc-lavanda", label: "Lavanda", color: "Lavanda", colorHex: "#cbbbe0", priceDelta: 0, stock: 6 },
    ],
    faqs: [{ q: "¿Cuánto dura?", a: "Alrededor de 20 horas de encendido." }],
    featured: false, isNew: true, soldCount: 26, tags: ["vela", "aroma", "caniche", "regalo"],
  },
  {
    slug: "home-spray", name: "Home spray Velmar", short: "Línea nueva de aromas · 250 ml",
    description: "Perfume para ambientes y textiles de la línea nueva de aromas.",
    categorySlug: "hogar", basePrice: 8900, art: "home-spray", gallery: ["front"],
    variants: [
      { id: "hs-algodon", label: "Algodón", size: "Algodón", priceDelta: 0, stock: 20 },
      { id: "hs-maderas", label: "Maderas", size: "Maderas", priceDelta: 0, stock: 14 },
    ],
    faqs: [{ q: "¿Mancha la ropa?", a: "Aplicar a 30 cm. Probar antes en una zona poco visible." }],
    featured: false, isNew: true, soldCount: 15, tags: ["aroma", "hogar", "perfume"],
  },
  {
    slug: "difusor", name: "Difusor de varillas Velmar", short: "Línea nueva de aromas · 120 ml",
    description: "Difusor con varillas de ratán y frasco de vidrio. Aroma suave y duradero.",
    categorySlug: "hogar", basePrice: 12900, art: "diffuser", gallery: ["front", "context"],
    variants: [{ id: "dif-algodon", label: "Algodón", size: "Algodón", priceDelta: 0, stock: 10 }],
    faqs: [{ q: "¿Cuánto dura?", a: "Entre 6 y 8 semanas según el ambiente." }],
    featured: false, isNew: true, soldCount: 9, tags: ["aroma", "hogar", "difusor"],
  },
  {
    slug: "pieza-i-love-mdp", name: "Pieza “I ♥ MDP”", short: "MDF pintado a mano",
    description: "Souvenir de Mar del Plata en MDF pintado a mano.",
    categorySlug: "souvenirs", basePrice: 7500, art: "mdp-sign", gallery: ["front"],
    variants: [{ id: "mdp-unico", label: "Único (15 cm)", priceDelta: 0, stock: 15 }],
    faqs: [{ q: "¿Hacen por cantidad?", a: "Sí, para eventos. Escribinos por WhatsApp." }],
    featured: false, isNew: false, soldCount: 41, tags: ["mar del plata", "souvenir", "regalo"],
  },
];
