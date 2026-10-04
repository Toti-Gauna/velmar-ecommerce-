"use client";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { Copy, Gift, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Celebration } from "@/components/molecules/Celebration";
import { pickSegment, prizeCoupon, rotationFor } from "@/demo/engine/wheel";
import { formatDate } from "@/lib/date";
import { useAccount } from "@/stores/account";
import { useAdmin, useDemoData } from "@/stores/admin";
import { useCart } from "@/stores/cart";
import { useToasts } from "@/stores/toast";
import { WheelDisc } from "./WheelDisc";

/** Ruleta de cupones. Demo: un giro por navegador; en producción el sorteo y el límite van en el servidor. */
export function WheelSpinner({ onApplied }: { onApplied?: () => void }) {
  const wheel = useDemoData((d) => d.wheel);
  const coupons = useDemoData((d) => d.coupons);
  const addPrizeCoupon = useAdmin((s) => s.addPrizeCoupon);
  const { wheelPrize, setWheelPrize } = useAccount();
  const setCoupon = useCart((s) => s.setCoupon);
  const toast = useToasts((s) => s.push);
  const reduce = useReducedMotion();
  const rotate = useMotionValue(0);
  const [spinning, setSpinning] = useState(false);
  const [justWon, setJustWon] = useState(false);
  const prize = wheelPrize ? coupons.find((c) => c.code === wheelPrize.code) : undefined;

  const spin = async () => {
    const pick = pickSegment(wheel);
    if (!pick || spinning || wheelPrize) return;
    setSpinning(true);
    const target = rotate.get() + rotationFor(pick.index, wheel.segments.length, 6, Math.random());
    await animate(rotate, target, { duration: reduce ? 0 : 4.8, ease: [0.12, 0.8, 0.1, 1] });
    const coupon = prizeCoupon(pick.segment, Math.random().toString(36).slice(2, 7), new Date(), wheel.validDays);
    addPrizeCoupon(coupon);
    setWheelPrize({ code: coupon.code, label: pick.segment.label, at: new Date().toISOString() });
    setSpinning(false);
    setJustWon(true);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative aspect-square w-full max-w-[340px]">
        <div aria-hidden="true" className="absolute -inset-3 rounded-full bg-[conic-gradient(from_0deg,#d2ad69,#8a6a2e,#d2ad69,#f6e7c4,#d2ad69)] p-[3px] shadow-[0_30px_60px_-30px_rgb(28_32_22/0.7)]">
          <div className="h-full w-full rounded-full bg-night" />
        </div>
        <motion.div style={{ rotate }} className="absolute inset-0"><WheelDisc segments={wheel.segments} /></motion.div>
        <div aria-hidden="true" className="absolute left-1/2 top-[-14px] z-10 h-0 w-0 -translate-x-1/2 border-x-[14px] border-t-[26px] border-x-transparent border-t-brass drop-shadow" />
        <div aria-hidden="true" className="absolute inset-[38%] grid place-items-center rounded-full border-4 border-brass bg-night">
          <svg viewBox="0 0 48 44" className="h-1/2 w-1/2 text-brass"><path d="M8 22 24 8l16 14M8 36 24 22l16 14" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
      <div aria-live="polite" className="relative w-full max-w-sm text-center">
        {wheelPrize ? (
          <div className="rounded-3xl bg-surface p-5 shadow-[var(--shadow-card)]">
            {justWon && <Celebration />}
            <p className="eyebrow text-brass-ink">{justWon ? "¡Ganaste!" : "Tu premio"}</p>
            <p className="font-display mt-1 text-3xl">{wheelPrize.label}</p>
            <p className="mt-1 text-sm text-muted">{prize?.description}{prize?.endsAt ? ` · vence ${formatDate(prize.endsAt)}` : ""} · 1 uso</p>
            <button type="button" onClick={() => { void navigator.clipboard?.writeText(wheelPrize.code); toast({ tone: "success", title: "Código copiado", description: wheelPrize.code }); }}
              className="mx-auto mt-3 flex items-center gap-2 rounded-full border border-dashed border-brass-ink px-4 py-2 font-mono text-lg font-extrabold tracking-wider" aria-label={`Copiar código ${wheelPrize.code}`}>
              {wheelPrize.code} <Copy size={16} aria-hidden="true" />
            </button>
            <Button className="mt-4 w-full" onClick={() => { setCoupon(wheelPrize.code); toast({ tone: "success", title: "Cupón listo en tu carrito", description: wheelPrize.code, action: { label: "Ver carrito", href: "/carrito/" } }); onApplied?.(); }}>
              <ShoppingBag size={18} aria-hidden="true" /> Aplicar a mi carrito
            </Button>
          </div>
        ) : (
          <>
            <Button size="lg" onClick={spin} disabled={spinning || !wheel.active} className="w-full">
              <Gift size={18} aria-hidden="true" /> {spinning ? "Girando…" : wheel.active ? "Girar la ruleta" : "Ruleta pausada"}
            </Button>
            <p className="mt-3 text-xs text-muted">Demo: un giro por navegador (se reinicia con “Reiniciar demo”). En producción, un giro por cuenta y sorteo en el servidor.</p>
          </>
        )}
      </div>
    </div>
  );
}
