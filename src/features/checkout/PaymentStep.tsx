"use client";
import { Building2, CreditCard, QrCode, Wallet } from "lucide-react";
import { useState, type ReactNode } from "react";
import { OptionCard } from "@/components/atoms/OptionCard";
import { useDemoData } from "@/stores/admin";
import { PAYMENT_METHODS } from "@/demo/engine/payments";
import type { PaymentMethod } from "@/demo/types";
import { useAccount } from "@/stores/account";
import { useCheckout } from "@/stores/checkout";
import { useAccountProfile } from "@/stores/profile";
import { CardChoice } from "./CardChoice";
import { STEP_FORM, StepNav } from "./StepNav";

const METHODS: Record<PaymentMethod, { title: string; description: string; icon: typeof CreditCard; aside?: "discount" | "provider" }> = {
  // 8.4.22: la tarjeta es un medio propio (guardadas o nueva); en producción la procesa Mercado Pago, tokenizada.
  CARD: { title: "Tarjeta de crédito o débito", description: "Con una tarjeta guardada en tu cuenta o una nueva. En esta demostración no se realiza ningún cobro real.", icon: CreditCard },
  CHECKOUT_PRO: { title: "Mercado Pago", description: "Pagá con tu cuenta de Mercado Pago: dinero disponible, tarjetas guardadas allá o cuotas. En esta demostración no se realiza ningún cobro real.", icon: Wallet, aside: "provider" },
  BANK_TRANSFER: { title: "Transferencia bancaria", description: "Transferís al alias, subís el comprobante y Velmar confirma el ingreso.", icon: Building2, aside: "discount" },
  QR_MANUAL: { title: "QR", description: "Escaneás el QR de Velmar con tu billetera, subís el comprobante y Velmar confirma el ingreso.", icon: QrCode, aside: "discount" },
};

export function PaymentStep({ onNext, onBack, before }: { onNext: () => void; onBack: () => void; before?: ReactNode }) {
  const method = useCheckout((s) => s.paymentMethod);
  const card = useCheckout((s) => s.card);
  const patch = useCheckout((s) => s.patch);
  const [missing, setMissing] = useState(false);
  const [cardMissing, setCardMissing] = useState(false);
  const { enabledMethods, transferDiscountPct } = useDemoData((d) => d.settings);
  const user = useAccount((s) => s.user);
  const saved = useAccountProfile(user?.email ?? "").cards;
  const choose = (v: PaymentMethod) => {
    // Con cuenta y tarjetas guardadas, la primera queda elegida (se cambia con un toque).
    patch({ paymentMethod: v, ...(v === "CARD" && !card && user && saved[0] ? { card: saved[0] } : {}) });
    setMissing(false);
  };
  return (
    <>
    <form id={STEP_FORM} noValidate onSubmit={(e) => { e.preventDefault(); if (!method) return setMissing(true); if (method === "CARD" && !card) return setCardMissing(true); onNext(); }} className="flex flex-col gap-5">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 font-bold">¿Cómo querés pagar?</legend>
        {PAYMENT_METHODS.filter((v) => enabledMethods.includes(v)).map((v) => {
          const m = METHODS[v];
          return (
            <div key={v} className="flex flex-col gap-2">
              <OptionCard name="payment" value={v} checked={method === v} onChange={(x) => choose(x as PaymentMethod)}
                title={m.title} description={m.description} icon={<m.icon size={20} aria-hidden="true" />}
                aside={m.aside === "provider" ? <span className="text-xs font-bold text-muted">Checkout Pro</span> : m.aside && transferDiscountPct > 0 && <span className="text-success">{transferDiscountPct}% off</span>} />
              {v === "CARD" && method === "CARD" && <CardChoice value={card} missing={cardMissing} onChange={(c) => { patch({ card: c }); setCardMissing(false); }} />}
            </div>
          );
        })}
        {missing && <p role="alert" className="text-sm font-semibold text-danger">Elegí un medio de pago.</p>}
      </fieldset>
      <p className="rounded-2xl border border-dashed border-warning bg-warning-soft p-3 text-sm text-warning">
        <strong>Demo:</strong> ningún medio cobra de verdad. Vas a ver pantallas de muestra y no se redirige a Mercado Pago. Para la tarjeta usá la de prueba: no cargues una real.
      </p>
    </form>
    {before}
    <StepNav onBack={onBack} next="Revisar pedido" />
    </>
  );
}
