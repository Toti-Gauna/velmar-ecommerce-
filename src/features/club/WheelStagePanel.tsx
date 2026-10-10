"use client";
import { BookmarkPlus, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { ImmersiveStage } from "@/components/motion/ImmersiveStage";
import { Celebration } from "@/components/molecules/Celebration";
import { useCart } from "@/stores/cart";
import { useToasts } from "@/stores/toast";
import { occasionColors } from "../gifts/occasion";
import { useCurrentTheme } from "../themes/useCurrentTheme";
import { ThemedCoupon } from "./ThemedCoupon";
import { useWheelSpin } from "./useWheelSpin";
import { WheelDial } from "./WheelDial";

/**
 * Ruleta a pantalla completa (pedido de Ignacio): todo se oscurece y queda solo la ruleta, entera en la pantalla.
 * Al ganar, la ruleta da paso al cupón de la festividad con "Aplicar ahora", "Guardar para después" y "Salir".
 * En modo "checkout" (al ir a pagar) aplicar o guardar siguen al pago.
 */
export default function WheelStagePanel({ open, checkout, onClose }: { open: boolean; checkout: boolean; onClose: () => void }) {
  const router = useRouter();
  const { theme } = useCurrentTheme();
  const occasion = theme?.id ?? "velmar";
  const colors = occasionColors(occasion);
  const state = useWheelSpin();
  const setCoupon = useCart((s) => s.setCoupon);
  const toast = useToasts((s) => s.push);
  const { shown, prize, spinning, justWon, wheel } = state;
  const next = () => { onClose(); if (checkout) router.push("/checkout/"); };
  const apply = () => {
    if (!shown) return;
    setCoupon(shown.code);
    toast({ tone: "success", title: "Cupón aplicado a tu carrito", description: shown.code, ...(checkout ? {} : { action: { label: "Ver carrito", href: "/carrito/" } }) });
    next();
  };
  const keep = () => {
    if (!shown) return;
    toast({ tone: "info", title: "Guardado en Mis cupones", description: shown.code, action: { label: "Ver cupones", href: "/cupones/" } });
    next();
  };
  return (
    <ImmersiveStage open={open} onClose={onClose} label="Ruleta de cupones" glow={[colors.from, colors.to]} lockExit={spinning}>
      {shown ? (
        <div aria-live="polite" className="wheel-win relative flex w-full max-w-md flex-col items-center text-center">
          {justWon && <Celebration />}
          <p className="eyebrow text-[#f3dca6]">{justWon ? "¡Ganaste!" : "Tu premio"}</p>
          <h2 className="font-display mb-6 mt-2 text-[clamp(1.9rem,8vw,2.6rem)] leading-tight">{shown.label}</h2>
          <ThemedCoupon coupon={prize} label={shown.label} occasion={occasion} />
          <div className="mt-7 grid w-full gap-2">
            <button type="button" onClick={apply} className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#f3dca6] px-6 text-base font-bold text-night hover:brightness-105">
              <ShoppingBag size={18} aria-hidden="true" /> Aplicar ahora
            </button>
            <button type="button" onClick={keep} className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-white/10 px-6 font-bold text-[#f6f1e8] ring-1 ring-white/15 hover:bg-white/20">
              <BookmarkPlus size={18} aria-hidden="true" /> Guardar para después
            </button>
            <button type="button" onClick={onClose} className="min-h-11 rounded-full px-6 text-sm font-semibold text-[#cfc6b3] hover:text-white">Salir</button>
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center text-center">
          <p className="eyebrow text-[#f3dca6]">{checkout ? "Antes de pagar" : "Club Velmar"}</p>
          <h2 className="font-display mt-1 text-[clamp(1.7rem,7vw,2.4rem)] leading-tight">{checkout ? "Probá tu suerte" : "Girá y ganá"}</h2>
          <WheelDial state={state} discRef={state.bindDisc} segments={wheel.segments} className="mt-8 w-[min(80vw,52dvh,440px)]" />
          <p aria-live="polite" className="mt-8 min-h-[1.25rem] text-sm font-semibold text-[#cfc6b3]">
            {spinning ? "Girando…" : wheel.active ? "Tocá el centro o arrastrá la ruleta para girarla" : "La ruleta está pausada"}
          </p>
          {checkout && !spinning && <button type="button" onClick={next} className="mt-2 min-h-11 rounded-full px-5 text-sm font-semibold text-[#cfc6b3] underline-offset-4 hover:text-white hover:underline">Continuar sin girar</button>}
        </div>
      )}
    </ImmersiveStage>
  );
}
