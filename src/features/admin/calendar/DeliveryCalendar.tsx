"use client";
import { CalendarArrowDown, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { toIcs } from "@/demo/admin/workshop/ics";
import { calendarOf, CAPACITY_STATUSES, pendingDeliveries } from "@/demo/engine/delivery";
import { STATUS_LABEL } from "@/demo/engine/orders";
import { addDays, addMonths, nextWorkday, weekOf } from "@/demo/engine/workdays";
import { DEMO_TODAY } from "@/demo/fixtures/admin-orders";
import { formatDay } from "@/lib/date";
import { cn } from "@/lib/cn";
import { useAdmin } from "@/stores/admin";
import { useToasts } from "@/stores/toast";
import { AdminPageHeader } from "../AdminPageHeader";
import { fulfillmentLabel } from "../OrderCard";
import { downloadBlob } from "../table/excel";
import { TabFilter } from "../table/TabFilter";
import { AgendaView, DayPanel } from "./DayList";
import { useCalendarDnd } from "./dnd";
import { LEGEND, STATUS_TONE } from "./EntryChip";
import { byDay, calendarEntries } from "./entries";
import { MonthView } from "./MonthView";
import { ScheduleSheet } from "./ScheduleSheet";
import { WeekView } from "./WeekView";
import { WorkshopSettingsSheet } from "./WorkshopSettingsSheet";

type View = "month" | "week" | "agenda";
const VIEWS: { id: View; label: string }[] = [{ id: "month", label: "Mes" }, { id: "week", label: "Semana" }, { id: "agenda", label: "Agenda" }];

/**
 * Calendario de entregas (pedido de Ignacio, fuera de la especificación): cada pedido en su fecha comprometida,
 * capacidad por día, feriados, atrasos y reprogramación arrastrando o desde la ficha de entrega.
 */
export function DeliveryCalendar() {
  const orders = useAdmin((s) => s.orders);
  const settings = useAdmin((s) => s.workshop.settings);
  const rescheduleOrder = useAdmin((s) => s.rescheduleOrder);
  const push = useToasts((s) => s.push);
  const today = DEMO_TODAY;
  const cal = calendarOf(settings);
  const [view, setView] = useState<View>("month");
  const [cursor, setCursor] = useState(today);
  const [selected, setSelected] = useState(() => nextWorkday(today, cal, true));
  const [open, setOpen] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const entries = calendarEntries(orders, today);
  const days = byDay(entries);
  const late = entries.filter((e) => e.late);
  const nextDays = pendingDeliveries(orders, today, addDays(today, 6));
  const twoWeeks = Array.from({ length: 14 }, (_, i) => addDays(today, i)).filter((d) => (days.get(d) ?? []).filter((e) => e.counts).length >= settings.dailyCapacity).length;

  const move = (code: string, day: string) => {
    const r = rescheduleOrder(code, day);
    if (!r.ok) {
      push({ tone: "error", title: "No se puede mover ahí", description: r.error });
      return;
    }
    setWarnings(r.warnings);
    push({ tone: r.warnings.length ? "info" : "success", title: `${code} pasa al ${formatDay(day)}`, description: r.warnings.length ? r.warnings.join(" ") : "Cambio guardado solo en esta demo (este navegador)." });
  };
  const dnd = useCalendarDnd(move);
  const openOrder = (code: string) => { setWarnings([]); setOpen(code); };
  const shift = (dir: -1 | 1) => setCursor((c) => (view === "month" ? addMonths(c, dir) : addDays(c, 7 * dir)));
  const title = view === "week" ? `${formatDay(weekOf(cursor)[0]!)} – ${formatDay(weekOf(cursor)[6]!)}` : formatDay(cursor, "month");
  const current = open ? orders.find((o) => o.code === open) ?? null : null;
  const currentEntry = entries.find((e) => e.order.code === open);

  const exportIcs = () => {
    const events = entries.filter((e) => CAPACITY_STATUSES.includes(e.order.status) || e.order.status === "READY").map((e) => ({
      uid: e.order.code, day: e.day,
      title: `${fulfillmentLabel(e.order.fulfillment)}: ${e.order.code} · ${e.order.customer.name}`,
      description: `${e.summary}\nEstado: ${STATUS_LABEL[e.order.status]}${e.order.address ? `\n${e.order.address}` : ""}\n(Panel demo de Velmar, datos ficticios)`,
    }));
    const name = `velmar-entregas-${new Date().toISOString().slice(0, 10)}.ics`;
    downloadBlob(new Blob([toIcs(events, new Date())], { type: "text/calendar;charset=utf-8" }), name);
    push({ tone: "success", title: `${events.length} entregas exportadas`, description: `Abrí ${name} con Google Calendar, Outlook o el calendario del celular.` });
  };

  const kpi = (label: string, value: number | string, tone?: string) => (
    <div className="rounded-2xl bg-surface p-3 shadow-[var(--shadow-card)]"><p className="text-xs font-bold text-muted">{label}</p><p className={cn("mt-0.5 text-2xl font-extrabold tabular-nums", tone)}>{value}</p></div>
  );

  return (
    <>
      <AdminPageHeader title="Calendario de entregas" actions={(
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => setSettingsOpen(true)}><SlidersHorizontal size={16} aria-hidden="true" /> Capacidad y feriados</Button>
          <Button variant="secondary" size="sm" onClick={exportIcs}><CalendarArrowDown size={16} aria-hidden="true" /> Exportar a Google Calendar</Button>
        </div>
      )}>Cada pedido en su fecha comprometida. Arrastralo a otro día o tocalo para reprogramar: los feriados y fines de semana no se pueden elegir y se avisa si un día queda sobrecargado.</AdminPageHeader>

      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {kpi("Entregas próximos 7 días", nextDays)}
        {kpi("Atrasados", late.length, late.length ? "text-danger" : undefined)}
        {kpi("Días completos (14 días)", twoWeeks, twoWeeks ? "text-warning" : undefined)}
        {kpi("Capacidad", `${settings.dailyCapacity} por día`)}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <TabFilter label="Vista del calendario" value={view} onChange={setView} tabs={VIEWS} />
        {view !== "agenda" && (
          <div className="flex items-center gap-1 sm:ml-auto">
            <button type="button" onClick={() => shift(-1)} aria-label={view === "month" ? "Mes anterior" : "Semana anterior"} className="grid h-10 w-10 place-items-center rounded-full bg-surface ring-1 ring-ink/10 hover:bg-accent"><ChevronLeft size={18} aria-hidden="true" /></button>
            <button type="button" onClick={() => setCursor(today)} className="h-10 rounded-full bg-surface px-4 text-sm font-bold ring-1 ring-ink/10 hover:bg-accent">Hoy</button>
            <button type="button" onClick={() => shift(1)} aria-label={view === "month" ? "Mes siguiente" : "Semana siguiente"} className="grid h-10 w-10 place-items-center rounded-full bg-surface ring-1 ring-ink/10 hover:bg-accent"><ChevronRight size={18} aria-hidden="true" /></button>
            <h2 aria-live="polite" className="font-display ml-2 min-w-0 text-2xl first-letter:uppercase">{title}</h2>
          </div>
        )}
      </div>

      {view === "month" && (
        <>
          <MonthView cursor={cursor} today={today} days={days} cal={cal} capacity={settings.dailyCapacity} selected={selected} dnd={dnd} onSelect={setSelected} onOpen={openOrder} />
          <DayPanel day={selected} list={days.get(selected) ?? []} cal={cal} capacity={settings.dailyCapacity} onOpen={openOrder} />
        </>
      )}
      {view === "week" && <WeekView cursor={cursor} today={today} days={days} cal={cal} capacity={settings.dailyCapacity} dnd={dnd} onOpen={openOrder} />}
      {view === "agenda" && <AgendaView entries={entries} today={today} cal={cal} capacity={settings.dailyCapacity} onOpen={openOrder} />}

      <ul aria-label="Referencias de color" className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-muted">
        {LEGEND.map((l) => <li key={l.status} className="flex items-center gap-1.5"><span aria-hidden="true" className={cn("h-3.5 w-5 rounded", STATUS_TONE[l.status])} />{l.label}</li>)}
        <li className="flex items-center gap-1.5"><span aria-hidden="true" className="h-3.5 w-5 rounded border border-danger bg-danger-soft" />Atrasado</li>
        <li className="flex items-center gap-1.5"><span aria-hidden="true" className="h-3.5 w-5 rounded bg-[repeating-linear-gradient(135deg,transparent_0_3px,rgb(28_32_22/0.15)_3px_6px)]" />Taller cerrado</li>
      </ul>

      <ScheduleSheet order={current} orders={orders} settings={settings} today={today} late={!!currentEntry?.late} movable={currentEntry?.movable ?? false}
        warnings={warnings} onMove={move} onClose={() => setOpen(null)} />
      <WorkshopSettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} today={today} />
    </>
  );
}
