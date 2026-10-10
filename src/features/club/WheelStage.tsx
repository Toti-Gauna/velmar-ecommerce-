"use client";
import dynamic from "next/dynamic";
import { useUi } from "@/stores/ui";

// El escenario de la ruleta (disco, cupón temático, motion) se descarga recién la primera vez que se abre.
const WheelStagePanel = dynamic(() => import("./WheelStagePanel"), { ssr: false });

/** Ruleta a pantalla completa: liviana en el layout de la tienda; el panel se carga al abrirla. */
export function WheelStage() {
  const { wheelOpen, wheelMode, setWheel } = useUi();
  if (!wheelOpen) return null;
  return <WheelStagePanel open checkout={wheelMode === "checkout"} onClose={() => setWheel(false)} />;
}
