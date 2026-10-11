import type { ReactNode } from "react";
import { Button } from "@/components/atoms/Button";

/** El formulario del paso actual: los botones van afuera (debajo del resumen) y lo envían por su `id`. */
export const STEP_FORM = "checkout-paso";

/**
 * Atrás / Siguiente de cada paso del checkout. 8.4.5 (pedido de Ignacio, revierte 8.2.9): primero se ven el cupón y el
 * resumen con el total, y recién después los botones, como en cualquier tienda.
 */
export function StepNav({ onBack, next, big }: { onBack?: () => void; next: ReactNode; big?: boolean }) {
  return (
    <div className="flex flex-wrap gap-3">
      {onBack && <Button variant="secondary" data-sound="none" onClick={onBack}>Atrás</Button>}
      <Button type="submit" form={STEP_FORM} data-sound="none" size={big ? "lg" : undefined}>{next}</Button>
    </div>
  );
}
