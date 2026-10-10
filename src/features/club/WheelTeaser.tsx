"use client";
import { Gift } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { CouponTicket } from "@/components/molecules/CouponTicket";
import { useAccount } from "@/stores/account";
import { useDemoData } from "@/stores/admin";
import { useHydrated } from "@/stores/hydration";
import { useUi } from "@/stores/ui";
import { WheelDial } from "./WheelDial";

/** La ruleta en la página del club: vista quieta y el botón que la abre a pantalla completa (o el premio ya ganado). */
export function WheelTeaser() {
  const hydrated = useHydrated();
  const wheel = useDemoData((d) => d.wheel);
  const coupons = useDemoData((d) => d.coupons);
  const prize = useAccount((s) => s.wheelPrize);
  const setWheel = useUi((s) => s.setWheel);
  const coupon = prize ? coupons.find((c) => c.code === prize.code) : undefined;
  return (
    <div className="flex flex-col items-center gap-6">
      <button type="button" tabIndex={-1} aria-hidden="true" onClick={() => setWheel(true)} className="w-full max-w-[300px] transition-transform hover:scale-[1.02]">
        <WheelDial segments={wheel.segments} className="w-full" />
      </button>
      {hydrated && prize ? (
        <div className="w-full max-w-sm">
          <p className="eyebrow mb-2 text-center text-brass-ink">Tu premio</p>
          {coupon && <CouponTicket coupon={coupon} badge="Ruleta" meta="1 uso" />}
          <Button variant="secondary" className="mt-3 w-full" onClick={() => setWheel(true)}>Ver mi premio</Button>
        </div>
      ) : (
        <Button size="lg" className="w-full max-w-sm" disabled={!wheel.active} onClick={() => setWheel(true)}>
          <Gift size={18} aria-hidden="true" /> {wheel.active ? "Girar la ruleta" : "Ruleta pausada"}
        </Button>
      )}
      <p className="max-w-sm text-center text-xs text-muted">Demo: un giro por navegador (se reinicia con “Reiniciar demo”). En producción, un giro por cuenta y sorteo en el servidor.</p>
    </div>
  );
}
