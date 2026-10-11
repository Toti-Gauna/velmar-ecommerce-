import type { PaymentMethod } from "../types";

/** Todos los medios, en el orden en que los ve el comprador. */
export const PAYMENT_METHODS: PaymentMethod[] = ["CARD", "CHECKOUT_PRO", "BANK_TRANSFER", "QR_MANUAL"];

/** Los que había antes de la tarjeta propia (8.4.22): los ajustes guardados entonces no la conocían. */
const BEFORE_CARD: PaymentMethod[] = ["CHECKOUT_PRO", "BANK_TRANSFER", "QR_MANUAL"];

/** Nombre corto para el panel (listas, filtros y fichas). */
export const PAYMENT_LABEL: Record<PaymentMethod, string> = { CARD: "Tarjeta", CHECKOUT_PRO: "Mercado Pago", BANK_TRANSFER: "Transferencia", QR_MANUAL: "QR" };

/** Transferencia y QR: el comprador sube el comprobante y Velmar lo aprueba a mano (simulado). */
export const isManualPayment = (m: PaymentMethod) => m === "BANK_TRANSFER" || m === "QR_MANUAL";

/**
 * Tarjeta y Mercado Pago los confirma el proveedor (en producción, por webhook verificado; la tarjeta también la
 * procesa Mercado Pago, tokenizada). En la demo se simula desde el pedido.
 */
export const isProviderPayment = (m: PaymentMethod) => !isManualPayment(m);

/**
 * Migración sin pérdida (8.4.22): a los ajustes guardados antes de que existiera un medio se le suma activo una sola
 * vez (si viene activo por defecto); si después el dueño lo apaga, queda apagado. Un medio desconocido se descarta.
 */
export function withKnownMethods<T extends { enabledMethods: PaymentMethod[]; knownMethods?: PaymentMethod[] }>(settings: T, defaults: PaymentMethod[]): T & { knownMethods: PaymentMethod[] } {
  const known = Array.isArray(settings.knownMethods) ? settings.knownMethods : BEFORE_CARD;
  const enabled = (Array.isArray(settings.enabledMethods) ? settings.enabledMethods : defaults).filter((m) => PAYMENT_METHODS.includes(m));
  const added = defaults.filter((m) => !known.includes(m) && !enabled.includes(m));
  return { ...settings, enabledMethods: [...enabled, ...added], knownMethods: PAYMENT_METHODS };
}
