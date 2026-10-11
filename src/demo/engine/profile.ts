/**
 * Datos de la cuenta del comprador en la demo (8.4.6 y 8.4.22, pedido de Ignacio): direcciones guardadas y tarjetas.
 *
 * Tarjetas: es una demo. Se valida el número (Luhn), el vencimiento y el código para que el formulario se sienta real,
 * pero se GUARDA SOLO la marca, los últimos 4 números y el vencimiento: nunca el número completo, el código de seguridad
 * ni el titular. En producción la tarjeta la toma Mercado Pago (su formulario seguro) y Velmar no ve esos datos.
 */

export interface SavedAddress {
  id: string;
  /** Cómo la llama el comprador: Casa, Trabajo… */
  label: string;
  street: string;
  number: string;
  postalCode: string;
  city: string;
  province: string;
}

export type AddressDraft = Omit<SavedAddress, "id">;

export type CardBrand = "visa" | "mastercard" | "amex" | "naranja" | "cabal" | "otra";

export interface SavedCard {
  id: string;
  brand: CardBrand;
  last4: string;
  expMonth: number;
  /** Año completo (2029). */
  expYear: number;
}

/** Lo que se escribe en el formulario (nada de esto se guarda tal cual). */
export interface CardInput {
  number: string;
  expiry: string;
  holder: string;
  cvv: string;
}

export const BRAND_LABEL: Record<CardBrand, string> = { visa: "Visa", mastercard: "Mastercard", amex: "American Express", naranja: "Naranja X", cabal: "Cabal", otra: "Tarjeta" };

/** Tarjeta de prueba (número público de prueba de Visa): para mostrar la demo sin escribir datos de verdad. */
export const TEST_CARD: CardInput = { number: "4242 4242 4242 4242", expiry: "12/29", holder: "Prueba Velmar", cvv: "123" };

/** Dirección de muestra de la cuenta demo (la de "Mis direcciones" antes de 8.4.6). */
export const DEMO_ADDRESS: SavedAddress = { id: "casa", label: "Casa", street: "Calle de Muestra", number: "1234", postalCode: "7600", city: "Mar del Plata", province: "Buenos Aires" };

const digits = (s: string) => s.replace(/\D/g, "");

export function cardBrand(raw: string): CardBrand {
  const n = digits(raw);
  if (/^589562/.test(n)) return "naranja";
  if (/^(6042|6043|5896)/.test(n)) return "cabal";
  if (/^3[47]/.test(n)) return "amex";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(n)) return "mastercard";
  if (/^4/.test(n)) return "visa";
  return "otra";
}

