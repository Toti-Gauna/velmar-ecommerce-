import type { AdminOrder } from "../admin/types";

/** Fecha de referencia de la demo: todas las cifras "de hoy/semana/mes" se calculan contra esta fecha. */
export const DEMO_TODAY = "2026-10-04";

type Seed = Omit<AdminOrder, "total" | "notes" | "log"> & { notes?: string[]; log?: AdminOrder["log"] };
const txt = (text: string, font = "Redondeada", color = "#3d4a2a", colorName = "Verde oliva") => ({ kind: "TEXT" as const, text, font, color, colorName, approvedAt: "2026-10-01T10:00:00Z" });

/** Pedidos FICTICIOS. Nombres, emails y teléfonos inventados (dominio ejemplo.com). */
export const orderSeeds: Seed[] = [
  { code: "VEL-000126", createdAt: "2026-10-04T09:12:00-03:00", customer: { name: "Lucía Fernández", email: "lucia.f@ejemplo.com", phone: "223 555-0126" }, userId: "u-lucia", status: "PENDING_PAYMENT", fulfillment: "SHIPPING", paymentMethod: "CHECKOUT_PRO", address: "Calle Falsa 123, Tandil (7000)",
    lines: [{ id: "a", productSlug: "velador-con-foto", variantId: "vcf-m", quantity: 1, personalization: { kind: "PHOTO", approvedAt: "2026-10-04T09:10:00Z" } }] },
  { code: "VEL-000125", createdAt: "2026-10-03T19:40:00-03:00", customer: { name: "Martín Gómez", email: "martin.g@ejemplo.com", phone: "223 555-0125" }, userId: null, status: "PENDING_PAYMENT", fulfillment: "LOCAL_DELIVERY", paymentMethod: "BANK_TRANSFER", address: "Av. Colón 1500, Mar del Plata (7600)",
    lines: [{ id: "a", productSlug: "collar-con-nombre", variantId: "col-m", quantity: 1, personalization: txt("Pancho") }] },
  { code: "VEL-000124", createdAt: "2026-10-03T11:05:00-03:00", customer: { name: "Sofía Ruiz", email: "sofia.r@ejemplo.com", phone: "223 555-0124" }, userId: "u-sofia", status: "PAYMENT_REVIEW", fulfillment: "PICKUP", paymentMethod: "QR_MANUAL",
    lines: [{ id: "a", productSlug: "vela-caniche", variantId: "vc-lavanda", quantity: 2 }, { id: "b", productSlug: "home-spray", variantId: "hs-algodon", quantity: 1 }],
    proof: { fileName: "captura-qr-124.jpg", receivedAt: "2026-10-03T11:20:00-03:00", status: "IN_REVIEW" } },
  { code: "VEL-000123", createdAt: "2026-10-02T16:30:00-03:00", customer: { name: "Diego Álvarez", email: "diego.a@ejemplo.com", phone: "223 555-0123" }, userId: "u-diego", status: "PAYMENT_REVIEW", fulfillment: "LOCAL_DELIVERY", paymentMethod: "BANK_TRANSFER", address: "Güemes 2800, Mar del Plata (7600)",
    lines: [{ id: "a", productSlug: "comedero-perro-globo", variantId: "cpg-celeste-g", quantity: 1, personalization: txt("Ñoqui", "Manuscrita", "#3f7fb5", "Celeste") }],
    proof: { fileName: "comprobante-123.pdf", receivedAt: "2026-10-02T17:02:00-03:00", status: "IN_REVIEW" } },
  { code: "VEL-000122", createdAt: "2026-10-02T10:15:00-03:00", customer: { name: "Valentina Sosa", email: "vale.s@ejemplo.com", phone: "223 555-0122" }, userId: "u-vale", status: "PAID", fulfillment: "SHIPPING", paymentMethod: "CHECKOUT_PRO", address: "San Martín 450, Necochea (7630)",
    lines: [{ id: "a", productSlug: "velador-pintado-a-mano", variantId: "vpm-unico", quantity: 1, personalization: { kind: "PHOTO_REFERENCE", notes: "Gato naranja durmiendo, fondo azul noche.", approvedAt: "2026-10-02T10:10:00Z" } }] },
  { code: "VEL-000121", createdAt: "2026-10-01T13:00:00-03:00", customer: { name: "Julián Paz", email: "julian.p@ejemplo.com", phone: "223 555-0121" }, userId: "u-julian", status: "IN_PRODUCTION", fulfillment: "LOCAL_DELIVERY", paymentMethod: "QR_MANUAL", address: "Rivadavia 3200, Mar del Plata (7600)", promisedDate: "2026-10-08",
    lines: [{ id: "a", productSlug: "colgador-de-correa", variantId: "cdc-natural", quantity: 1, personalization: { ...txt("Kira", "Clásica", "#6b4a2b", "Grabado natural") } }],
    proof: { fileName: "qr-121.png", receivedAt: "2026-10-01T13:30:00-03:00", status: "APPROVED" }, notes: ["Silueta: ovejero alemán (confirmado por WhatsApp)."] },
  { code: "VEL-000120", createdAt: "2026-09-30T18:20:00-03:00", customer: { name: "Camila Torres", email: "cami.t@ejemplo.com", phone: "223 555-0120" }, userId: "u-sofia", status: "READY", fulfillment: "LOCAL_DELIVERY", paymentMethod: "BANK_TRANSFER", address: "Alem 2700, Mar del Plata (7600)",
    lines: [{ id: "a", productSlug: "placa-nfc-instagram", variantId: "pnig-blanca", quantity: 2 }],
    proof: { fileName: "transferencia-120.pdf", receivedAt: "2026-09-30T18:45:00-03:00", status: "APPROVED" } },
  { code: "VEL-000119", createdAt: "2026-09-29T09:00:00-03:00", customer: { name: "Diego Álvarez", email: "diego.a@ejemplo.com", phone: "223 555-0123" }, userId: "u-diego", status: "SHIPPED", fulfillment: "SHIPPING", paymentMethod: "CHECKOUT_PRO", address: "Mitre 900, Balcarce (7620)",
    lines: [{ id: "a", productSlug: "salchicha-geometrico", variantId: "sg-unico", quantity: 1 }, { id: "b", productSlug: "pieza-i-love-mdp", variantId: "mdp-unico", quantity: 2 }] },
  { code: "VEL-000118", createdAt: "2026-09-27T15:10:00-03:00", customer: { name: "Julián Paz", email: "julian.p@ejemplo.com", phone: "223 555-0121" }, userId: "u-julian", status: "DELIVERED", fulfillment: "PICKUP", paymentMethod: "CHECKOUT_PRO",
    lines: [{ id: "a", productSlug: "difusor", variantId: "dif-algodon", quantity: 1 }] },
  { code: "VEL-000117", createdAt: "2026-09-26T12:00:00-03:00", customer: { name: "Rocío Díaz", email: "rocio.d@ejemplo.com", phone: "223 555-0117" }, userId: null, status: "CANCELLED", fulfillment: "PICKUP", paymentMethod: "BANK_TRANSFER",
    lines: [{ id: "a", productSlug: "figura-persona-y-perro", variantId: "fpp-mujer", quantity: 1 }], notes: ["Reserva vencida a las 48 h sin comprobante."] },
  { code: "VEL-000116", createdAt: "2026-09-22T10:30:00-03:00", customer: { name: "Valentina Sosa", email: "vale.s@ejemplo.com", phone: "223 555-0122" }, userId: "u-vale", status: "IN_CLAIM", prevStatus: "DELIVERED", fulfillment: "SHIPPING", paymentMethod: "CHECKOUT_PRO", address: "San Martín 450, Necochea (7630)",
    lines: [{ id: "a", productSlug: "comedero-elevado-madera", variantId: "cem-natural", quantity: 1 }], notes: ["Llegó con una pata floja. Ver reclamo REC-0003."] },
];
