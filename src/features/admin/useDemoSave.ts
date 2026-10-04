"use client";
import { useToasts } from "@/stores/toast";

/** Ejecuta un cambio del panel y avisa que vive solo en esta demo. */
export function useDemoSave() {
  const push = useToasts((s) => s.push);
  return (title: string, run: () => boolean | void) => {
    const ok = run();
    if (ok === false) return push({ tone: "error", title: "No se pudo aplicar", description: "Esa transición no corresponde al estado actual del pedido." });
    push({ tone: "success", title, description: "Cambio guardado solo en esta demo (este navegador)." });
  };
}
