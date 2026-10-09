"use client";
import { AlarmClock, GripVertical } from "lucide-react";
import type { DragEvent } from "react";
import { STATUS_LABEL, type OrderStatus } from "@/demo/engine/orders";
import { cn } from "@/lib/cn";
import { firstName, type Entry } from "./entries";

/** Color por estado (siempre acompañado del texto del estado para lectores de pantalla y la leyenda). */
export const STATUS_TONE: Partial<Record<OrderStatus, string>> = {
  PENDING_PAYMENT: "border border-dashed border-ink/30 bg-surface text-ink",
  PAYMENT_REVIEW: "border border-dashed border-warning bg-warning-soft text-ink",
  PAID: "border border-success/40 bg-success-soft text-ink",
  IN_PRODUCTION: "border border-primary bg-primary text-on-primary",
  READY: "border border-wood/50 bg-accent text-ink",
  SHIPPED: "border border-line bg-bg text-muted",
  DELIVERED: "border border-line bg-bg text-muted",
};

export const LEGEND: { status: OrderStatus; label: string }[] = [
  { status: "PENDING_PAYMENT", label: "Sin cobrar" },
  { status: "PAID", label: "Pagado, por fabricar" },
  { status: "IN_PRODUCTION", label: "En producción" },
  { status: "READY", label: "Listo para entregar" },
  { status: "DELIVERED", label: "Entregado" },
];

export function entryLabel(e: Entry): string {
  return `${e.order.code}, ${e.order.customer.name}, ${STATUS_LABEL[e.order.status]}${e.late ? ", atrasado" : ""}`;
}

interface Props {
  entry: Entry;
  onOpen: (code: string) => void;
  onDragStart?: (code: string) => void;
  onDragEnd?: () => void;
  /** "compact": una línea (mes); "card": con productos (semana y agenda). */
  variant?: "compact" | "card";
}

/** Pedido en el calendario: abre la ficha de entrega al tocarlo y se arrastra a otro día. */
export function EntryChip({ entry: e, onOpen, onDragStart, onDragEnd, variant = "compact" }: Props) {
  const draggable = e.movable && !!onDragStart;
  const start = (ev: DragEvent) => {
    ev.dataTransfer.setData("text/plain", e.order.code);
    ev.dataTransfer.effectAllowed = "move";
    onDragStart?.(e.order.code);
  };
  return (
    <button type="button" onClick={() => onOpen(e.order.code)} draggable={draggable} onDragStart={draggable ? start : undefined} onDragEnd={onDragEnd}
      aria-label={entryLabel(e)} data-code={e.order.code}
      className={cn("group flex w-full min-w-0 items-center gap-1 rounded-lg text-left font-bold transition-[transform,box-shadow] hover:-translate-y-px hover:shadow-[var(--shadow-card)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary",
        e.late ? "border border-danger bg-danger-soft text-danger" : STATUS_TONE[e.order.status],
        variant === "compact" ? "h-7 px-1.5 text-[11px]" : "flex-col items-stretch gap-0.5 px-2.5 py-2 text-xs",
        draggable && "cursor-grab active:cursor-grabbing")}>
      {variant === "compact" ? (
        <>
          {e.late ? <AlarmClock size={12} aria-hidden="true" className="shrink-0" /> : draggable && <GripVertical size={11} aria-hidden="true" className="shrink-0 opacity-50" />}
          <span className="truncate">{e.order.code.slice(-3)} · {firstName(e.order.customer.name)}</span>
        </>
      ) : (
        <>
          <span className="flex items-center gap-1 whitespace-nowrap tabular-nums">
            {e.late && <AlarmClock size={13} aria-hidden="true" />}
            {e.order.code}
          </span>
          <span className="truncate text-[11px] font-semibold opacity-80">{e.late ? "Atrasado" : STATUS_LABEL[e.order.status]}</span>
          <span className="truncate font-semibold">{e.order.customer.name}</span>
          <span className="line-clamp-2 font-medium opacity-80">{e.summary}</span>
        </>
      )}
    </button>
  );
}
