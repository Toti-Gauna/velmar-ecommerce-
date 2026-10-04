"use client";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import type { CartLine } from "@/demo/engine/cart-types";
import { DEMO_ORDER_CODE } from "@/demo/fixtures/commerce";
import { cn } from "@/lib/cn";
import { whatsappLink } from "@/lib/whatsapp";
import { useCheckout } from "@/stores/checkout";
import { useHydrated } from "@/stores/hydration";
import { OrderLines } from "./OrderLines";
import { ProofUpload } from "./ProofUpload";
import { RouteMap } from "./RouteMap";
import { StageStepper } from "./StageStepper";
import { SAMPLE_STATES, timelineFor, type SampleStateId } from "./tracking-states";

const SAMPLE_LINES: CartLine[] = [
  { id: "s1", productSlug: "collar-con-nombre", variantId: "col-m", quantity: 1, personalization: { kind: "TEXT", text: "Ñoqui", font: "Redondeada", color: "#3d4a2a", colorName: "Verde oliva", approvedAt: "2026-10-02T10:14:00Z" } },
  { id: "s2", productSlug: "vela-caniche", variantId: "vc-vainilla", quantity: 1 },
];

const STATE_COPY: Record<SampleStateId, { title: string; eta: string; progress: number; note: string }> = {
  pending: { title: "Esperando tu comprobante", eta: "Se calcula cuando Velmar confirme el pago", progress: 0.04, note: "Subí el comprobante: Velmar verifica el ingreso y arranca la producción." },
  production: { title: "En producción", eta: "Llega entre el jue 8 y el vie 9 de oct", progress: 0.38, note: "Tu pieza se está fabricando con la vista previa que aprobaste." },
  shipped: { title: "En camino", eta: "Llega mañana, vie 9 de oct", progress: 0.82, note: "Ya salió del taller. El cadete te escribe antes de llegar." },
};

export function TrackingView() {
  const hydrated = useHydrated();
  const order = useCheckout((s) => s.lastOrder);
  const [stateId, setStateId] = useState<SampleStateId>("production");
  const state = SAMPLE_STATES.find((s) => s.id === stateId)!;
  const copy = STATE_COPY[stateId];
  const code = order?.code ?? DEMO_ORDER_CODE;
  if (!hydrated) return <Skeleton className="h-96 w-full" />;
  return (
    <div className="flex flex-col gap-8">
      <section className="grid grid-cols-[minmax(0,1fr)] gap-6 overflow-hidden rounded-[2.5rem] bg-night p-6 text-[#f6f1e8] sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="flex flex-col gap-4">
          <p className="eyebrow text-brass">Pedido {code} · seguimiento de demostración</p>
          <p className="text-sm text-[#cfc6b3]">Estado actual</p>
          <h2 key={stateId} className="font-display animate-rise -mt-3 text-5xl leading-none sm:text-6xl">{copy.title}</h2>
          <p className="text-[#cfc6b3]">{copy.note}</p>
          <p className="mt-auto rounded-2xl bg-white/5 px-4 py-3 text-sm"><span className="block text-xs text-[#cfc6b3]">Entrega estimada (muestra)</span><strong>{copy.eta}</strong></p>
        </div>
        <RouteMap progress={copy.progress} />
      </section>
      <fieldset className="flex flex-wrap items-center gap-3">
        <legend className="sr-only">Ver estado de muestra</legend>
        <span aria-hidden="true" className="text-sm font-bold text-muted">Probá otros estados:</span>
        <div className="flex gap-1 rounded-full bg-surface p-1 shadow-[var(--shadow-card)]">
          {SAMPLE_STATES.map((s) => (
            <label key={s.id} className={cn("cursor-pointer rounded-full px-4 py-2 text-sm font-bold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/50", s.id === stateId ? "bg-night text-[#f6f1e8]" : "text-muted hover:text-ink")}>
              <input type="radio" name="sample-state" className="sr-only" checked={s.id === stateId} onChange={() => setStateId(s.id)} />
              {s.label}
            </label>
          ))}
        </div>
      </fieldset>
      <section aria-label="Etapas del pedido" className="rounded-[2rem] bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
        <StageStepper key={stateId} steps={timelineFor(state.current)} />
      </section>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <section aria-labelledby="items" className="flex flex-col gap-3">
          <h2 id="items" className="font-display text-3xl">{order ? "Tu pedido de demostración" : "Pedido de ejemplo"}</h2>
          <OrderLines lines={order?.lines.length ? order.lines : SAMPLE_LINES} />
        </section>
        <aside className="flex flex-col gap-4">
          {stateId === "pending" && (
            <section aria-labelledby="comprobante" className="flex flex-col gap-3 rounded-3xl bg-surface p-5 shadow-[var(--shadow-card)]">
              <h2 id="comprobante" className="font-display text-2xl">Falta el comprobante</h2>
              <ProofUpload orderCode={order?.code} />
            </section>
          )}
          <a href={whatsappLink(`Hola Velmar! Consulto por el pedido ${code}.`)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-3xl bg-surface p-5 shadow-[var(--shadow-card)] hover:bg-accent/40">
            <MessageCircle size={22} aria-hidden="true" className="text-primary" />
            <span><span className="block font-bold">¿Dudas con tu pedido?</span><span className="text-sm text-muted">Escribinos por WhatsApp con tu código</span></span>
          </a>
          <p className="text-xs text-muted">En la tienda real este link llega por email y funciona sin login, con un token de alta entropía validado en el servidor.</p>
        </aside>
      </div>
    </div>
  );
}
