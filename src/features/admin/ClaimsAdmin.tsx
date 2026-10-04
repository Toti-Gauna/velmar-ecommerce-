"use client";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { ConfirmButton } from "@/components/molecules/ConfirmButton";
import { EmptyState } from "@/components/molecules/EmptyState";
import type { ClaimStatus, ClaimType } from "@/demo/admin/types";
import { formatDateTime } from "@/lib/date";
import { cn } from "@/lib/cn";
import { useAdmin } from "@/stores/admin";
import { AdminPageHeader } from "./AdminPageHeader";
import { useDemoSave } from "./useDemoSave";

const TYPE: Record<ClaimType, string> = { WITHDRAWAL: "Arrepentimiento", RETURN: "Devolución", COMPLAINT: "Reclamo" };
const STATUS: Record<ClaimStatus, { label: string; tone: "warning" | "brand" | "success" | "neutral" }> = {
  OPEN: { label: "Abierto", tone: "warning" }, IN_PROGRESS: { label: "En curso", tone: "brand" }, RESOLVED: { label: "Resuelto", tone: "success" }, REJECTED: { label: "Rechazado", tone: "neutral" },
};

export function ClaimsAdmin() {
  const claims = useAdmin((s) => s.claims);
  const resolveClaim = useAdmin((s) => s.resolveClaim);
  const save = useDemoSave();
  const [open, setOpen] = useState(true);
  const list = claims.filter((c) => (open ? c.status === "OPEN" || c.status === "IN_PROGRESS" : c.status === "RESOLVED" || c.status === "REJECTED"));
  return (
    <>
      <AdminPageHeader title="Reclamos">Arrepentimientos, devoluciones y reclamos de ejemplo. Los enviados desde el botón de arrepentimiento de la tienda demo aparecen acá.</AdminPageHeader>
      <div role="group" aria-label="Filtrar reclamos" className="mb-4 flex gap-2">
        {[true, false].map((v) => (
          <button key={String(v)} type="button" aria-pressed={open === v} onClick={() => setOpen(v)} className={cn("min-h-11 rounded-full border px-4 text-sm font-bold", open === v ? "border-primary bg-primary text-on-primary" : "border-line bg-surface")}>
            {v ? "Pendientes" : "Cerrados"}
          </button>
        ))}
      </div>
      {list.length === 0 && <EmptyState title={open ? "No hay reclamos pendientes" : "Todavía no hay reclamos cerrados"} />}
      <ul className="flex flex-col gap-3">
        {list.map((c) => (
          <li key={c.id} className="animate-fade-up flex flex-col gap-2 rounded-3xl bg-surface shadow-[var(--shadow-card)] p-4 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold">{c.code}</span><Badge>{TYPE[c.type]}</Badge><Badge tone={STATUS[c.status].tone}>{STATUS[c.status].label}</Badge>
              {c.fromShop && <span className="text-xs font-bold text-warning">desde la tienda demo</span>}
              <span className="ml-auto text-xs text-muted">{formatDateTime(c.createdAt)}</span>
            </div>
            <p>{c.name} · {c.email}{c.orderCode && <> · pedido {c.orderCode.startsWith("VEL-0") ? <Link href={`/admin-demo/pedidos/detalle/?codigo=${c.orderCode}`} className="font-semibold text-primary underline">{c.orderCode}</Link> : c.orderCode}</>}</p>
            <p className="rounded-xl bg-accent/50 p-2">{c.message}</p>
            {c.resolution && <p><strong>Resolución:</strong> {c.resolution}</p>}
            {open && (
              <div className="flex flex-wrap gap-2">
                {c.status === "OPEN" && <ConfirmButton size="sm" variant="secondary" title={`Tomar ${c.code}`} confirmLabel="Marcar en curso" description="El comprador vería que su reclamo está en curso." onConfirm={() => save("Reclamo en curso", () => resolveClaim(c.id, "IN_PROGRESS", ""))}>Marcar en curso</ConfirmButton>}
                <ConfirmButton size="sm" title={`Resolver ${c.code}`} confirmLabel="Resolver" reasonLabel="Resolución para el comprador" description="Se cierra con estado Resuelto y la respuesta queda registrada." onConfirm={(r) => save("Reclamo resuelto", () => resolveClaim(c.id, "RESOLVED", r))}>Resolver</ConfirmButton>
                <ConfirmButton size="sm" variant="danger" title={`Rechazar ${c.code}`} confirmLabel="Rechazar" reasonLabel="Motivo (por ejemplo, producto personalizado, art. 1116)" description="Se cierra con estado Rechazado y el motivo queda registrado." onConfirm={(r) => save("Reclamo rechazado", () => resolveClaim(c.id, "REJECTED", r))}>Rechazar</ConfirmButton>
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
