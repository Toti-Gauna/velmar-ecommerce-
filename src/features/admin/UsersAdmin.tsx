"use client";
import Link from "next/link";
import { ShieldOff } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Input } from "@/components/atoms/Field";
import { ConfirmButton } from "@/components/molecules/ConfirmButton";
import { EmptyState } from "@/components/molecules/EmptyState";
import { normalize } from "@/demo/engine/search";
import { formatDate } from "@/lib/date";
import { formatARS } from "@/lib/money";
import { useAdmin } from "@/stores/admin";
import { AdminPageHeader } from "./AdminPageHeader";
import { useDemoSave } from "./useDemoSave";

export function UsersAdmin() {
  const users = useAdmin((s) => s.users);
  const missions = useAdmin((s) => s.data.missions);
  const toggleUserBlocked = useAdmin((s) => s.toggleUserBlocked);
  const save = useDemoSave();
  const [q, setQ] = useState("");
  const list = users.filter((u) => !q || normalize(`${u.name} ${u.email}`).includes(normalize(q)));
  return (
    <>
      <AdminPageHeader title="Usuarios">Perfiles ficticios. El panel nunca muestra contraseñas ni datos de pago (tarjetas las procesa Mercado Pago).</AdminPageHeader>
      <label className="mb-4 flex max-w-md flex-col gap-1 text-sm font-bold">Buscar por nombre o email<Input type="search" value={q} onChange={(e) => setQ(e.target.value)} /></label>
      {list.length === 0 && <EmptyState title="Ningún usuario coincide" />}
      <ul className="grid gap-3 lg:grid-cols-2">
        {list.map((u) => (
          <li key={u.id}>
            <details className="group rounded-2xl border border-line bg-surface">
              <summary className="flex min-h-14 cursor-pointer list-none flex-wrap items-center gap-2 p-4 [&::-webkit-details-marker]:hidden">
                <span className="font-extrabold">{u.name}</span>
                {u.blocked && <Badge tone="danger"><ShieldOff size={12} aria-hidden="true" /> Bloqueado (visual)</Badge>}
                <span className="w-full text-sm text-muted">{u.email} · {u.orderCodes.length} pedidos · {formatARS(u.totalSpent)} (demo)</span>
              </summary>
              <div className="flex flex-col gap-3 border-t border-line p-4 text-sm">
                <p className="text-muted">Cliente desde {formatDate(u.createdAt)}</p>
                <div><p className="font-bold">Compras</p>
                  {u.orderCodes.length ? <ul className="flex flex-wrap gap-2">{u.orderCodes.map((c) => <li key={c}><Link href={`/admin-demo/pedidos/detalle/?codigo=${c}`} className="font-semibold text-primary underline">{c}</Link></li>)}</ul> : <p className="text-muted">Sin compras.</p>}
                </div>
                <div><p className="font-bold">Misiones</p>
                  <ul>{missions.map((m) => <li key={m.id}>{m.title}: {Math.min(u.missionProgress[m.id] ?? 0, m.threshold).toLocaleString("es-AR")} / {m.threshold.toLocaleString("es-AR")}</li>)}</ul>
                </div>
                <div><p className="font-bold">Premios</p>
                  {u.rewards.length ? <ul>{u.rewards.map((r) => <li key={r.title}>{r.title} · vence {formatDate(r.expiresAt)} · {r.used ? "usado" : "disponible"}</li>)}</ul> : <p className="text-muted">Sin premios.</p>}
                </div>
                <ConfirmButton size="sm" variant={u.blocked ? "secondary" : "danger"} className="self-start"
                  title={u.blocked ? `Desbloquear a ${u.name}` : `Bloquear a ${u.name}`} confirmLabel={u.blocked ? "Desbloquear" : "Bloquear"}
                  description="En la demo el bloqueo es solo visual. En producción impide iniciar sesión y queda en la auditoría."
                  onConfirm={() => save(u.blocked ? "Usuario desbloqueado (visual)" : "Usuario bloqueado (visual)", () => toggleUserBlocked(u.id))}>
                  {u.blocked ? "Desbloquear" : "Bloquear"}
                </ConfirmButton>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </>
  );
}
