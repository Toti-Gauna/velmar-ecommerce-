"use client";
import { ArrowRight, Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Switch } from "@/components/atoms/Switch";
import type { Mission } from "@/demo/types";
import { useAdmin } from "@/stores/admin";
import { AdminPageHeader } from "./AdminPageHeader";
import { emptyMission, MissionForm } from "./MissionForm";
import { MissionSimulator } from "./MissionSimulator";
import { useDemoSave } from "./useDemoSave";

export function MissionsAdmin() {
  const missions = useAdmin((s) => s.data.missions);
  const saveMission = useAdmin((s) => s.saveMission);
  const save = useDemoSave();
  const [editing, setEditing] = useState<Mission | null>(null);
  return (
    <>
      <AdminPageHeader title="Misiones y premios" actions={<Button onClick={() => setEditing(emptyMission())}><Plus size={18} aria-hidden="true" /> Nueva misión</Button>}>
        Solo cuentan pedidos pagados (en producción). Premios de un uso con vencimiento. Recomendado: hasta 3 activas.
      </AdminPageHeader>
      {editing && <div className="mb-4"><MissionForm key={editing.id} initial={editing} onDone={() => setEditing(null)} /></div>}
      <ul className="mb-8 grid gap-3 lg:grid-cols-2">
        {missions.map((m) => {
          const next = missions.find((x) => x.id === m.nextMissionId);
          return (
            <li key={m.id} className="flex flex-col gap-2 rounded-3xl bg-surface shadow-[var(--shadow-card)] p-4">
              <div className="flex flex-wrap items-center gap-2"><p className="font-extrabold">{m.title}</p>{m.active === false && <Badge tone="warning">Pausada</Badge>}</div>
              <p className="text-sm text-muted">{m.description || "Sin descripción"} · umbral {m.type === "SPEND_TOTAL" ? `$${m.threshold.toLocaleString("es-AR")}` : m.threshold} · premio: {m.reward}</p>
              {next && <p className="flex items-center gap-1 text-sm font-semibold">Encadenada <ArrowRight size={14} aria-hidden="true" /> {next.title}</p>}
              <p className="text-sm"><strong className="tabular-nums">{m.completedCount ?? 0}</strong> clientes la completaron <span className="text-muted">(demo)</span></p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                <Switch checked={m.active !== false} onChange={(v) => save(v ? "Misión activada" : "Misión pausada", () => saveMission({ ...m, active: v }))} label={m.active === false ? "Pausada" : "Activa"} />
                <Button variant="ghost" size="sm" onClick={() => setEditing(m)}>Editar</Button>
              </div>
            </li>
          );
        })}
      </ul>
      <section aria-labelledby="sim"><h2 id="sim" className="mb-3 text-lg font-extrabold">Simular progreso y premio</h2><MissionSimulator missions={missions} /></section>
    </>
  );
}
