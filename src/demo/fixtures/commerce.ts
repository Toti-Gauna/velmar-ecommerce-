import type { CarouselSlide, Coupon, Mission, ShippingZone } from "../types";

/** Ajustes de cobro de MUESTRA. Ningún dato bancario real. */
export const demoSettings = {
  transferDiscountPct: 10,
  freeShippingFrom: 120000,
  pendingTransferHours: 48,
  transferAlias: "ALIAS.DE.MUESTRA",
  transferCbu: "0000000000000000000000",
  transferHolder: "Titular de muestra",
  nationalTaxRate: 0.21,
} as const;

export const coupons: Coupon[] = [
  { code: "BIENVENIDA10", type: "PERCENT", value: 10, description: "10% en tu primera compra" },
  { code: "FERIA2000", type: "FIXED", value: 2000, minSubtotal: 20000, description: "$2.000 desde $20.000 (cupón de feria)" },
  { code: "ENVIOGRATIS", type: "FREE_SHIPPING", value: 0, onlyRegistered: true, description: "Envío gratis, solo con cuenta" },
  { code: "INVIERNO", type: "PERCENT", value: 15, endsAt: "2026-08-31", description: "Cupón vencido de ejemplo" },
];

export const missions: Mission[] = [
  { id: "m-dos-productos", title: "Comprá 2 productos", description: "En uno o varios pedidos pagados.", type: "UNITS_COUNT", threshold: 2, reward: "Llavero NFC de regalo" },
  { id: "m-primera", title: "Primera compra con cuenta", description: "Tu primer pedido pagado con cuenta.", type: "ORDERS_COUNT", threshold: 1, reward: "Grabado de nombre gratis en la próxima" },
  { id: "m-gasto", title: "Sumá $100.000", description: "Acumulado en pedidos pagados.", type: "SPEND_TOTAL", threshold: 100000, reward: "Comedero de regalo" },
];

/** Progreso de muestra de la cuenta demo, antes del pedido actual. */
export const demoAccountProgress: Record<string, number> = { "m-dos-productos": 1, "m-primera": 0, "m-gasto": 58000 };

export const shippingZones: ShippingZone[] = [
  { id: "pickup", type: "PICKUP", name: "Retiro en persona", price: 0, etaText: "Coordinamos día y horario por WhatsApp" },
  { id: "local", type: "LOCAL_DELIVERY", name: "Cadete en Mar del Plata", price: 3500, etaText: "24–48 h desde que está listo", postalCodes: ["7600", "7601", "7602", "7603", "7604", "7605", "7606", "7607", "7608", "7609", "7610", "7611", "7612"] },
  { id: "national", type: "SHIPPING", name: "Envío al resto del país", price: 9800, etaText: "3–7 días hábiles por correo" },
];

export const slides: CarouselSlide[] = [
  { id: "s1", title: "Mirá tu pieza antes de pagar", subtitle: "Subí la foto, encuadrala y aprobá la vista previa.", ctaLabel: "Crear mi producto", ctaHref: "/crear/", art: "lamp-photo" },
  { id: "s2", title: "Comederos en el color de tu casa", subtitle: "Impresos en 3D, con el nombre de tu mascota.", ctaLabel: "Ver comederos", ctaHref: "/c/comederos/", art: "bowl-dog" },
  { id: "s3", title: "Nueva línea de aromas", subtitle: "Home spray y difusores Velmar.", ctaLabel: "Ver aromas", ctaHref: "/c/hogar/", art: "diffuser" },
];

export const DEMO_TRACKING_TOKEN = "demo-velmar";
export const DEMO_ORDER_CODE = "VEL-DEMO-0001";
