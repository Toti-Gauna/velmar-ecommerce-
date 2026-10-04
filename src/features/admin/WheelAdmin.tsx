"use client";
import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Field";
import { Switch } from "@/components/atoms/Switch";
import { probability } from "@/demo/engine/wheel";
import type { WheelConfig } from "@/demo/fixtures/wheel";
import { WheelDisc } from "../club/WheelDisc";
import { useAdmin } from "@/stores/admin";
import { NumberField } from "./NumberField";
import { useDemoSave } from "./useDemoSave";

/** Configuración de la ruleta: segmentos, pesos (probabilidad calculada), vigencia del premio. */
export function WheelAdmin() {
  const current = useAdmin((s) => s.data.wheel);
  const saveWheel = useAdmin((s) => s.saveWheel);
  const save = useDemoSave();
  const [w, setW] = useState<WheelConfig>(current);
  const patch = (i: number, p: Partial<WheelConfig["segments"][number]>) => setW((x) => ({ ...x, segments: x.segments.map((s, k) => (k === i ? { ...s, ...p } : s)) }));
  return (
    <form className="grid gap-6 rounded-3xl bg-surface p-5 shadow-[var(--shadow-card)] lg:grid-cols-[220px_1fr]" onSubmit={(e) => { e.preventDefault(); save("Ruleta guardada", () => saveWheel(w)); }}>
      <div className="mx-auto w-52"><div className="aspect-square rounded-full border-4 border-brass bg-night p-1"><WheelDisc segments={w.segments} /></div></div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-6">
          <Switch checked={w.active} onChange={(active) => setW({ ...w, active })} label={w.active ? "Ruleta visible en la tienda" : "Ruleta pausada"} />
          <div className="w-44"><NumberField id="wheel-days" label="Vigencia del premio" suffix="días" min={1} value={w.validDays} onChange={(validDays) => setW({ ...w, validDays })} /></div>
        </div>
        <ul className="grid gap-2">
          {w.segments.map((s, i) => (
            <li key={s.id} className="grid grid-cols-[1fr_88px_auto] items-end gap-2 rounded-2xl bg-bg p-2 sm:grid-cols-[1fr_96px_96px_auto]">
              <label className="flex flex-col gap-1 text-xs font-bold">Premio<Input value={s.label} onChange={(e) => patch(i, { label: e.target.value })} className="min-h-10" /></label>
              <label className="flex flex-col gap-1 text-xs font-bold">Peso<Input type="number" min={0} value={s.weight} onChange={(e) => patch(i, { weight: Math.max(0, Math.round(Number(e.target.value))) })} className="min-h-10" /></label>
              <span className="hidden pb-2.5 text-sm font-bold tabular-nums sm:block">{Math.round(probability(w, s) * 100)}%</span>
              <input type="checkbox" aria-label={`Activar ${s.label}`} checked={s.active} onChange={(e) => patch(i, { active: e.target.checked })} className="mb-3 h-5 w-5 accent-[var(--color-primary)]" />
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted">Cada premio genera un cupón de un uso con vencimiento. En producción el sorteo se hace en el servidor (un giro por cuenta).</p>
        <Button type="submit" size="sm" className="self-start">Guardar ruleta</Button>
      </div>
    </form>
  );
}
