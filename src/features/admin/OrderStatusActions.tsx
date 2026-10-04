"use client";
import { ConfirmButton } from "@/components/molecules/ConfirmButton";
import type { AdminOrder } from "@/demo/admin/types";
import { manualNextStatuses, STATUS_LABEL } from "@/demo/engine/orders";
import { useAdmin } from "@/stores/admin";
import { useDemoSave } from "./useDemoSave";

/** Solo ofrece transiciones válidas (spec 5.2). El cobro se resuelve en "Pagos manuales" o por webhook. */
export function OrderStatusActions({ order }: { order: AdminOrder }) {
  const transition = useAdmin((s) => s.transition);
  const confirmProvider = useAdmin((s) => s.confirmProvider);
  const setPromisedDate = useAdmin((s) => s.setPromisedDate);
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
      <label className="flex max-w-xs flex-col gap-1 text-sm font-bold">
        Fecha comprometida de producción
        <input type="date" value={order.promisedDate ?? ""} onChange={(e) => e.target.value && save("Fecha comprometida guardada", () => setPromisedDate(order.code, e.target.value))}
          className="min-h-11 rounded-xl border border-line bg-surface px-3 font-semibold" />
      </label>
    </div>
  );
}
