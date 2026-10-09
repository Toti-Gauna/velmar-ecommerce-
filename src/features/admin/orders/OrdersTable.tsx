"use client";
import { useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { DateInput } from "@/components/atoms/DateInput";
import { EmptyState } from "@/components/molecules/EmptyState";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { DataTable } from "@/components/organisms/data-table/DataTable";
import type { RowCardProps } from "@/components/organisms/data-table/types";
import { BULK_TARGETS, inTab, ORDER_TABS, tabForStatus, type OrderTabId } from "@/demo/admin/order-groups";
import type { AdminOrder } from "@/demo/admin/types";
import { canTransition, STATUS_LABEL } from "@/demo/engine/orders";
import { formatDateTime, toDayKey } from "@/lib/date";
import { formatARS } from "@/lib/money";
import { useAdmin } from "@/stores/admin";
import { useToasts } from "@/stores/toast";
import { AdminPageHeader } from "../AdminPageHeader";
import { BulkButton, TabFilter } from "../table/TabFilter";
import { useExport } from "../table/useExport";
import { useTableState } from "../table/useTableState";
import { orderColumns, PromisedCell } from "./orderColumns";
import { OrderPeek } from "./OrderPeek";

function OrderRowCard({ row: o, selected, onToggle, onOpen }: RowCardProps<AdminOrder>) {
  return (
    <div className={`flex items-center gap-3 rounded-3xl bg-bg p-3 ring-1 ${selected ? "ring-primary" : "ring-ink/[0.06]"}`}>
      <input type="checkbox" checked={selected} onChange={onToggle} aria-label={`Seleccionar ${o.code}`} className="h-5 w-5 shrink-0 accent-primary" />
      <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="flex flex-wrap items-center gap-2"><span className="font-extrabold">{o.code}</span><StatusBadge status={o.status} /></span>
          <span className="truncate text-sm">{o.customer.name}</span>
          <span className="flex flex-wrap gap-x-2 text-xs text-muted">{formatDateTime(o.createdAt)}{o.promisedDate && <PromisedCell order={o} />}</span>
        </span>
        <span className="font-extrabold tabular-nums">{formatARS(o.total)}</span>
        <ChevronRight size={18} aria-hidden="true" className="text-muted" />
      </button>
    </div>
  );
}

/** Pedidos como en un CRM: pestañas por etapa, fechas, búsqueda, orden, acciones en lote, Excel y vista rápida. */
export function OrdersTable() {
  const orders = useAdmin((s) => s.orders);
  const transition = useAdmin((s) => s.transition);
  const push = useToasts((s) => s.push);
  const onExport = useExport("pedidos");
  const [tab, setTab] = useState<OrderTabId>(tabForStatus(useSearchParams().get("estado")));
  const [range, setRange] = useState({ from: "", to: "" });
  const [peek, setPeek] = useState<string | null>(null);
  const state = useTableState("orders", { sort: { id: "date", dir: "desc" }, hidden: orderColumns.filter((c) => c.defaultHidden).map((c) => c.id) });
  const inRange = orders.filter((o) => (!range.from || toDayKey(o.createdAt) >= range.from) && (!range.to || toDayKey(o.createdAt) <= range.to));
  const rows = inRange.filter((o) => inTab(o, tab));
  const pick = (next: OrderTabId) => { setTab(next); state.setPage(1); state.setSelected(new Set()); };
  const bulkMove = (list: AdminOrder[], to: (typeof BULK_TARGETS)[number], clear: () => void) => {
    const ok = list.filter((o) => canTransition(o.status, to, { fulfillment: o.fulfillment, trigger: "admin", prevStatus: o.prevStatus }));
    for (const o of ok) transition(o.code, to, `Cambio en lote a ${STATUS_LABEL[to]}`);
    const skipped = list.length - ok.length;
    push({ tone: ok.length ? "success" : "error", title: ok.length ? `${ok.length} ${ok.length === 1 ? "pedido pasó" : "pedidos pasaron"} a “${STATUS_LABEL[to]}”` : "Ningún pedido podía pasar a ese estado",
      description: skipped ? `${skipped} quedaron igual porque su estado actual no lo permite.` : "Cambio guardado solo en esta demo." });
    clear();
  };
  return (
    <>
      <AdminPageHeader title="Pedidos">Pedidos ficticios. Filtrá por etapa, buscá, ordená por cualquier columna, cambiá estados en lote o bajá todo a Excel.</AdminPageHeader>
      <div className="mb-4">
        <TabFilter label="Etapa del pedido" value={tab} onChange={pick} tabs={ORDER_TABS.map((t) => ({ id: t.id, label: t.label, count: inRange.filter((o) => inTab(o, t.id)).length }))} />
      </div>
      <DataTable caption="Pedidos" noun="pedidos" rows={rows} columns={orderColumns} state={state} pageSize={8}
        rowKey={(o) => o.code} rowLabel={(o) => `Seleccionar ${o.code}`} searchText={(o) => `${o.code} ${o.customer.name} ${o.customer.email}`}
        searchLabel="Código o cliente" searchPlaceholder="VEL-000123, nombre o email"
        filters={(
          <div className="flex gap-2">
            <label className="flex w-40 flex-col gap-1 text-sm font-bold">Desde<DateInput value={range.from} onChange={(e) => { setRange({ ...range, from: e.target.value }); state.setPage(1); }} className="min-h-11" /></label>
            <label className="flex w-40 flex-col gap-1 text-sm font-bold">Hasta<DateInput value={range.to} onChange={(e) => { setRange({ ...range, to: e.target.value }); state.setPage(1); }} className="min-h-11" /></label>
          </div>
        )}
        bulkActions={(list, clear) => BULK_TARGETS.map((to) => <BulkButton key={to} onClick={() => bulkMove(list, to, clear)}>Pasar a {STATUS_LABEL[to]}</BulkButton>)}
        onRowOpen={(o) => setPeek(o.code)} onExport={onExport} renderCard={(p) => <OrderRowCard {...p} />}
        empty={<EmptyState title="Ningún pedido coincide">Probá con otra etapa, código o rango de fechas.</EmptyState>} />
      <OrderPeek order={orders.find((o) => o.code === peek) ?? null} onClose={() => setPeek(null)} />
    </>
  );
}