/** Dígito verificador (algoritmo de Luhn), como lo valida cualquier formulario de tarjeta. */
export function luhn(raw: string): boolean {
  const n = digits(raw);
  if (n.length < 12) return false;
  let sum = 0;
  for (let i = 0; i < n.length; i++) {
    let d = Number(n[n.length - 1 - i]);
    if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  return sum % 10 === 0;
}

/** Grupos de 4 (American Express: 4-6-5), mientras se escribe. */
export function formatCardNumber(raw: string): string {
  const n = digits(raw).slice(0, 19);
  if (cardBrand(n) === "amex") return [n.slice(0, 4), n.slice(4, 10), n.slice(10, 15)].filter(Boolean).join(" ");
  return n.replace(/(\d{4})(?=\d)/g, "$1 ");
}

/** "MMAA" mientras se escribe → "MM/AA". */
export function formatExpiry(raw: string): string {
  const n = digits(raw).slice(0, 4);
  return n.length > 2 ? `${n.slice(0, 2)}/${n.slice(2)}` : n;
}

export function parseExpiry(raw: string): { month: number; year: number } | null {
  const m = /^(\d{2})\/?(\d{2})$/.exec(raw.trim());
  if (!m) return null;
  const month = Number(m[1]), year = 2000 + Number(m[2]);
  return month >= 1 && month <= 12 ? { month, year } : null;
}

/** Errores por campo (vacío = se puede guardar). `today` llega de afuera para que las pruebas no dependan del día. */
export function checkCard(input: CardInput, today: Date): Partial<Record<keyof CardInput, string>> {
  const errors: Partial<Record<keyof CardInput, string>> = {};
  const n = digits(input.number);
  const amex = cardBrand(n) === "amex";
  if (!n) errors.number = "Escribí el número de la tarjeta.";
  else if (n.length < 13 || n.length > 19 || !luhn(n)) errors.number = "Revisá el número: no es una tarjeta válida.";
  const exp = parseExpiry(input.expiry);
  if (!exp) errors.expiry = "Escribí el vencimiento como MM/AA.";
  else if (exp.year * 12 + exp.month < today.getFullYear() * 12 + today.getMonth() + 1) errors.expiry = "Esa tarjeta ya venció.";
  if (input.holder.trim().length < 3) errors.holder = "Escribí el nombre como figura en la tarjeta.";
  if (!new RegExp(amex ? "^\\d{4}$" : "^\\d{3}$").test(input.cvv.trim())) errors.cvv = amex ? "Son los 4 números del frente." : "Son los 3 números del dorso.";
  return errors;
}

/** Lo único que se guarda de una tarjeta. */
export function toSavedCard(input: CardInput, id: string): SavedCard {
  const n = digits(input.number);
  const exp = parseExpiry(input.expiry)!;
  return { id, brand: cardBrand(n), last4: n.slice(-4), expMonth: exp.month, expYear: exp.year };
}

export const cardLabel = (c: SavedCard) => `${BRAND_LABEL[c.brand]} terminada en ${c.last4}`;
export const cardExpiry = (c: SavedCard) => `${String(c.expMonth).padStart(2, "0")}/${String(c.expYear % 100).padStart(2, "0")}`;

const BRANDS = Object.keys(BRAND_LABEL) as CardBrand[];
const text = (v: unknown, max = 80) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/**
 * Datos guardados (o tocados a mano): de cada tarjeta quedan solo los campos permitidos, y lo inválido se descarta. Si
 * por algún motivo llegara un número completo o un código, no se conserva.
 */
export function normalizeCards(list: unknown): SavedCard[] {
  if (!Array.isArray(list)) return [];
  return list.flatMap((c): SavedCard[] => {
    if (!c || typeof c !== "object") return [];
    const x = c as Record<string, unknown>;
    const ok = typeof x.id === "string" && BRANDS.includes(x.brand as CardBrand) && typeof x.last4 === "string" && /^\d{4}$/.test(x.last4)
      && Number.isInteger(x.expMonth) && (x.expMonth as number) >= 1 && (x.expMonth as number) <= 12 && Number.isInteger(x.expYear);
    return ok ? [{ id: x.id as string, brand: x.brand as CardBrand, last4: x.last4 as string, expMonth: x.expMonth as number, expYear: x.expYear as number }] : [];
  });
}

/** Errores de una dirección (mismas reglas que el paso Entrega del checkout). */
export function checkAddress(a: AddressDraft): Partial<Record<keyof AddressDraft, string>> {
  const e: Partial<Record<keyof AddressDraft, string>> = {};
  if (a.label.trim().length < 2) e.label = "Poné un nombre corto (ej.: Casa, Trabajo).";
  if (a.street.trim().length < 2) e.street = "Escribí la calle.";
  if (!a.number.trim()) e.number = "Escribí la altura.";
  if (!/^\d{4}$|^[A-Za-z]\d{4}[A-Za-z]{3}$/.test(a.postalCode.trim())) e.postalCode = "Código postal de 4 dígitos (ej.: 7600).";
  if (a.city.trim().length < 2) e.city = "Escribí la ciudad.";
  if (a.province.trim().length < 2) e.province = "Escribí la provincia.";
  return e;
}

export function normalizeAddresses(list: unknown): SavedAddress[] {
  if (!Array.isArray(list)) return [];
  return list.flatMap((a): SavedAddress[] => {
    if (!a || typeof a !== "object") return [];
    const x = a as Record<string, unknown>;
    const addr: SavedAddress = { id: text(x.id, 40), label: text(x.label, 30), street: text(x.street), number: text(x.number, 12), postalCode: text(x.postalCode, 8), city: text(x.city), province: text(x.province) };
    return addr.id && Object.keys(checkAddress(addr)).length === 0 ? [addr] : [];
  });
}

export const addressLine = (a: Omit<SavedAddress, "id" | "label">) => `${a.street} ${a.number}, ${a.city} (${a.postalCode}), ${a.province}`;
