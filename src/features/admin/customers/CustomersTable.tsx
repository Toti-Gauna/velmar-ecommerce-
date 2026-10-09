"use client";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Copy } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { EmptyState } from "@/components/molecules/EmptyState";
import { DataTable } from "@/components/organisms/data-table/DataTable";
import type { Column, RowCardProps } from "@/components/organisms/data-table/types";
import { customerRows, type CustomerRow, type CustomerSegment } from "@/demo/admin/customers";
import { customerReminders } from "@/demo/admin/workshop/reminders";
import { DEMO_TODAY } from "@/demo/fixtures/admin-orders";
import { formatDate } from "@/lib/date";
import { formatARS } from "@/lib/money";
import { useAdmin } from "@/stores/admin";
import { useToasts } from "@/stores/toast";
import { AdminPageHeader } from "../AdminPageHeader";
import { BulkButton, TabFilter } from "../table/TabFilter";
import { useExport } from "../table/useExport";
import { useTableState } from "../table/useTableState";
import { CustomerPeek } from "./CustomerPeek";
import { ReminderList } from "./Reminders";

type Tab = "all" | CustomerSegment | "guest";
const TABS: [Tab, string][] = [["all", "Todos"], ["VIP", "VIP"], ["Recurrente", "Recurrentes"], ["Nuevo", "Nuevos"], ["Sin compras", "Sin compras"], ["guest", "Invitados"]];
const inTab = (c: CustomerRow, t: Tab) => t === "all" || (t === "guest" ? !c.registered : c.segment === t);

const columns: Column<CustomerRow>[] = [
  { id: "name", header: "Cliente", pinned: true, primary: true, cell: (c) => <span className="flex flex-col"><span>{c.name}</span><span className="text-xs font-normal text-muted">{c.email}</span></span>, sortValue: (c) => c.name, exportValue: (c) => c.name },
  { id: "email", header: "Email", defaultHidden: true, cell: (c) => c.email, exportValue: (c) => c.email },
  { id: "phone", header: "Teléfono", defaultHidden: true, cell: (c) => c.phone ?? "—", exportValue: (c) => c.phone ?? "" },
  { id: "type", header: "Tipo", cell: (c) => (c.registered ? "Cuenta" : "Invitado"), sortValue: (c) => c.registered, exportValue: (c) => (c.registered ? "Cuenta" : "Invitado") },
  { id: "segment", header: "Segmento", cell: (c) => <span className="flex gap-1"><Badge tone={c.segment === "VIP" ? "brand" : "neutral"}>{c.segment}</Badge>{c.blocked && <Badge tone="danger">Bloqueado</Badge>}</span>, sortValue: (c) => c.segment, exportValue: (c) => c.segment },
  { id: "orders", header: "Pedidos", align: "right", cell: (c) => c.orders.length, sortValue: (c) => c.orders.length, exportValue: (c) => c.orders.length },
  { id: "spent", header: "Total pagado", align: "right", cell: (c) => <strong>{formatARS(c.totalSpent)}</strong>, sortValue: (c) => c.totalSpent, exportValue: (c) => c.totalSpent },
  { id: "avg", header: "Ticket promedio", align: "right", cell: (c) => (c.avgTicket ? formatARS(c.avgTicket) : "—"), sortValue: (c) => c.avgTicket, exportValue: (c) => c.avgTicket },
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
  const onExport = useExport("clientes");
  const [tab, setTab] = useState<Tab>("all");
  const param = useSearchParams().get("cliente");
  const [peek, setPeek] = useState<string | null>(param);
  // El buscador ⌘K cambia solo el ?cliente= de la URL: se abre la ficha aunque la pantalla ya estuviera montada.
  const [seen, setSeen] = useState(param);
  if (param !== seen) { setSeen(param); setPeek(param); }
  const state = useTableState("customers", { sort: { id: "spent", dir: "desc" }, hidden: ["email", "phone"] });
  const all = customerRows(users, orders);
  const reminders = customerReminders(all, profiles, products, settings, DEMO_TODAY);
  const copy = async (list: CustomerRow[]) => {
    try { await navigator.clipboard.writeText(list.map((c) => c.email).join(", ")); push({ tone: "success", title: `${list.length} emails copiados`, description: "Listos para pegar en tu correo o en una campaña." }); }
    catch { push({ tone: "error", title: "No se pudo copiar", description: "Tu navegador no dejó usar el portapapeles." }); }
  };
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
      <div className="mb-4"><TabFilter label="Segmento" value={tab} onChange={(t) => { setTab(t); state.setPage(1); }} tabs={TABS.map(([id, label]) => ({ id, label, count: all.filter((c) => inTab(c, id)).length }))} /></div>
      <DataTable caption="Clientes" noun="clientes" rows={all.filter((c) => inTab(c, tab))} columns={columns} state={state} pageSize={10}
        rowKey={(c) => c.key} rowLabel={(c) => `Seleccionar ${c.name}`} searchText={(c) => `${c.name} ${c.email} ${c.phone ?? ""}`}
        searchLabel="Buscar por nombre o email" onRowOpen={(c) => setPeek(c.email)} onExport={onExport} renderCard={(p) => <Card {...p} />}
        bulkActions={(list) => <BulkButton onClick={() => copy(list)}><Copy size={14} aria-hidden="true" /> Copiar emails</BulkButton>}
        empty={<EmptyState title="Ningún cliente coincide" />} />
      <CustomerPeek customer={all.find((c) => c.email.toLowerCase() === peek?.toLowerCase()) ?? null} onClose={() => setPeek(null)} />
    </>
  );
}
