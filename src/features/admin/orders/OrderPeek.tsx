"use client";
import Link from "next/link";
import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { Sheet } from "@/components/motion/Sheet";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { ProductVisual } from "@/components/illustrations/ProductVisual";
import type { AdminOrder } from "@/demo/admin/types";
import { getProduct } from "@/demo/engine/catalog";
import { formatDateTime } from "@/lib/date";
import { formatARS } from "@/lib/money";
import { fulfillmentLabel, paymentLabel } from "../OrderCard";
import { OrderStatusActions } from "../OrderStatusActions";

/** Vista rápida del pedido al costado de la tabla: contacto, productos, total y cambio de estado. */
export function OrderPeek({ order, onClose }: { order: AdminOrder | null; onClose: () => void }) {
  return (
    <Sheet open={!!order} onClose={onClose} title={order ? `Pedido ${order.code}` : "Pedido"} side="right" className="max-w-lg bg-bg">
      {order && (
        <div className="flex h-full flex-col overflow-y-auto">
          <header className="border-b border-line bg-surface px-6 pb-5 pt-6 pr-16">
            <p className="eyebrow text-muted">Pedido</p>
            <h2 className="font-display mt-1 text-3xl">{order.code}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted"><StatusBadge status={order.status} />{formatDateTime(order.createdAt)}</div>
          </header>
          <div className="flex flex-col gap-5 p-6">
            <section aria-label="Cliente" className="rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]">
              <p className="font-bold">{order.customer.name}</p>
              <ul className="mt-2 flex flex-col gap-1.5 text-sm text-muted">
                <li className="flex items-center gap-2"><Mail size={14} aria-hidden="true" />{order.customer.email}</li>
                <li className="flex items-center gap-2"><Phone size={14} aria-hidden="true" />{order.customer.phone}</li>
                {order.address && <li>{order.address}</li>}
              </ul>
              <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-muted"><MessageCircle size={13} aria-hidden="true" />{paymentLabel(order.paymentMethod)} · {fulfillmentLabel(order.fulfillment)}</p>
            </section>
            <section aria-label="Productos" className="rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]">
              <ul className="flex flex-col gap-3">
                {order.lines.map((l) => {
                  const p = getProduct(l.productSlug);
                  const v = p?.variants.find((x) => x.id === l.variantId);
                  return (
                    <li key={l.id} className="flex items-center gap-3">
                      {p && <ProductVisual art={p.art} photoUrl={p.photoDataUrl} tint={v?.colorHex} label="" showBadge={false} className="aspect-square w-12 shrink-0 rounded-xl" />}
                      <span className="min-w-0 flex-1 text-sm"><span className="block truncate font-semibold">{p?.name ?? l.productSlug}</span><span className="text-muted">{v?.label}{l.personalization?.kind === "TEXT" ? ` · “${l.personalization.text}”` : ""}</span></span>
                      <span className="text-sm font-bold tabular-nums">×{l.quantity}</span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 flex justify-between border-t border-line pt-3 font-extrabold"><span>Total (demo)</span><span className="tabular-nums">{formatARS(order.total)}</span></p>
            </section>
            <section aria-label="Estado" className="rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]"><OrderStatusActions order={order} /></section>
            <Link href={`/admin-demo/pedidos/detalle/?codigo=${order.code}`} className="inline-flex items-center gap-1.5 self-start text-sm font-bold text-primary underline">
              Abrir el pedido completo <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </Sheet>
  );
}
