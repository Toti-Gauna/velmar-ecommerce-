"use client";
import Link from "next/link";
import { Mail, Phone, ShieldOff } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Sheet } from "@/components/motion/Sheet";
import { ConfirmButton } from "@/components/molecules/ConfirmButton";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import type { CustomerRow } from "@/demo/admin/customers";
import { formatDate } from "@/lib/date";
import { formatARS } from "@/lib/money";
import { useAdmin } from "@/stores/admin";
import { useDemoSave } from "../useDemoSave";
import { profileHref } from "./Reminders";

/** Ficha del cliente: contacto, números, compras, misiones y premios. Nunca contraseñas ni datos de pago. */
export function CustomerPeek({ customer, onClose }: { customer: CustomerRow | null; onClose: () => void }) {
  const users = useAdmin((s) => s.users);
  const missions = useAdmin((s) => s.data.missions);
  const toggleUserBlocked = useAdmin((s) => s.toggleUserBlocked);
  const save = useDemoSave();
  const user = customer?.userId ? users.find((u) => u.id === customer.userId) : undefined;
  const stat = (label: string, value: string) => <div className="rounded-2xl bg-bg p-3"><p className="text-xs font-bold text-muted">{label}</p><p className="mt-0.5 font-extrabold tabular-nums">{value}</p></div>;
  return (
    <Sheet open={!!customer} onClose={onClose} title={customer ? `Cliente ${customer.name}` : "Cliente"} side="right" className="max-w-lg bg-bg">
      {customer && (
        <div className="flex h-full flex-col overflow-y-auto">
          <header className="border-b border-line bg-surface px-6 pb-5 pt-6 pr-16">
            <p className="eyebrow text-muted">{customer.registered ? "Cuenta registrada" : "Compró como invitado"}</p>
            <h2 className="font-display mt-1 text-3xl">{customer.name}</h2>
            <div className="mt-2 flex flex-wrap gap-2"><Badge tone={customer.segment === "VIP" ? "brand" : "neutral"}>{customer.segment}</Badge>{customer.blocked && <Badge tone="danger"><ShieldOff size={12} aria-hidden="true" /> Bloqueado (visual)</Badge>}</div>
            <ul className="mt-3 flex flex-col gap-1 text-sm text-muted">
              <li className="flex items-center gap-2"><Mail size={14} aria-hidden="true" />{customer.email}</li>
              {customer.phone && <li className="flex items-center gap-2"><Phone size={14} aria-hidden="true" />{customer.phone}</li>}
            </ul>
          </header>
          <div className="flex flex-col gap-5 p-6">
            <Link href={profileHref(customer.email)} className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-primary px-5 text-sm font-bold text-on-primary hover:bg-primary-hover">
              Abrir ficha completa: mascotas, notas y recordatorios
            </Link>
            <div className="grid grid-cols-3 gap-2">{stat("Total pagado", formatARS(customer.totalSpent))}{stat("Pedidos", String(customer.orders.length))}{stat("Ticket prom.", customer.avgTicket ? formatARS(customer.avgTicket) : "—")}</div>
            <section aria-labelledby="c-orders"><h3 id="c-orders" className="mb-2 font-bold">Compras</h3>
              {customer.orders.length ? (
                <ul className="flex flex-col gap-2">{customer.orders.map((o) => (
                  <li key={o.code}><Link href={`/admin-demo/pedidos/detalle/?codigo=${o.code}`} className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-[var(--shadow-card)] hover:ring-1 hover:ring-primary">
                    <span className="flex-1"><span className="block font-bold">{o.code}</span><span className="text-xs text-muted">{formatDate(o.createdAt)}</span></span><StatusBadge status={o.status} /><span className="font-bold tabular-nums">{formatARS(o.total)}</span>
                  </Link></li>
                ))}</ul>
              ) : <p className="text-sm text-muted">Sin compras.</p>}
            </section>
            {user && (
              <>
                <section aria-labelledby="c-missions"><h3 id="c-missions" className="mb-2 font-bold">Misiones</h3>
                  <ul className="flex flex-col gap-1 text-sm">{missions.map((m) => <li key={m.id}>{m.title}: {Math.min(user.missionProgress[m.id] ?? 0, m.threshold).toLocaleString("es-AR")} / {m.threshold.toLocaleString("es-AR")}</li>)}</ul>
                </section>
                <section aria-labelledby="c-rewards"><h3 id="c-rewards" className="mb-2 font-bold">Premios</h3>
                  {user.rewards.length ? <ul className="text-sm">{user.rewards.map((r) => <li key={r.title}>{r.title} · vence {formatDate(r.expiresAt)} · {r.used ? "usado" : "disponible"}</li>)}</ul> : <p className="text-sm text-muted">Sin premios.</p>}
                </section>
                <ConfirmButton size="sm" variant={user.blocked ? "secondary" : "danger"} className="self-start" title={user.blocked ? `Desbloquear a ${user.name}` : `Bloquear a ${user.name}`}
                  confirmLabel={user.blocked ? "Desbloquear" : "Bloquear"} description="En la demo el bloqueo es solo visual. En producción impide iniciar sesión y queda en la auditoría."
                  onConfirm={() => save(user.blocked ? "Usuario desbloqueado (visual)" : "Usuario bloqueado (visual)", () => toggleUserBlocked(user.id))}>
                  {user.blocked ? "Desbloquear" : "Bloquear"}
                </ConfirmButton>
              </>
            )}
          </div>
        </div>
      )}
    </Sheet>
  );
}
