"use client";
import Link from "next/link";
import { AlarmClock, ArrowLeft, ArrowRight, CalendarDays, MessageSquareText, TriangleAlert } from "lucide-react";
import { useState, type DragEvent } from "react";
import { LineThumb } from "@/components/organisms/LineThumb";
import { isLate } from "@/demo/admin/order-groups";
import type { AdminOrder } from "@/demo/admin/types";
import { materialRows } from "@/demo/admin/workshop/materials";
import { columnOf, nextColumn, PRODUCTION_COLUMNS, productionMove, type ProductionColumn } from "@/demo/admin/workshop/production";
import { getProduct } from "@/demo/engine/catalog";
import { calendarOf } from "@/demo/engine/delivery";
import { demoData } from "@/demo/engine/source";
import { workdaysBetween } from "@/demo/engine/workdays";
import { DEMO_TODAY } from "@/demo/fixtures/admin-orders";
import { formatDay } from "@/lib/date";
import { cn } from "@/lib/cn";
import { useAdmin } from "@/stores/admin";
import { useToasts } from "@/stores/toast";
import { AdminPageHeader } from "../AdminPageHeader";
import { TabFilter } from "../table/TabFilter";

const KIND = { TEXT: "Texto", PHOTO: "Foto", PHOTO_REFERENCE: "Foto de referencia" };

function DueChip({ order, today }: { order: AdminOrder; today: string }) {
  const settings = useAdmin((s) => s.workshop.settings);
  if (!order.promisedDate) return null;
  const late = isLate(order, today);
  const left = workdaysBetween(today, order.promisedDate, calendarOf(settings));
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold", late ? "bg-danger-soft text-danger" : left <= 1 && order.status !== "READY" ? "bg-warning-soft text-warning" : "bg-bg text-muted")}>
      {late ? <AlarmClock size={12} aria-hidden="true" /> : <CalendarDays size={12} aria-hidden="true" />}
      {late ? `Atrasado · era el ${formatDay(order.promisedDate)}` : `${order.status === "READY" ? "Entrega" : "Para el"} ${formatDay(order.promisedDate)}`}
    </span>
  );
}

function Card({ order, column, today, onMove, onDragStart }: { order: AdminOrder; column: ProductionColumn; today: string; onMove: (code: string, to: ProductionColumn) => void; onDragStart: (code: string) => void }) {
  const next = nextColumn(column);
  const start = (e: DragEvent) => { e.dataTransfer.setData("text/plain", order.code); e.dataTransfer.effectAllowed = "move"; onDragStart(order.code); };
  return (
    <article draggable={column !== "ready"} onDragStart={column !== "ready" ? start : undefined} aria-label={`Pedido ${order.code}`}
      className={cn("flex flex-col gap-3 rounded-3xl bg-surface p-3.5 shadow-[var(--shadow-card)] ring-1", isLate(order, today) ? "ring-danger" : "ring-ink/[0.05]", column !== "ready" && "cursor-grab active:cursor-grabbing")}>
      <header className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <Link href={`/admin-demo/pedidos/detalle/?codigo=${order.code}`} className="font-extrabold tabular-nums hover:text-primary hover:underline">{order.code}</Link>
        <span className="truncate text-sm text-muted">{order.customer.name}</span>
        <span className="w-full"><DueChip order={order} today={today} /></span>
      </header>
      <ul className="flex flex-col gap-2">
        {order.lines.map((l) => {
          const p = getProduct(l.productSlug);
          const v = p?.variants.find((x) => x.id === l.variantId);
          const per = l.personalization;
          return (
            <li key={l.id} className="flex gap-3">
              {p && <div className="w-16 shrink-0"><LineThumb art={p.art} tint={v?.colorHex} name={p.name} personalization={per} zone={demoData().textZones[p.art]} /></div>}
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-bold">{l.quantity} × {p?.name ?? l.productSlug}</p>
                <p className="text-muted">{v?.label}</p>
                {per && <p className="mt-0.5 text-xs font-semibold text-success">{KIND[per.kind]} aprobada{per.text ? `: “${per.text}”` : ""}{per.font ? ` · ${per.font}` : ""}{per.colorName ? ` · ${per.colorName}` : ""}</p>}
                {per?.notes && <p className="text-xs text-muted">{per.notes}</p>}
              </div>
            </li>
          );
        })}
      </ul>
      {order.notes.length > 0 && <p className="flex gap-1.5 rounded-2xl bg-bg p-2 text-xs text-muted"><MessageSquareText size={14} aria-hidden="true" className="mt-px shrink-0" />{order.notes.at(-1)}</p>}
      <div className="flex flex-wrap gap-2">
        {column === "finishing" && (
          <button type="button" onClick={() => onMove(order.code, "machine")} aria-label={`Volver ${order.code} a En máquina`} className="inline-flex h-9 items-center gap-1 rounded-full border border-ink/15 px-3 text-xs font-bold hover:bg-accent/50">
            <ArrowLeft size={14} aria-hidden="true" /> Volver a máquina
          </button>
        )}
        {next && (
          <button type="button" onClick={() => onMove(order.code, next)} aria-label={`Pasar ${order.code} a ${PRODUCTION_COLUMNS.find((c) => c.id === next)!.label}`}
            className="ml-auto inline-flex h-9 items-center gap-1 rounded-full bg-primary px-3.5 text-xs font-bold text-on-primary hover:bg-primary-hover">
            {PRODUCTION_COLUMNS.find((c) => c.id === next)!.label} <ArrowRight size={14} aria-hidden="true" />
          </button>
        )}
      </div>
    </article>
  );
}

