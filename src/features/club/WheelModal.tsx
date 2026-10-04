"use client";
import { useRouter } from "next/navigation";
import { Sheet } from "@/components/motion/Sheet";
import { useUi } from "@/stores/ui";
import { WheelSpinner } from "./WheelSpinner";

/** Ruleta en modal. En modo "checkout" aparece al ir a pagar y, al cerrar, continúa al checkout. */
export function WheelModal() {
  const { wheelOpen, wheelMode, setWheel } = useUi();
  const router = useRouter();
  const checkout = wheelMode === "checkout";
  const close = () => setWheel(false);
  const continueToCheckout = () => { setWheel(false); router.push("/checkout/"); };
  return (
    <Sheet open={wheelOpen} onClose={close} title="Ruleta de cupones" side="center">
      <div className="px-6 pb-8 pt-10 text-center">
        <p className="eyebrow text-brass-ink">{checkout ? "Antes de pagar" : "Club Velmar"}</p>
        <h2 className="font-display mt-2 text-4xl">{checkout ? "Probá tu suerte" : "Girá y ganá"}</h2>
        <p className="mx-auto mt-2 max-w-xs text-sm text-muted">{checkout ? "Un giro gratis: si te toca un descuento, lo aplicás ahora o lo guardás para más tarde." : "Un cupón de un uso para tu próxima compra. Todos los premios ganan."}</p>
        <div className="mt-8">
          <WheelSpinner checkout={checkout} onApplied={checkout ? continueToCheckout : close} onSaved={checkout ? continueToCheckout : close} onSkip={checkout ? continueToCheckout : undefined} />
        </div>
      </div>
    </Sheet>
  );
}
