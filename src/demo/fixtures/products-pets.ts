import type { Product } from "../types";
import { engravingTemplate, nameTemplate } from "./templates";

const madeToOrderFaq = { q: "¿Cuánto tarda?", a: "Se fabrica a pedido. El plazo corre desde que se confirma el pago." };

export const petProducts: Product[] = [
  {
    slug: "comedero-perro-globo", name: "Comedero perro globo", short: "Impreso en 3D, en el color que elijas",
    description: "Comedero con forma de perro globo, impreso en 3D con material apto para alimento seco. Elegí color, tamaño y sumá el nombre de tu mascota.",
    categorySlug: "comederos", basePrice: 18500, madeToOrderDays: 7, art: "bowl-dog", gallery: ["front", "detail", "context"],
    variants: [
      { id: "cpg-rosa-m", label: "Rosa · Mediano", color: "Rosa", colorHex: "#e88aa0", size: "Mediano", priceDelta: 0, stock: -1 },
      { id: "cpg-rosa-g", label: "Rosa · Grande", color: "Rosa", colorHex: "#e88aa0", size: "Grande", priceDelta: 4500, stock: -1 },
      { id: "cpg-celeste-m", label: "Celeste · Mediano", color: "Celeste", colorHex: "#8cbfe0", size: "Mediano", priceDelta: 0, stock: -1 },
      { id: "cpg-celeste-g", label: "Celeste · Grande", color: "Celeste", colorHex: "#8cbfe0", size: "Grande", priceDelta: 4500, stock: -1 },
      { id: "cpg-crema-m", label: "Crema · Mediano", color: "Crema", colorHex: "#f1e4c8", size: "Mediano", priceDelta: 0, stock: -1 },
      { id: "cpg-crema-g", label: "Crema · Grande", color: "Crema", colorHex: "#f1e4c8", size: "Grande", priceDelta: 4500, stock: -1 },
    ],
    personalization: nameTemplate,
    faqs: [madeToOrderFaq, { q: "¿Se puede lavar?", a: "Sí, a mano con agua tibia. No va al lavavajillas." }, { q: "¿Sirve para agua?", a: "Recomendado para alimento seco. Para agua consultanos el acabado sellado." }],
    featured: true, isNew: false, soldCount: 64, tags: ["perro", "plato", "3d"],
  },
  {
    slug: "comedero-elevado-madera", name: "Comedero elevado de madera", short: "Doble, con bowls de acero",
    description: "Soporte de madera maciza con dos bowls de acero inoxidable. Altura pensada para perros medianos. Podés grabar el nombre en el frente.",
    categorySlug: "comederos", basePrice: 32000, art: "bowl-wood", gallery: ["front", "context"],
    variants: [
      { id: "cem-natural", label: "Natural", color: "Natural", colorHex: "#d8b98c", priceDelta: 0, stock: 3 },
      { id: "cem-nogal", label: "Nogal", color: "Nogal", colorHex: "#7a5434", priceDelta: 3000, stock: 0 },
    ],
    personalization: engravingTemplate,
    faqs: [{ q: "¿Viene armado?", a: "Sí, listo para usar." }, { q: "¿Los bowls se sacan?", a: "Sí, para lavarlos por separado." }],
    featured: true, isNew: false, soldCount: 22, tags: ["perro", "plato", "madera"],
  },
  {
    slug: "collar-con-nombre", name: "Collar con nombre y dijes de patita", short: "Letras impresas en 3D",
    description: "Collar regulable con el nombre de tu mascota en letras impresas en 3D y dijes de patita. Elegí el color de las letras.",
    categorySlug: "collares", basePrice: 14900, madeToOrderDays: 5, art: "collar", gallery: ["front", "detail"],
    variants: [
      { id: "col-s", label: "Chico (25–35 cm)", size: "Chico", priceDelta: 0, stock: -1 },
      { id: "col-m", label: "Mediano (35–45 cm)", size: "Mediano", priceDelta: 1500, stock: -1 },
      { id: "col-l", label: "Grande (45–55 cm)", size: "Grande", priceDelta: 2500, stock: -1 },
    ],
    personalization: nameTemplate,
    faqs: [madeToOrderFaq, { q: "¿Cómo mido el cuello?", a: "Con un centímetro, dejando dos dedos de holgura." }],
    featured: true, isNew: false, soldCount: 51, tags: ["perro", "gato", "nombre"],
  },
  {
    slug: "chapita-nfc", name: "Chapita identificatoria NFC", short: "Acercás el celu y abre tu link",
    description: "Chapita con chip NFC que abre el link que quieras: tu WhatsApp, un perfil o una página con datos de contacto. Lleva el nombre grabado del otro lado.",
    categorySlug: "llaveros-nfc", basePrice: 12500, art: "nfc-tag", gallery: ["front", "detail", "context"],
    variants: [
      { id: "nfc-hueso", label: "Hueso", size: "Hueso", priceDelta: 0, stock: 12 },
      { id: "nfc-circulo", label: "Círculo", size: "Círculo", priceDelta: 0, stock: 7 },
    ],
    personalization: nameTemplate,
    faqs: [{ q: "¿Necesita batería?", a: "No. El chip NFC se activa con el celular." }, { q: "¿Puedo cambiar el link?", a: "Sí, se reprograma desde el celular." }],
    featured: false, isNew: true, soldCount: 38, tags: ["perro", "gato", "identificación", "nfc"],
  },
  {
    slug: "llavero-nfc-huella", name: "Llavero NFC con huella", short: "Para tus llaves, con chip NFC",
    description: "Llavero con forma de huella y chip NFC. Ideal para compartir tu contacto o el perfil de tu emprendimiento.",
    categorySlug: "llaveros-nfc", basePrice: 9900, art: "nfc-keychain", gallery: ["front", "detail"],
    variants: [
      { id: "lln-verde", label: "Verde oliva", color: "Verde oliva", colorHex: "#3d4a2a", priceDelta: 0, stock: 9 },
      { id: "lln-madera", label: "Madera", color: "Madera", colorHex: "#c9a77a", priceDelta: 0, stock: 0 },
    ],
    faqs: [{ q: "¿Funciona con iPhone?", a: "Sí, con modelos que leen NFC (iPhone XS en adelante)." }],
    featured: false, isNew: false, soldCount: 19, tags: ["llavero", "nfc", "regalo"],
  },
];
