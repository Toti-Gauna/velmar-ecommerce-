"use client";
import { useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { ButtonLink } from "@/components/atoms/Button";
import { Skeleton } from "@/components/atoms/Skeleton";
import { EmptyState } from "@/components/molecules/EmptyState";
import { MissionProgress } from "@/components/molecules/MissionProgress";
import { OrderSummary } from "@/components/molecules/OrderSummary";
import { previewMission } from "@/demo/engine/missions";
import { demoAccountProgress } from "@/demo/fixtures/commerce";
import { useAdmin, useDemoData } from "@/stores/admin";
import { whatsappLink } from "@/lib/whatsapp";
import { useCheckout } from "@/stores/checkout";
import { useHydrated } from "@/stores/hydration";
import { summaryRows } from "../checkout/CheckoutSummary";
import { OrderLines } from "./OrderLines";
import { PaymentInstructions } from "./PaymentInstructions";

const PAY_TITLE = { CHECKOUT_PRO: "Pagar con Mercado Pago (muestra)", BANK_TRANSFER: "Transferencia (muestra)", QR_MANUAL: "Pago con QR (muestra)" };

export function ConfirmationView() {
  const hydrated = useHydrated();
  const order = useCheckout((s) => s.lastOrder);
  const missions = useDemoData((d) => d.missions);
  const syncShopOrder = useAdmin((s) => s.syncShopOrder);
  useEffect(() => {
    if (order) syncShopOrder(order);
  }, [order, syncShopOrder]);
  if (!hydrated) return <Skeleton className="h-96 w-full" />;
  if (!order) return <EmptyState title="Todavía no hay un pedido de demostración" action={<ButtonLink href="/">Ir a la tienda</ButtonLink>}>Completá el checkout para ver esta pantalla.</EmptyState>;
  const mission = missions.find((m) => m.active !== false) ?? missions[0]!;
  const preview = previewMission(mission, demoAccountProgress[mission.id] ?? 0, { units: order.quote.units, total: order.quote.total });
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-6">
        <section className="animate-fade-up rounded-[var(--radius-card)] border-2 border-dashed border-warning bg-surface p-5">
          <Badge tone="demo">PEDIDO DE DEMOSTRACIÓN · no es un pedido real</Badge>
          <h2 className="mt-3 text-2xl font-extrabold">¡Gracias, {order.contact.name.split(" ")[0]}! Registramos tu pedido de demostración</h2>
          <p className="mt-1 text-muted">Código <strong className="text-ink">{order.code}</strong> · Estado de muestra: <strong className="text-ink">pendiente de pago</strong>. No se cobró nada ni se envió ningún email.</p>
        </section>
        <section aria-labelledby="pago" className="flex flex-col gap-3">
          <h2 id="pago" className="text-lg font-extrabold">{PAY_TITLE[order.paymentMethod]}</h2>
          <PaymentInstructions method={order.paymentMethod} total={order.quote.total} code={order.code} />
        </section>
        {order.asAccount && (
          <MissionProgress title={mission.title} reward={mission.reward} pctFrom={preview.pctBefore} pctTo={preview.pctAfter}
            valueLabel={`${Math.min(preview.after, mission.threshold)} / ${mission.threshold}`}
            status={preview.completesNow ? "completes-now" : preview.alreadyComplete ? "complete" : "progress"}
            note="Ilustrativo: en la tienda real la misión avanza cuando el pago queda confirmado." />
        )}
        <section aria-labelledby="items"><h2 id="items" className="mb-3 text-lg font-extrabold">Tu pedido</h2><OrderLines lines={order.lines} /></section>
      </div>
      <aside className="flex flex-col gap-3 lg:sticky lg:top-24 lg:self-start">
        <OrderSummary rows={summaryRows(order.quote)} total={order.quote.total} totalNote="Montos de muestra." />
        <ButtonLink href={`/pedido/${order.token}/`} size="lg">Seguir mi pedido</ButtonLink>
        <a href={whatsappLink(`Hola Velmar! Hice el pedido ${order.code} en la tienda y tengo una consulta.`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 text-sm font-bold text-primary underline">
          <MessageCircle size={16} aria-hidden="true" /> Consultar por WhatsApp
        </a>
      </aside>
    </div>
  );
}