/** Cola de producción (pedido de Ignacio, fuera de la especificación): tablero por etapa con la vista previa aprobada. */
export function ProductionBoard() {
  const orders = useAdmin((s) => s.orders);
  const workshop = useAdmin((s) => s.workshop);
  const moveProduction = useAdmin((s) => s.moveProduction);
  const push = useToasts((s) => s.push);
  const today = DEMO_TODAY;
  const [tab, setTab] = useState<ProductionColumn>("queue");
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<ProductionColumn | null>(null);
  const board = PRODUCTION_COLUMNS.map((c) => ({
    ...c,
    orders: orders.filter((o) => columnOf(o) === c.id).sort((a, b) => (a.promisedDate ?? "9999").localeCompare(b.promisedDate ?? "9999")),
  }));
  const short = materialRows(workshop.materials, orders, workshop.recipes).filter((m) => m.state === "short");

  const move = (code: string, to: ProductionColumn) => {
    const from = orders.find((o) => o.code === code);
    const error = moveProduction(code, to);
    const label = PRODUCTION_COLUMNS.find((c) => c.id === to)!.label;
    if (error) push({ tone: "error", title: "No se puede mover", description: error });
    else push({ tone: "success", title: `${code} pasó a “${label}”`, description: from?.status === "PAID" ? "Se descontaron sus insumos del stock. Cambio guardado solo en esta demo." : "Cambio guardado solo en esta demo (este navegador)." });
  };
  const zone = (col: ProductionColumn) => ({
    onDragOver: (e: DragEvent) => {
      if (!dragging) return;
      const order = orders.find((o) => o.code === dragging);
      if (!order || !productionMove(order, col).ok) return;
      e.preventDefault();
      if (over !== col) setOver(col);
    },
    onDragLeave: (e: DragEvent) => { if (over === col && !e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(null); },
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      const code = e.dataTransfer.getData("text/plain") || dragging;
      setDragging(null); setOver(null);
      if (code) move(code, col);
    },
  });

  return (
    <>
      <AdminPageHeader title="Cola de producción">Los pedidos pagados en orden de entrega, con la vista previa que aprobó el cliente. Arrastrá la tarjeta o usá el botón para pasarla de etapa: al entrar a producción se descuentan los insumos.</AdminPageHeader>
      {short.length > 0 && (
        <p role="status" className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl bg-danger-soft p-3 text-sm font-bold text-danger">
          <TriangleAlert size={17} aria-hidden="true" /> No alcanzan {short.map((m) => m.name.toLowerCase()).join(", ")} para los pedidos en cola.
          <Link href="/admin-demo/insumos/" className="underline">Ver insumos</Link>
        </p>
      )}
      <div className="mb-4 lg:hidden">
        <TabFilter label="Etapa" value={tab} onChange={setTab} tabs={board.map((c) => ({ id: c.id, label: c.label, count: c.orders.length }))} />
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-4" onDragEnd={() => { setDragging(null); setOver(null); }}>
        {board.map((c) => (
          <section key={c.id} aria-labelledby={`col-${c.id}`} {...zone(c.id)} data-column={c.id}
            className={cn("flex-col gap-3 rounded-[1.75rem] p-3 transition-colors lg:flex lg:min-h-[28rem]", tab === c.id ? "flex" : "hidden", over === c.id ? "bg-accent ring-2 ring-primary" : "bg-bg ring-1 ring-ink/[0.06]")}>
            <header className="px-1">
              <span className="flex items-center gap-2">
                <h2 id={`col-${c.id}`} className="whitespace-nowrap font-extrabold">{c.label}</h2>
                <span className="grid h-6 min-w-6 place-items-center rounded-full bg-surface px-1.5 text-xs font-extrabold tabular-nums">{c.orders.length}</span>
              </span>
              <span className="block truncate text-xs text-muted">{c.hint}</span>
            </header>
            {c.orders.length ? c.orders.map((o) => <Card key={o.code} order={o} column={c.id} today={today} onMove={move} onDragStart={setDragging} />)
              : <p className="rounded-2xl border border-dashed border-ink/15 p-4 text-center text-sm text-muted">Sin pedidos en esta etapa</p>}
          </section>
        ))}
      </div>
    </>
  );
}
