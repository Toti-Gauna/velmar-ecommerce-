"use client";
import { closureFor, monthGrid, type WorkCalendar } from "@/demo/engine/workdays";
import { formatDay } from "@/lib/date";
import { cn } from "@/lib/cn";
import type { CalendarDnd } from "./dnd";
import { EntryChip } from "./EntryChip";
import type { Entry } from "./entries";

export const WEEKDAYS = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
const MAX_CHIPS = 3;

interface Props {
  cursor: string;
  today: string;
  days: Map<string, Entry[]>;
  cal: WorkCalendar;
  capacity: number;
  selected: string;
  dnd: CalendarDnd;
  onSelect: (day: string) => void;
  onOpen: (code: string) => void;
}

export function capacityText(used: number, capacity: number): string {
  return used >= capacity ? (used > capacity ? `${used}/${capacity} sobrecargado` : "Completo") : `${used}/${capacity}`;
}

/** Mes de lunes a domingo. En el celular cada día muestra puntos y se toca para ver la lista; en escritorio, los pedidos. */
export function MonthView({ cursor, today, days, cal, capacity, selected, dnd, onSelect, onOpen }: Props) {
  const month = cursor.slice(0, 7);
  return (
    <table className="w-full table-fixed border-separate border-spacing-1 sm:border-spacing-1.5">
      <caption className="sr-only">Entregas de {formatDay(cursor, "month")}. Arrastrá un pedido a otro día para reprogramarlo.</caption>
      <thead>
        <tr>{WEEKDAYS.map((d) => <th key={d} scope="col" className="pb-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted">{d}</th>)}</tr>
      </thead>
      <tbody>
        {monthGrid(cursor).map((week) => (
          <tr key={week[0]}>
            {week.map((day) => {
              const list = days.get(day) ?? [];
              const used = list.filter((e) => e.counts).length;
              const closed = closureFor(day, cal);
              const outside = day.slice(0, 7) !== month;
              const late = list.some((e) => e.late);
              const label = `${formatDay(day, "long")}${closed ? `, ${closed.reason}` : ""}: ${list.length} ${list.length === 1 ? "entrega" : "entregas"}${!closed ? `, ${capacityText(used, capacity).toLowerCase()} de capacidad` : ""}`;
              return (
                <td key={day} {...dnd.zone(day, !!closed)} data-day={day}
                  className={cn("relative h-16 rounded-xl align-top transition-colors sm:h-32",
                    dnd.over === day ? "bg-accent" : closed ? "bg-[repeating-linear-gradient(135deg,transparent_0_6px,rgb(28_32_22/0.04)_6px_12px)]" : outside ? "bg-surface/55" : "bg-surface",
                    !closed && "shadow-[var(--shadow-card)]", (selected === day || dnd.over === day) && "ring-2 ring-primary", dnd.dragging && closed && "cursor-not-allowed")}>
                  <button type="button" onClick={() => onSelect(day)} aria-label={label} aria-pressed={selected === day}
                    className="absolute inset-0 rounded-xl sm:static sm:inset-auto sm:flex sm:w-full sm:items-center sm:gap-1 sm:px-1.5 sm:pt-1.5 sm:text-left">
                    <span className={cn("absolute left-1.5 top-1.5 grid h-6 min-w-6 place-items-center rounded-full px-1 text-xs font-extrabold tabular-nums sm:static",
                      day === today ? "bg-night text-[#f6f1e8]" : closed || outside ? "text-muted" : "text-ink")}>{Number(day.slice(8))}</span>
                    {!closed && day >= today && list.length > 0 && (
                      <span className={cn("ml-auto hidden rounded-full px-1.5 text-[10px] font-extrabold tabular-nums sm:inline",
                        used >= capacity ? "bg-warning-soft text-warning" : "bg-bg text-muted")}>{capacityText(used, capacity)}</span>
                    )}
                  </button>
                  {closed?.closure && <p className="pointer-events-none absolute inset-x-1.5 bottom-1.5 hidden truncate text-[10px] font-bold text-muted sm:block">{closed.reason}</p>}
                  {/* Celular: puntos por pedido (decorativos: el botón del día lleva la cuenta). */}
                  {list.length > 0 && (
                    <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center gap-0.5 sm:hidden">
                      {list.slice(0, 4).map((e) => <span key={e.order.code} className={cn("h-1.5 w-1.5 rounded-full", e.late ? "bg-danger" : e.counts ? "bg-primary" : "bg-muted/50")} />)}
                    </span>
                  )}
                  {late && <span aria-hidden="true" className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger sm:hidden" />}
                  <ul className="hidden flex-col gap-1 px-1.5 pb-1.5 pt-1 sm:flex">
                    {list.slice(0, MAX_CHIPS).map((e) => (
                      <li key={e.order.code}><EntryChip entry={e} onOpen={onOpen} onDragStart={dnd.start} onDragEnd={dnd.end} /></li>
                    ))}
                    {list.length > MAX_CHIPS && (
                      <li><button type="button" onClick={() => onSelect(day)} className="text-[11px] font-bold text-primary underline">+{list.length - MAX_CHIPS} más</button></li>
                    )}
                  </ul>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
