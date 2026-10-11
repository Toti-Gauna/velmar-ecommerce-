import type { EmailTemplate } from "../../fixtures/emails";
import { needsOrder, type RenderedEmail } from "./render";

/** Lo que se lee entero en la bandeja de un celular: el asunto y el texto que va al lado. */
export const SUBJECT_MAX = 60;
export const PREHEADER_MAX = 90;

export type EmailStepId = "cuando" | "asunto" | "contenido" | "revisar";

export interface EmailCheck {
  id: "subject" | "preheader" | "button" | "order" | "active" | "saved";
  ok: boolean;
  label: string;
  /** Paso del editor donde se arregla. */
  step: EmailStepId;
}

/**
 * Qué revisar antes de dejar una plantilla andando (8.4.19, pedido de Ignacio). Nada bloquea el guardado: son avisos
 * para que el email se lea bien en el celular y lleve al cliente a algún lado. Se calcula con el email ya armado con los
 * datos de muestra (las fichas reemplazadas).
 */
export function emailChecks(template: Pick<EmailTemplate, "trigger" | "active" | "blocks">, email: RenderedEmail, dirty: boolean): EmailCheck[] {
  const subject = email.subject.trim().length;
  const preheader = email.preheader.trim().length;
  const hidden = template.trigger === "pet-birthday" ? template.blocks.filter(needsOrder).length : 0;
  const button = template.blocks.some((b) => b.type === "button");
  return [
    { id: "subject", step: "asunto", ok: subject > 0 && subject <= SUBJECT_MAX,
      label: !subject ? "Falta el asunto." : subject > SUBJECT_MAX ? `El asunto tiene ${subject} letras: en el celular se corta después de ${SUBJECT_MAX}.` : "El asunto se lee entero en el celular." },
    { id: "preheader", step: "asunto", ok: preheader > 0 && preheader <= PREHEADER_MAX,
      label: !preheader ? "Falta el texto de vista previa: sin él, el celular muestra el comienzo del email." : preheader > PREHEADER_MAX ? `El texto de vista previa tiene ${preheader} letras: se corta después de ${PREHEADER_MAX}.` : "Tiene texto de vista previa." },
    { id: "button", step: "contenido", ok: button,
      label: button ? "Tiene un botón para que el cliente siga." : "No tiene botón: sumá uno para que el cliente siga su pedido o vuelva a la tienda." },
    { id: "order", step: "contenido", ok: hidden === 0,
      label: hidden ? `${hidden === 1 ? "Un bloque del pedido no se va a ver" : `${hidden} bloques del pedido no se van a ver`}: este email no tiene pedido.` : "Todos los bloques se ven." },
    { id: "active", step: "cuando", ok: template.active, label: template.active ? "Activo: sale solo en su momento." : "Pausado: no sale hasta que lo actives." },
    { id: "saved", step: "revisar", ok: !dirty, label: dirty ? "Hay cambios sin guardar." : "Todo guardado." },
  ];
}

/** Un paso queda listo cuando sus avisos están bien ("Cuándo se envía" con un nombre, "Revisar" con todo guardado). */
export function stepsDone(name: string, checks: EmailCheck[]): Record<EmailStepId, boolean> {
  const ok = (step: EmailStepId) => checks.filter((c) => c.step === step).every((c) => c.ok);
  return { cuando: name.trim().length > 0, asunto: ok("asunto"), contenido: ok("contenido"), revisar: checks.every((c) => c.ok || c.id === "active") };
}
