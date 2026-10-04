"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/atoms/Field";
import { Select } from "@/components/atoms/Select";
import { EmptyState } from "@/components/molecules/EmptyState";
import { Pagination } from "@/components/molecules/Pagination";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { filterOrders } from "@/demo/admin/metrics";
import { ORDER_STATUSES, STATUS_LABEL, type OrderStatus } from "@/demo/engine/orders";
import { formatDateTime } from "@/lib/date";
import { formatARS } from "@/lib/money";
import { useAdmin } from "@/stores/admin";
import { AdminPageHeader } from "./AdminPageHeader";
import { fulfillmentLabel, OrderCard, paymentLabel } from "./OrderCard";
import { usePaged } from "./usePaged";

export function OrdersList() {
  const orders = useAdmin((s) => s.orders);
  const initialStatus = useSearchParams().get("estado") as OrderStatus | null;
  const [f, setF] = useState<{ q: string; status: OrderStatus | "ALL"; from: string; to: string }>({ q: "", status: initialStatus && ORDER_STATUSES.includes(initialStatus) ? initialStatus : "ALL", from: "", to: "" });
  const list = filterOrders(orders, f);
  const dirty = f.q || f.status !== "ALL" || f.from || f.to;
  const paged = usePaged(list, 8, JSON.stringify(f));
  return (
    <>
      <AdminPageHeader title="Pedidos">Pedidos ficticios. Abrí uno para ver productos, personalización aprobada, comprobante, historial y notas.</AdminPageHeader>
      <form role="search" onSubmit={(e) => e.preventDefault()} className="mb-4 grid gap-3 rounded-3xl bg-surface shadow-[var(--shadow-card)] p-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm font-bold">Código o cliente<Input value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} placeholder="VEL-000123" /></label>
        <label className="flex flex-col gap-1 text-sm font-bold">Estado
          <Select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as OrderStatus | "ALL" })}>
            <option value="ALL">Todos</option>
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </Select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-bold">Desde<Input type="date" value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} /></label>
        <label className="flex flex-col gap-1 text-sm font-bold">Hasta<Input type="date" value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} /></label>
      </form>
      <div className="mb-3 flex items-center justify-between text-sm">
        <p aria-live="polite" className="text-muted">{list.length} {list.length === 1 ? "pedido" : "pedidos"}</p>
        {dirty && <button type="button" onClick={() => setF({ q: "", status: "ALL", from: "", to: "" })} className="font-bold text-primary underline">Limpiar filtros</button>}
      </div>
      {list.length === 0 ? <EmptyState title="Ningún pedido coincide">Probá con otro código, estado o rango de fechas.</EmptyState> : (
        <>
          <ul className="flex flex-col gap-2 md:hidden">{paged.items.map((o) => <li key={o.code}><OrderCard order={o} /></li>)}</ul>
          <table className="hidden w-full overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow-card)] text-left text-sm md:table">
            <thead className="bg-accent/60 text-muted">
              <tr><th className="p-3">Código</th><th>Cliente</th><th>Fecha</th><th>Estado</th><th>Pago</th><th>Entrega</th><th className="pr-3 text-right">Total (demo)</th></tr>
            </thead>
            <tbody>
              {paged.items.map((o) => (
                <tr key={o.code} className="border-t border-line hover:bg-accent/30">
                  <td className="p-3 font-extrabold"><Link href={`/admin-demo/pedidos/detalle/?codigo=${o.code}`} className="text-primary underline">{o.code}</Link></td>
                  <td>{o.customer.name}</td><td>{formatDateTime(o.createdAt)}</td><td><StatusBadge status={o.status} /></td>
                  <td>{paymentLabel(o.paymentMethod)}</td><td>{fulfillmentLabel(o.fulfillment)}</td>
                  <td className="pr-3 text-right font-bold tabular-nums">{formatARS(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination {...paged} noun="pedidos" onPage={paged.setPage} />
        </>
      )}
    </>
  );
}
