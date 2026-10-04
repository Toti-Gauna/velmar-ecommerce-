/** Tipos del catálogo de demo. Espejan el modelo de la especificación técnica (sección 4). */

export type PersonalizationKind = "TEXT" | "PHOTO" | "PHOTO_REFERENCE";
export type PaymentMethod = "CHECKOUT_PRO" | "BANK_TRANSFER" | "QR_MANUAL";
export type FulfillmentType = "PICKUP" | "LOCAL_DELIVERY" | "SHIPPING";
export type ArtKey =
  | "bowl-dog" | "bowl-wood" | "collar" | "nfc-tag" | "nfc-keychain" | "lamp-photo"
  | "lamp-painted" | "leash-hanger" | "dachshund" | "figure-pair" | "candle-poodle"
  | "home-spray" | "diffuser" | "mdp-sign";
export type ArtView = "front" | "detail" | "context";

export interface Category {
  slug: string;
  name: string;
  description: string;
  art: ArtKey;
  featured: boolean;
  sortOrder: number;
}

export interface Variant {
  id: string;
  label: string;
  color?: string;
  colorHex?: string;
  size?: string;
  priceDelta: number;
  /** -1 = a pedido (sin límite), 0 = sin stock */
  stock: number;
}

export interface Faq {
  q: string;
  a: string;
}

export type PhotoMask = "arch" | "circle" | "rounded";

export interface PersonalizationTemplate {
  id: string;
  name: string;
  kind: PersonalizationKind;
  /** Silueta que recorta la foto (solo PHOTO). */
  mask?: PhotoMask;
  maxChars?: number;
  fonts?: string[];
  colors?: { name: string; hex: string }[];
  surcharge: number;
  notesPlaceholder?: string;
}

export interface Product {
  slug: string;
  name: string;
  short: string;
  description: string;
  categorySlug: string;
  basePrice: number;
  madeToOrderDays?: number;
  art: ArtKey;
  gallery: ArtView[];
  variants: Variant[];
  personalization?: PersonalizationTemplate;
  faqs: Faq[];
  featured: boolean;
  isNew: boolean;
  soldCount: number;
  tags: string[];
  /** false = oculto en la tienda (se edita desde el panel). Por defecto true. */
  active?: boolean;
  imageAlt?: string;
  /** Foto cargada desde el panel demo (data URL, solo en este navegador). */
  photoDataUrl?: string;
  dims?: { lengthCm: number; widthCm: number; heightCm: number; weightG: number };
}

export interface Coupon {
  code: string;
  type: "PERCENT" | "FIXED" | "FREE_SHIPPING";
  value: number;
  minSubtotal?: number;
  onlyRegistered?: boolean;
  endsAt?: string;
  description: string;
  active?: boolean;
  maxUses?: number;
  /** Usos simulados. */
  usedCount?: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: "UNITS_COUNT" | "ORDERS_COUNT" | "SPEND_TOTAL";
  threshold: number;
  reward: string;
  active?: boolean;
  /** Misión siguiente de la cadena: el excedente pasa a esa misión (spec 5.6). */
  nextMissionId?: string | null;
  /** Clientes que la completaron (muestra). */
  completedCount?: number;
}

export interface ShippingZone {
  id: string;
  type: FulfillmentType;
  name: string;
  price: number | null;
  etaText: string;
  postalCodes?: string[];
  active?: boolean;
}

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  art: ArtKey;
  active?: boolean;
}
