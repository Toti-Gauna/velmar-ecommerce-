import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import type { AdminOrder } from "@/demo/admin/types";
import { formatDateTime } from "@/lib/date";
import { formatARS } from "@/lib/money";

const PAY = { CHECKOUT_PRO: "Mercado Pago", BANK_TRANSFER: "Transferencia", QR_MANUAL: "QR" };
const SHIP = { PICKUP: "Retiro", LOCAL_DELIVERY: "Cadete", SHIPPING: "Envío nacional" };

export const paymentLabel = (m: AdminOrder["paymentMethod"]) => PAY[m];
export const fulfillmentLabel = (f: AdminOrder["fulfillment"]) => SHIP[f];

/** Pedido como tarjeta táctil (la tabla del panel se convierte en tarjetas en el celular). */
export function OrderCard({ order }: { order: AdminOrder }) {
  return (
    <Link href={`/admin-demo/pedidos/detalle/?codigo=${order.code}`} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 hover:border-primary">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-extrabold">{order.code}</span>
          <StatusBadge status={order.status} />
          {order.fromShop && <span className="text-xs font-bold text-warning">desde la tienda demo</span>}
        </div>
        <span className="truncate text-sm">{order.customer.name}</span>
        <span className="text-xs text-muted">{formatDateTime(order.createdAt)} · {PAY[order.paymentMethod]} · {SHIP[order.fulfillment]}</span>
      </div>
      <span className="font-extrabold tabular-nums">{formatARS(order.total)}</span>
      <ChevronRight size={18} aria-hidden="true" className="text-muted" />
    </Link>
  );
}
