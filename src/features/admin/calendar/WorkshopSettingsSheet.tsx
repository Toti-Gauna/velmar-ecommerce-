"use client";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { DateInput } from "@/components/atoms/DateInput";
import { Input } from "@/components/atoms/Field";
import { Switch } from "@/components/atoms/Switch";
import { Sheet } from "@/components/motion/Sheet";
import type { ClosureKind } from "@/demo/fixtures/workshop";
import { formatDay } from "@/lib/date";
import { useAdmin } from "@/stores/admin";
import { CommitNumberField } from "../NumberField";
import { useDemoSave } from "../useDemoSave";

const KIND_LABEL: Record<ClosureKind, string> = { feriado: "Feriado", "no-laborable": "No laborable", cierre: "Cierre del taller" };

/** Capacidad por día, días de trabajo y días cerrados (feriados cargados + vacaciones o ferias propias). */
export function WorkshopSettingsSheet({ open, onClose, today }: { open: boolean; onClose: () => void; today: string }) {
  const settings = useAdmin((s) => s.workshop.settings);
  const { saveWorkshopSettings, addClosure, removeClosure } = useAdmin();
  const save = useDemoSave();
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const upcoming = settings.closures.filter((c) => c.date >= today);
  const toggleDay = (wd: number, works: boolean) =>
    save(works ? "El taller trabaja ese día" : "Día sin taller", () => saveWorkshopSettings({ closedWeekdays: works ? settings.closedWeekdays.filter((d) => d !== wd) : [...settings.closedWeekdays, wd] }));
  return (
    <Sheet open={open} onClose={onClose} title="Capacidad y días del taller" side="right" className="max-w-lg bg-bg">
      <div className="flex h-full flex-col gap-5 overflow-y-auto p-6 pt-14">
        <h2 className="font-display text-3xl">Capacidad y días del taller</h2>
        <section className="flex flex-col gap-3 rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]">
          <CommitNumberField id="w-capacity" label="Pedidos que el taller termina por día" min={1} max={50} value={settings.dailyCapacity}
            onCommit={(n) => save(`Capacidad: ${n} por día`, () => saveWorkshopSettings({ dailyCapacity: n }))}
            hint="Cuando un día se llena, la tienda muestra la próxima fecha con lugar." />
          <Switch checked={!settings.closedWeekdays.includes(6)} onChange={(v) => toggleDay(6, v)} label="Trabajo los sábados" />
          <Switch checked={!settings.closedWeekdays.includes(0)} onChange={(v) => toggleDay(0, v)} label="Trabajo los domingos" />
        </section>
        <section aria-labelledby="w-closures" className="flex flex-col gap-3 rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]">
          <h3 id="w-closures" className="font-bold">Días cerrados</h3>
          <p className="text-xs text-muted">Feriados nacionales y días no laborables de 2026 y 2027 ya cargados (Ley 27.399 y Resolución 164/2025). Los días turísticos de 2027 se agregan cuando se publiquen.</p>
          <form className="grid grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-[10rem_minmax(0,1fr)_auto]"
            onSubmit={(e) => { e.preventDefault(); if (!date) return; const label = name.trim() || "Cierre del taller"; save(`${formatDay(date)}: ${label}`, () => addClosure({ date, name: label, kind: "cierre" })); setDate(""); setName(""); }}>
            <DateInput aria-label="Fecha del cierre" min={today} value={date} onChange={(e) => setDate(e.target.value)} />
            <Input aria-label="Motivo" placeholder="Vacaciones, feria…" value={name} onChange={(e) => setName(e.target.value)} />
            <Button type="submit" variant="secondary" disabled={!date}><Plus size={16} aria-hidden="true" /> Agregar</Button>
          </form>
          <ul className="flex flex-col divide-y divide-line">
            {upcoming.map((c) => (
              <li key={c.date} className="flex items-center gap-3 py-2 text-sm">
                <span className="w-28 shrink-0 font-bold tabular-nums first-letter:uppercase">{formatDay(c.date)}</span>
                <span className="min-w-0 flex-1"><span className="block truncate">{c.name}</span><span className="text-xs text-muted">{KIND_LABEL[c.kind]}{c.date.slice(0, 4) !== today.slice(0, 4) ? ` · ${c.date.slice(0, 4)}` : ""}</span></span>
                <button type="button" aria-label={`Quitar ${c.name} del ${formatDay(c.date)}`} onClick={() => save("Día cerrado quitado: el taller trabaja ese día", () => removeClosure(c.date))}
                  className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-danger-soft hover:text-danger"><Trash2 size={16} aria-hidden="true" /></button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Sheet>
  );
}
