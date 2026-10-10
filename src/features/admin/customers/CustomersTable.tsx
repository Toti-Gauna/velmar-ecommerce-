"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Copy } from "lucide-react";
import { useEffect } from "react";
import { Badge } from "@/components/atoms/Badge";
import { EmptyState } from "@/components/molecules/EmptyState";
import { DataTable, toSheet } from "@/components/organisms/data-table/DataTable";
import type { Column, RowCardProps } from "@/components/organisms/data-table/types";
import { customerRows, type CustomerRow, type CustomerSegment } from "@/demo/admin/customers";
import { customerReminders } from "@/demo/admin/workshop/reminders";
import { DEMO_TODAY } from "@/demo/fixtures/admin-orders";
import type { FilterSpec } from "@/demo/admin/table";
import { formatDate } from "@/lib/date";
import { formatARS } from "@/lib/money";
import { useAdmin } from "@/stores/admin";
import { useToasts } from "@/stores/toast";
import { AdminPageHeader } from "../AdminPageHeader";
import { BulkButton } from "../table/TabFilter";
import { specFromColumns, TableExcel } from "../table/TableExcel";
import { useExport } from "../table/useExport";
import { useTableState } from "../table/useTableState";
import { profileHref, ReminderList } from "./Reminders";

const SEGMENTS: [CustomerSegment, string][] = [["VIP", "VIP"], ["Recurrente", "Recurrentes"], ["Nuevo", "Nuevos"], ["Sin compras", "Sin compras"]];
const FILTERS: FilterSpec<CustomerRow>[] = [
  { id: "segmento", label: "Segmento", options: SEGMENTS.map(([value, label]) => ({ value, label })), test: (c, v) => c.segment === v },
  { id: "tipo", label: "Tipo", options: [{ value: "cuenta", label: "Con cuenta" }, { value: "invitado", label: "Invitados" }], test: (c, v) => (v === "invitado" ? !c.registered : c.registered) },
];
const search = (c: CustomerRow) => `${c.name} ${c.email} ${c.phone ?? ""}`;

const columns: Column<CustomerRow>[] = [
  { id: "name", header: "Cliente", pinned: true, primary: true, cell: (c) => <span className="flex flex-col"><span>{c.name}</span><span className="text-xs font-normal text-muted">{c.email}</span></span>, sortValue: (c) => c.name, exportValue: (c) => c.name },
  { id: "email", header: "Email", defaultHidden: true, cell: (c) => c.email, exportValue: (c) => c.email },
  { id: "phone", header: "Teléfono", defaultHidden: true, cell: (c) => c.phone ?? "—", exportValue: (c) => c.phone ?? "" },
  { id: "type", header: "Tipo", cell: (c) => (c.registered ? "Cuenta" : "Invitado"), sortValue: (c) => c.registered, exportValue: (c) => (c.registered ? "Cuenta" : "Invitado") },
  { id: "segment", header: "Segmento", cell: (c) => <span className="flex gap-1"><Badge tone={c.segment === "VIP" ? "brand" : "neutral"}>{c.segment}</Badge>{c.blocked && <Badge tone="danger">Bloqueado</Badge>}</span>, sortValue: (c) => c.segment, exportValue: (c) => c.segment },
  { id: "orders", header: "Pedidos", align: "right", cell: (c) => c.orders.length, sortValue: (c) => c.orders.length, exportValue: (c) => c.orders.length },
  { id: "spent", header: "Total pagado", align: "right", money: true, cell: (c) => <strong>{formatARS(c.totalSpent)}</strong>, sortValue: (c) => c.totalSpent, exportValue: (c) => c.totalSpent },
  { id: "avg", header: "Ticket promedio", align: "right", money: true, cell: (c) => (c.avgTicket ? formatARS(c.avgTicket) : "—"), sortValue: (c) => c.avgTicket, exportValue: (c) => c.avgTicket },
  { id: "last", header: "Última compra", cell: (c) => (c.lastOrderAt ? formatDate(c.lastOrderAt) : "—"), sortValue: (c) => c.lastOrderAt, exportValue: (c) => (c.lastOrderAt ? formatDate(c.lastOrderAt) : "") },
];

