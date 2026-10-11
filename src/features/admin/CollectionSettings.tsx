"use client";
import { CollectionEditor } from "./payments/CollectionEditor";

/** Ajustes → Datos de cobro: el mismo editor (y la misma fuente) que abre "Configurar datos de cobro" en Pagos (8.3.30). */
export function CollectionSettings() {
  return (
    <section aria-labelledby="col-title" className="flex flex-col gap-3 rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]">
      <h2 id="col-title" className="font-extrabold">Datos de cobro (muestra)</h2>
      <CollectionEditor />
    </section>
  );
}
