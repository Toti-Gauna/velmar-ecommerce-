"use client";
import Link from "next/link";
import { ConfirmButton } from "@/components/molecules/ConfirmButton";
import { DateInput } from "@/components/atoms/DateInput";
import type { AdminOrder } from "@/demo/admin/types";
import { manualNextStatuses, STATUS_LABEL } from "@/demo/engine/orders";
import { useAdmin } from "@/stores/admin";
import { useToasts } from "@/stores/toast";
import { useDemoSave } from "./useDemoSave";

/** Solo ofrece transiciones válidas (spec 5.2). El cobro se resuelve en "Pagos manuales" o por webhook. */
export function OrderStatusActions({ order }: { order: AdminOrder }) {
  const transition = useAdmin((s) => s.transition);
  const confirmProvider = useAdmin((s) => s.confirmProvider);
  const rescheduleOrder = useAdmin((s) => s.rescheduleOrder);
  const push = useToasts((s) => s.push);
  const save = useDemoSave();
  const next = manualNextStatuses(order.status, order.fulfillment, order.prevStatus);
  const mpPending = order.paymentMethod === "CHECKOUT_PRO" && order.status === "PENDING_PAYMENT";
  return (
    <div className="flex flex-col gap-4">
      {next.length === 0 && !mpPending && <p className="text-sm text-muted">{order.status === "PAYMENT_REVIEW" ? "Resolvé el comprobante para avanzar." : "No hay cambios de estado disponibles."}</p>}
      <div className="flex flex-wrap gap-2">
        {next.map((to) => (
          <ConfirmButton key={to} size="sm" variant={to === "CANCELLED" || to === "IN_CLAIM" || to === "RETURNED" ? "danger" : "primary"}
            title={`Pasar ${order.code} a “${STATUS_LABEL[to]}”`} confirmLabel="Confirmar cambio"
            description={`El comprador vería este cambio en su seguimiento y recibiría un email (en producción). En la demo no se envía nada.`}
            onConfirm={() => save(`Pedido en “${STATUS_LABEL[to]}” (demo)`, () => transition(order.code, to))}>
            {STATUS_LABEL[to]}
          </ConfirmButton>
        ))}
        {mpPending && (
          <ConfirmButton size="sm" variant="secondary" title="Simular notificación de Mercado Pago" confirmLabel="Simular"
            description="En producción, el pedido pasa a Pagado solo cuando llega el webhook firmado y el servidor verifica monto, moneda y referencia. Esto es una simulación local."
            onConfirm={() => save("Confirmación del proveedor simulada", () => confirmProvider(order.code))}>
            Simular confirmación de Mercado Pago
          </ConfirmButton>
        )}
      </div>
      <div className="flex max-w-xs flex-col gap-1">
        <label htmlFor={`promise-${order.code}`} className="text-sm font-bold">Fecha comprometida de entrega</label>
        <DateInput id={`promise-${order.code}`} value={order.promisedDate ?? ""} className="font-semibold" onChange={(e) => {
          const day = e.target.value;
          if (!day) return;
          const r = rescheduleOrder(order.code, day);
          if (!r.ok) push({ tone: "error", title: "No se puede comprometer esa fecha", description: r.error });
          else push({ tone: r.warnings.length ? "info" : "success", title: "Fecha comprometida guardada", description: r.warnings.join(" ") || "Cambio guardado solo en esta demo (este navegador)." });
        }} />
        <Link href="/admin-demo/calendario/" className="text-xs font-bold text-primary underline">Ver la capacidad en el calendario</Link>
      </div>
    </div>
  );
}