function Card({ row: c, selected, onToggle, onOpen }: RowCardProps<CustomerRow>) {
  return (
    <div className={`flex items-center gap-3 rounded-3xl bg-bg p-3 ring-1 ${selected ? "ring-primary" : "ring-ink/[0.06]"}`}>
      <input type="checkbox" checked={selected} onChange={onToggle} aria-label={`Seleccionar ${c.name}`} className="h-5 w-5 accent-primary" />
      <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <span className="min-w-0 flex-1"><span className="flex items-center gap-2 font-bold">{c.name}<Badge tone={c.segment === "VIP" ? "brand" : "neutral"}>{c.segment}</Badge></span><span className="block truncate text-sm text-muted">{c.email} · {c.orders.length} pedidos</span></span>
        <span className="font-extrabold tabular-nums">{formatARS(c.totalSpent)}</span><ChevronRight size={18} aria-hidden="true" className="text-muted" />
      </button>
    </div>
  );
}

/** Clientes del CRM: cuentas e invitados unidos por email, con segmentos, totales pagados y ficha. */
export function CustomersTable() {
  const users = useAdmin((s) => s.users);
  const orders = useAdmin((s) => s.orders);
  const products = useAdmin((s) => s.data.products);
  const { profiles, settings } = useAdmin((s) => s.workshop);
  const push = useToasts((s) => s.push);
  const router = useRouter();
  const onExport = useExport("clientes");
  // Enlaces anteriores con ?cliente=: llevan a la ficha completa (ya no hay panel lateral).
  const param = useSearchParams().get("cliente");
  useEffect(() => { if (param) router.replace(profileHref(param)); }, [param, router]);
  const state = useTableState("customers", { sort: { id: "spent", dir: "desc" }, hidden: ["email", "phone"], filterIds: FILTERS.map((f) => f.id) });
  const all = customerRows(users, orders);
  const reminders = customerReminders(all, profiles, products, settings, DEMO_TODAY);
  const copy = async (list: CustomerRow[]) => {
    try { await navigator.clipboard.writeText(list.map((c) => c.email).join(", ")); push({ tone: "success", title: `${list.length} emails copiados`, description: "Listos para pegar en tu correo o en una campaña." }); }
    catch { push({ tone: "error", title: "No se pudo copiar", description: "Tu navegador no dejó usar el portapapeles." }); }
  };
  const table = { searchLabel: "Buscar por nombre o email", searchText: search, filters: FILTERS };
  if (state.view === "excel") {
    return <TableExcel id="customers" title="Clientes" noun="clientes" state={state} rows={all} {...table} spec={specFromColumns(columns, (c) => c.key)} onExport={(rows) => onExport(toSheet(columns, rows), "filtered")} />;
  }
  return (
    <>
      <AdminPageHeader title="Clientes">Cuentas registradas y compradores invitados, unidos por email. Perfiles ficticios: el panel nunca muestra contraseñas ni datos de pago.</AdminPageHeader>
      {reminders.length > 0 && (
        <section aria-labelledby="c-remind" className="mb-6">
          <h2 id="c-remind" className="mb-2 font-bold">Para escribirles (próximos 30 días)</h2>
          <ReminderList reminders={reminders.slice(0, 4)} showCustomer />
          {reminders.length > 4 && <p className="mt-2 text-sm text-muted">Y {reminders.length - 4} más en las fichas de cada cliente.</p>}
        </section>
      )}
      <DataTable caption="Clientes" noun="clientes" rows={all} columns={columns} state={state} {...table}
        rowKey={(c) => c.key} rowLabel={(c) => `Seleccionar ${c.name}`} rowHref={(c) => profileHref(c.email)} onExport={onExport} onExcel={() => state.setView("excel")} renderCard={(p) => <Card {...p} />}
        bulkActions={(list) => <BulkButton onClick={() => copy(list)}><Copy size={14} aria-hidden="true" /> Copiar emails</BulkButton>}
        empty={<EmptyState title="Ningún cliente coincide">Probá con otro nombre o segmento, o tocá “Reiniciar”.</EmptyState>} />
    </>
  );
}
