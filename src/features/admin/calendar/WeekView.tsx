"use client";
import { closureFor, weekOf, type WorkCalendar } from "@/demo/engine/workdays";
import { formatDay } from "@/lib/date";
import { cn } from "@/lib/cn";
import type { CalendarDnd } from "./dnd";
import { EntryChip } from "./EntryChip";
import type { Entry } from "./entries";
import { capacityText } from "./MonthView";

interface Props {
  cursor: string;
  today: string;
  days: Map<string, Entry[]>;
  cal: WorkCalendar;
  capacity: number;
  dnd: CalendarDnd;
  onOpen: (code: string) => void;
}

/** Semana de lunes a domingo: columnas en escritorio, lista en el celular. */
export function WeekView({ cursor, today, days, cal, capacity, dnd, onOpen }: Props) {
  return (
    <ol aria-label={`Semana del ${formatDay(weekOf(cursor)[0]!, "long")}`} className="grid grid-cols-[minmax(0,1fr)] gap-2 lg:grid-cols-7">
      {weekOf(cursor).map((day) => {
        const list = days.get(day) ?? [];
        const used = list.filter((e) => e.counts).length;
        const closed = closureFor(day, cal);
        return (
          <li key={day} {...dnd.zone(day, !!closed)} data-day={day}
            className={cn("flex min-h-24 flex-col gap-2 rounded-2xl p-2.5 transition-colors lg:min-h-[22rem]",
              dnd.over === day ? "bg-accent ring-2 ring-primary" : closed ? "bg-[repeating-linear-gradient(135deg,transparent_0_6px,rgb(28_32_22/0.04)_6px_12px)]" : "bg-surface",
              !closed && "shadow-[var(--shadow-card)]")}>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <h3 className={cn("text-sm font-extrabold first-letter:uppercase", day === today && "text-primary")}>{formatDay(day)}</h3>
              {!closed && <span className={cn("ml-auto rounded-full px-2 text-[11px] font-extrabold tabular-nums", used >= capacity ? "bg-warning-soft text-warning" : "bg-bg text-muted")}>{capacityText(used, capacity)}</span>}
            </div>
            {closed && <p className="text-xs font-bold text-muted">{closed.reason}</p>}
            {list.length ? (
              <ul className="flex flex-col gap-1.5">{list.map((e) => <li key={e.order.code}><EntryChip entry={e} variant="card" onOpen={onOpen} onDragStart={dnd.start} onDragEnd={dnd.end} /></li>)}</ul>
            ) : !closed && <p className="text-xs text-muted">Sin entregas</p>}
          </li>
        );
      })}
    </ol>
  );
}
