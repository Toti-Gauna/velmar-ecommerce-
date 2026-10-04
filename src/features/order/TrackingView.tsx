"use client";
import { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Skeleton } from "@/components/atoms/Skeleton";
import { StatusTimeline } from "@/components/molecules/StatusTimeline";
import type { CartLine } from "@/demo/engine/cart-types";
import { DEMO_ORDER_CODE } from "@/demo/fixtures/commerce";
import { cn } from "@/lib/cn";
import { useCheckout } from "@/stores/checkout";
import { useHydrated } from "@/stores/hydration";
import { OrderLines } from "./OrderLines";
import { ProofUpload } from "./ProofUpload";
import { SAMPLE_STATES, timelineFor, type SampleStateId } from "./tracking-states";

const SAMPLE_LINES: CartLine[] = [
  { id: "s1", productSlug: "collar-con-nombre", variantId: "col-m", quantity: 1, personalization: { kind: "TEXT", text: "Ñoqui", font: "Redondeada", color: "#3d4a2a", colorName: "Verde oliva", approvedAt: "2026-10-02T10:14:00Z" } },
  { id: "s2", productSlug: "vela-caniche", variantId: "vc-vainilla", quantity: 1 },
];

export function TrackingView() {
  const hydrated = useHydrated();
  const order = useCheckout((s) => s.lastOrder);
  const [stateId, setStateId] = useState<SampleStateId>("production");
  const state = SAMPLE_STATES.find((s) => s.id === stateId)!;
  if (!hydrated) return <Skeleton className="h-96 w-full" />;
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="demo">Seguimiento de demostración</Badge>
          <span className="text-sm text-muted">Pedido <strong className="text-ink">{order?.code ?? DEMO_ORDER_CODE}</strong> · sin login, con el link del email</span>
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-bold">Ver estado de muestra</legend>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_STATES.map((s) => (
              <label key={s.id} className={cn("cursor-pointer rounded-full border-2 px-3 py-1.5 text-sm font-bold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/50", s.id === stateId ? "border-primary bg-primary text-on-primary" : "border-line bg-surface")}>
                <input type="radio" name="sample-state" className="sr-only" checked={s.id === stateId} onChange={() => setStateId(s.id)} />
                {s.label}
              </label>
            ))}
          </div>
        </fieldset>
        <div key={stateId} className="animate-fade-up rounded-[var(--radius-card)] border border-line bg-surface p-5">
          <StatusTimeline steps={timelineFor(state.current)} />
        </div>
        {stateId === "pending" && (
          <section aria-labelledby="comprobante" className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-5">
            <h2 id="comprobante" className="font-extrabold">Falta el comprobante</h2>
            <ProofUpload orderCode={order?.code} />
          </section>
        )}
      </div>
      <aside className="flex flex-col gap-3">
        <h2 className="font-extrabold">{order ? "Tu pedido de demostración" : "Pedido de ejemplo"}</h2>
        <OrderLines lines={order?.lines.length ? order.lines : SAMPLE_LINES} />
      </aside>
    </div>
  );
}
