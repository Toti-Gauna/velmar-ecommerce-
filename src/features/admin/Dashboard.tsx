"use client";
import Link from "next/link";
import { ClipboardCheck, Hammer, LifeBuoy, PackageCheck, Search, Wallet } from "lucide-react";
import { StatTile } from "@/components/molecules/StatTile";
import { SalesChart } from "@/components/organisms/SalesChart";
import { countByStatus, salesSummary } from "@/demo/admin/metrics";
import { DEMO_TODAY } from "@/demo/fixtures/admin-orders";
import { formatDate } from "@/lib/date";
import { formatARS } from "@/lib/money";
import { useAdmin } from "@/stores/admin";
import { AdminPageHeader } from "./AdminPageHeader";
import { OrderCard } from "./OrderCard";

const DAY = new Intl.DateTimeFormat("es-AR", { weekday: "short", day: "numeric", timeZone: "America/Argentina/Buenos_Aires" });

export function Dashboard() {
  const orders = useAdmin((s) => s.orders);
  const claims = useAdmin((s) => s.claims);
  const counts = countByStatus(orders);
  const sales = salesSummary(orders, DEMO_TODAY);
  const openClaims = claims.filter((c) => c.status === "OPEN" || c.status === "IN_PROGRESS");
  const latest = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  return (
    <>
      <AdminPageHeader title="Inicio">Resumen con datos ficticios. Fecha de referencia de la demo: {formatDate(DEMO_TODAY)}.</AdminPageHeader>
      <section aria-label="Pedidos por estado (demo)" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatTile label="A verificar" value={counts.PAYMENT_REVIEW} hint="comprobantes demo" href="/admin-demo/pagos/" icon={<Search size={16} aria-hidden="true" />} />
        <StatTile label="Pendientes de pago" value={counts.PENDING_PAYMENT} hint="demo" href="/admin-demo/pedidos/" icon={<ClipboardCheck size={16} aria-hidden="true" />} />
        <StatTile label="Pagados" value={counts.PAID} hint="demo" href="/admin-demo/pedidos/" icon={<Wallet size={16} aria-hidden="true" />} />
        <StatTile label="En producción" value={counts.IN_PRODUCTION} hint="demo" href="/admin-demo/pedidos/" icon={<Hammer size={16} aria-hidden="true" />} />
        <StatTile label="Listos" value={counts.READY} hint="demo" href="/admin-demo/pedidos/" icon={<PackageCheck size={16} aria-hidden="true" />} />
        <StatTile label="Reclamos abiertos" value={openClaims.length} hint="demo" href="/admin-demo/reclamos/" icon={<LifeBuoy size={16} aria-hidden="true" />} />
      </section>
      <section aria-label="Ventas de muestra" className="mt-6 grid gap-3 lg:grid-cols-[1fr_1.4fr]">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <StatTile label="Ventas hoy" value={formatARS(sales.today)} hint="demo" />
          <StatTile label="Últimos 7 días" value={formatARS(sales.week)} hint="demo" />
          <StatTile label="Últimos 30 días" value={formatARS(sales.month)} hint="demo" />
        </div>
        <SalesChart title="Ventas de muestra por día (pedidos pagados o posteriores)" bars={sales.days.map((d) => ({ key: d.day, label: DAY.format(new Date(`${d.day}T12:00:00-03:00`)), amount: d.amount, orders: d.orders }))} />
      </section>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="ultimos">
          <div className="mb-3 flex items-center justify-between"><h2 id="ultimos" className="text-lg font-extrabold">Últimos pedidos</h2><Link href="/admin-demo/pedidos/" className="text-sm font-bold text-primary underline">Ver todos</Link></div>
          <ul className="flex flex-col gap-2">{latest.map((o) => <li key={o.code}><OrderCard order={o} /></li>)}</ul>
        </section>
        <section aria-labelledby="reclamos">
          <div className="mb-3 flex items-center justify-between"><h2 id="reclamos" className="text-lg font-extrabold">Reclamos de ejemplo</h2><Link href="/admin-demo/reclamos/" className="text-sm font-bold text-primary underline">Gestionar</Link></div>
          <ul className="flex flex-col gap-2">
            {openClaims.map((c) => (
              <li key={c.id} className="rounded-2xl border border-line bg-surface p-4 text-sm">
                <p className="font-bold">{c.code} · {c.name}</p>
                <p className="text-muted">{c.message}</p>
              </li>
            ))}
            {openClaims.length === 0 && <li className="rounded-2xl border border-dashed border-line p-4 text-sm text-muted">Sin reclamos abiertos.</li>}
          </ul>
        </section>
      </div>
    </>
  );
}
