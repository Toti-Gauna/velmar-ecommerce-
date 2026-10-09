import type { OrderStatus } from "../../engine/orders";
import type { EmailTemplate, EmailTrigger } from "../../fixtures/emails";
import type { AdminOrder } from "../types";
import { contextForOrder, renderEmail, type EmailContext, type RenderedEmail } from "./render";

/** Email "enviado" en la demo: queda en la bandeja de salida del panel con el contenido tal como salió. */
export interface OutboxEmail {
  id: string;
  at: string;
  to: string;
  name: string;
  templateId: string;
  templateName: string;
  trigger: EmailTrigger;
  orderCode?: string;
  /** Envío de prueba desde el editor (no lo dispara un evento). */
  test?: boolean;
  email: RenderedEmail;
}

export const OUTBOX_LIMIT = 60;

/** Qué disparadores corresponden a un cambio de estado. Volver de un reclamo no reenvía "en producción". */
export function triggersForTransition(from: OrderStatus, to: OrderStatus): EmailTrigger[] {
  if (to === "PAID") return ["payment-approved"];
  if (to === "IN_PRODUCTION" && from === "PAID") return ["in-production"];
  if (to === "READY" && from === "IN_PRODUCTION") return ["ready"];
  if (to === "SHIPPED" && from === "READY") return ["shipped"];
  return [];
}

export function triggersForNewOrder(order: Pick<AdminOrder, "lines">): EmailTrigger[] {
  return order.lines.some((l) => l.personalization) ? ["order-created", "custom-received"] : ["order-created"];
}

let seq = 0;
const mailId = () => `mail-${Date.now().toString(36)}-${++seq}`;

/** Un email por plantilla activa de cada disparador. */
export function composeEmails(templates: EmailTemplate[], triggers: EmailTrigger[], ctx: EmailContext, at: string, orderCode?: string): OutboxEmail[] {
  return triggers.flatMap((trigger) =>
    templates.filter((t) => t.trigger === trigger && t.active).map((t) => ({
      id: mailId(), at, to: ctx.email, name: ctx.customerName, templateId: t.id, templateName: t.name, trigger, orderCode, email: renderEmail(t, ctx),
    })));
}

export function emailsForOrder(templates: EmailTemplate[], triggers: EmailTrigger[], order: AdminOrder, at: string): OutboxEmail[] {
  return composeEmails(templates, triggers, contextForOrder(order), at, order.code);
}

/** Suma a la bandeja (lo más nuevo primero) sin pasar el límite. */
export function pushOutbox(outbox: OutboxEmail[], emails: OutboxEmail[]): OutboxEmail[] {
  return emails.length ? [...emails, ...outbox].slice(0, OUTBOX_LIMIT) : outbox;
}
