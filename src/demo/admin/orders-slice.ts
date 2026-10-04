import { canTransition, STATUS_LABEL, type OrderStatus, type TransitionTrigger } from "../engine/orders";
import type { DemoOrder } from "@/stores/checkout";
import { auditEntry, type AdminData } from "./defaults";
import type { AdminOrder } from "./types";

type Set = (fn: (s: AdminData) => Partial<AdminData>) => void;

export interface OrdersActions {
  syncShopOrder: (order: DemoOrder) => void;
  receiveProof: (code: string, fileName: string) => boolean;
  approveProof: (code: string) => boolean;
  rejectProof: (code: string, reason: string) => boolean;
  confirmProvider: (code: string) => boolean;
  transition: (code: string, to: OrderStatus, note?: string) => boolean;
  addNote: (code: string, text: string) => void;
  setPromisedDate: (code: string, date: string) => void;
}

/** Aplica una transición válida (spec 5.2) y registra historial + auditoría. Devuelve false si no corresponde. */
function move(set: Set, code: string, to: OrderStatus, trigger: TransitionTrigger, patch: (o: AdminOrder) => Partial<AdminOrder>, action: string): boolean {
  let ok = false;
  set((s) => {
    const orders = s.orders.map((o) => {
      if (o.code !== code || !canTransition(o.status, to, { fulfillment: o.fulfillment, trigger, prevStatus: o.prevStatus })) return o;
      ok = true;
      const prevStatus = to === "IN_CLAIM" ? o.status : o.status === "IN_CLAIM" ? null : o.prevStatus;
      return { ...o, ...patch(o), status: to, prevStatus, log: [...o.log, { at: new Date().toISOString(), from: o.status, to, note: action }] };
    });
    return ok ? { orders, audit: [auditEntry(action, code), ...s.audit].slice(0, 80) } : {};
  });
  return ok;
}

export function createOrdersActions(set: Set): OrdersActions {
  return {
    syncShopOrder: (order) =>
      set((s) => {
        const existing = s.orders.find((o) => o.code === order.code);
        if (existing && (!existing.fromShop || existing.createdAt === order.createdAt)) return {};
        const created: AdminOrder = {
          code: order.code, createdAt: order.createdAt, customer: order.contact, userId: order.asAccount ? "u-demo" : null,
          status: "PENDING_PAYMENT", fulfillment: order.fulfillment, paymentMethod: order.paymentMethod, lines: order.lines,
          total: order.quote.total, notes: [], fromShop: true, log: [{ at: order.createdAt, from: null, to: "PENDING_PAYMENT", note: "Checkout de demostración" }],
        };
        return { orders: [created, ...s.orders.filter((o) => o.code !== order.code)] };
      }),
    receiveProof: (code, fileName) =>
      move(set, code, "PAYMENT_REVIEW", "proof-received", () => ({ proof: { fileName, receivedAt: new Date().toISOString(), status: "IN_REVIEW" } }), `Comprobante recibido (${fileName}): queda en revisión`),
    approveProof: (code) =>
      move(set, code, "PAID", "proof-approved", (o) => ({ proof: o.proof && { ...o.proof, status: "APPROVED" } }), "Comprobante aprobado tras verificar el ingreso (simulado)"),
    rejectProof: (code, reason) =>
      move(set, code, "PENDING_PAYMENT", "proof-rejected", (o) => ({ proof: o.proof && { ...o.proof, status: "REJECTED", rejectReason: reason } }), `Comprobante rechazado: ${reason}`),
    confirmProvider: (code) => move(set, code, "PAID", "provider-confirmed", () => ({}), "Confirmación de Mercado Pago simulada (en producción llega por webhook)"),
    transition: (code, to, note) => move(set, code, to, "admin", () => ({}), note?.trim() || `Estado cambiado a ${STATUS_LABEL[to]}`),
    addNote: (code, text) =>
      set((s) => ({ orders: s.orders.map((o) => (o.code === code ? { ...o, notes: [...o.notes, text] } : o)), audit: [auditEntry("Nota interna agregada", code), ...s.audit] })),
    setPromisedDate: (code, date) =>
      set((s) => ({ orders: s.orders.map((o) => (o.code === code ? { ...o, promisedDate: date } : o)), audit: [auditEntry(`Fecha comprometida: ${date}`, code), ...s.audit] })),
  };
}
