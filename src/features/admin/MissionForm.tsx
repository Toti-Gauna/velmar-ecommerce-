"use client";
import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Field";
import { Select } from "@/components/atoms/Select";
import { Switch } from "@/components/atoms/Switch";
import type { Mission } from "@/demo/types";
import { useAdmin } from "@/stores/admin";
import { NumberField } from "./NumberField";
import { useDemoSave } from "./useDemoSave";

const TYPES: { value: Mission["type"]; label: string; unit: string }[] = [
  { value: "UNITS_COUNT", label: "Cantidad de productos", unit: "unidades" },
  { value: "ORDERS_COUNT", label: "Cantidad de pedidos", unit: "pedidos" },
  { value: "SPEND_TOTAL", label: "Monto acumulado", unit: "ARS" },
];

export const emptyMission = (): Mission => ({ id: `m-${Date.now().toString(36)}`, title: "", description: "", type: "UNITS_COUNT", threshold: 3, reward: "", active: true, nextMissionId: null, completedCount: 0 });

/** Alta/edición de misión. Solo misiones de compra: sin referidos (fuera de alcance). */
export function MissionForm({ initial, onDone }: { initial: Mission; onDone: () => void }) {
  const missions = useAdmin((s) => s.data.missions);
  const saveMission = useAdmin((s) => s.saveMission);
  const save = useDemoSave();
  const [m, setM] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const set = (p: Partial<Mission>) => setM((x) => ({ ...x, ...p }));
  return (
    <form noValidate className="flex flex-col gap-3 rounded-2xl border-2 border-primary bg-surface p-4" onSubmit={(e) => {
      e.preventDefault();
      if (m.title.trim().length < 3 || m.reward.trim().length < 3 || m.threshold < 1) return setError("Completá título, premio y un umbral mayor a 0.");
      save("Misión guardada", () => saveMission({ ...m, title: m.title.trim(), reward: m.reward.trim() }));
      onDone();
    }}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-bold">Título<Input value={m.title} onChange={(e) => set({ title: e.target.value })} placeholder="Comprá 3 productos" /></label>
        <label className="flex flex-col gap-1 text-sm font-bold">Premio<Input value={m.reward} onChange={(e) => set({ reward: e.target.value })} placeholder="Llavero de regalo" /></label>
        <label className="flex flex-col gap-1 text-sm font-bold">Tipo
          <Select value={m.type} onChange={(e) => set({ type: e.target.value as Mission["type"] })}>{TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</Select>
        </label>
        <NumberField id={`${m.id}-th`} label="Umbral" suffix={TYPES.find((t) => t.value === m.type)?.unit} value={m.threshold} min={1} onChange={(n) => set({ threshold: n })} />
        <label className="flex flex-col gap-1 text-sm font-bold">Descripción<Input value={m.description} onChange={(e) => set({ description: e.target.value })} placeholder="En uno o varios pedidos pagados." /></label>
        <label className="flex flex-col gap-1 text-sm font-bold">Encadenar con (el excedente pasa a esa misión)
          <Select value={m.nextMissionId ?? ""} onChange={(e) => set({ nextMissionId: e.target.value || null })}>
            <option value="">Sin encadenar</option>
            {missions.filter((x) => x.id !== m.id).map((x) => <option key={x.id} value={x.id}>{x.title}</option>)}
          </Select>
        </label>
      </div>
      <Switch checked={m.active !== false} onChange={(v) => set({ active: v })} label="Activa en la tienda" />
      {error && <p role="alert" className="text-sm font-semibold text-danger">{error}</p>}
      <div className="flex gap-2"><Button type="submit" size="sm">Guardar misión</Button><Button variant="ghost" size="sm" onClick={onDone}>Cancelar</Button></div>
    </form>
  );
}
