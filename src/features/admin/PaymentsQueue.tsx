"use client";
import Link from "next/link";
import { useState } from "react";
import { EmptyState } from "@/components/molecules/EmptyState";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { formatDateTime } from "@/lib/date";
import { cn } from "@/lib/cn";
import { useAdmin } from "@/stores/admin";
import { AdminPageHeader } from "./AdminPageHeader";
import { paymentLabel } from "./OrderCard";
import { ProofReview } from "./ProofReview";

const TABS = [
  { id: "review", label: "Por revisar" },
  { id: "waiting", label: "Esperando comprobante" },
  { id: "done", label: "Resueltos" },
] as const;

export function PaymentsQueue() {
  const orders = useAdmin((s) => s.orders);
  const audit = useAdmin((s) => s.audit);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("review");
  const manual = orders.filter((o) => o.paymentMethod !== "CHECKOUT_PRO");
  const groups = {
    review: manual.filter((o) => o.status === "PAYMENT_REVIEW"),
    waiting: manual.filter((o) => o.status === "PENDING_PAYMENT"),
    done: manual.filter((o) => o.proof && o.proof.status !== "IN_REVIEW"),
  };
  const list = groups[tab];
  return (
    <>
      <AdminPageHeader title="Pagos manuales">Transferencias y QR estático. Aprobar o rechazar cambia solo el estado de esta demo; subir un comprobante nunca marca el pedido como pagado.</AdminPageHeader>
      <div role="group" aria-label="Filtrar cola de pagos" className="mb-4 flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t.id} type="button" aria-pressed={tab === t.id} onClick={() => setTab(t.id)}
            className={cn("min-h-11 shrink-0 rounded-full border px-4 text-sm font-bold", tab === t.id ? "border-primary bg-primary text-on-primary" : "border-line bg-surface")}>
            {t.label} ({groups[t.id].length})
          </button>
        ))}
      </div>
      <div aria-live="polite" className="flex flex-col gap-3">
        {list.length === 0 && <EmptyState title="Nada en esta lista">Cuando un comprador sube un comprobante, aparece en “Por revisar”.</EmptyState>}
        {list.map((o) => (
          <article key={o.code} className="animate-fade-up flex flex-col gap-3 rounded-3xl bg-surface shadow-[var(--shadow-card)] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/admin-demo/pedidos/detalle/?codigo=${o.code}`} className="font-extrabold text-primary underline">{o.code}</Link>
              <StatusBadge status={o.status} />
              <span className="text-sm text-muted">{o.customer.name} · {paymentLabel(o.paymentMethod)}</span>
            </div>
            <ProofReview order={o} />
          </article>
        ))}
      </div>
      <section aria-labelledby="auditoria" className="mt-8">
        <h2 id="auditoria" className="mb-3 text-lg font-extrabold">Auditoría de muestra</h2>
        <ol className="flex flex-col divide-y divide-line rounded-3xl bg-surface shadow-[var(--shadow-card)] text-sm">
          {audit.slice(0, 15).map((a) => (
            <li key={a.id} className="flex flex-wrap gap-x-3 p-3"><span className="font-bold">{a.action}</span><span className="text-muted">{a.entity}</span><span className="ml-auto text-xs text-muted">{a.actor} · {formatDateTime(a.at)}</span></li>
          ))}
        </ol>
      </section>
    </>
  );
}
