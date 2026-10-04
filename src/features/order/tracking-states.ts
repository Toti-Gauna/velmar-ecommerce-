import type { TimelineStep } from "@/components/molecules/StatusTimeline";

/** Estados de MUESTRA para la línea de tiempo (spec 5.2). */
const FLOW = [
  { label: "Pedido recibido", description: "Reservamos tu pedido." },
  { label: "Pago en revisión", description: "Velmar verifica el ingreso de la transferencia o QR." },
  { label: "Pagado", description: "Pago confirmado." },
  { label: "En producción", description: "Tu pieza se está fabricando con la vista previa que aprobaste." },
  { label: "Listo", description: "Terminado y embalado." },
  { label: "Enviado", description: "En camino con el cadete o el correo." },
  { label: "Entregado", description: "¡Que lo disfrutes!" },
];

export const SAMPLE_STATES = [
  { id: "pending", label: "Esperando comprobante", current: 0 },
  { id: "production", label: "En producción", current: 3 },
  { id: "shipped", label: "Enviado", current: 5 },
] as const;

export type SampleStateId = (typeof SAMPLE_STATES)[number]["id"];

const DATES = ["2 oct, 10:14", "2 oct, 18:40", "3 oct, 09:02", "3 oct, 11:30", "", "", ""];

export function timelineFor(current: number): TimelineStep[] {
  return FLOW.map((s, i) => ({ ...s, state: i < current ? "done" : i === current ? "current" : "pending", date: i <= current ? DATES[i] || undefined : undefined }));
}
