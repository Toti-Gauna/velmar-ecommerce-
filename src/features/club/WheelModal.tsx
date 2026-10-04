"use client";
import { Sheet } from "@/components/motion/Sheet";
import { useUi } from "@/stores/ui";
import { WheelSpinner } from "./WheelSpinner";

export function WheelModal() {
  const { wheelOpen, setWheel } = useUi();
  return (
    <Sheet open={wheelOpen} onClose={() => setWheel(false)} title="Ruleta de cupones" side="center">
      <div className="px-6 pb-8 pt-10 text-center">
        <p className="eyebrow text-brass-ink">Club Velmar</p>
        <h2 className="font-display mt-2 text-4xl">Girá y ganá</h2>
        <p className="mx-auto mt-2 max-w-xs text-sm text-muted">Un cupón de un uso para tu próxima compra. Todos los premios ganan.</p>
        <div className="mt-8"><WheelSpinner onApplied={() => setWheel(false)} /></div>
      </div>
    </Sheet>
  );
}
