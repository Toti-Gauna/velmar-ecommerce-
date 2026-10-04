"use client";
import { Field, Textarea } from "@/components/atoms/Field";
import { ProductArt } from "@/components/illustrations/ProductArt";
import type { Product } from "@/demo/types";
import { PhotoInput } from "./PhotoInput";

export interface ReferenceDraft {
  thumbnail: string | null;
  notes: string;
  processing: boolean;
  error: string | null;
}

/** Foto de referencia + notas. No se renderiza: se muestra junto a un ejemplo de pieza anterior. */
export function ReferenceEditor({ product, draft, onFile, onNotes }: { product: Product; draft: ReferenceDraft; onFile: (f: File) => void; onNotes: (n: string) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3">
        <figure className="flex flex-col gap-1.5">
          <ProductArt art={product.art} label="Ejemplo de una pieza anterior" className="aspect-square rounded-2xl" />
          <figcaption className="text-xs text-muted">Ejemplo de pieza anterior</figcaption>
        </figure>
        <figure className="flex flex-col gap-1.5">
          <div className="grid aspect-square place-items-center overflow-hidden rounded-2xl bg-accent">
            {draft.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element -- data URL local, sin optimización posible
              <img src={draft.thumbnail} alt="Tu foto de referencia" className="h-full w-full object-cover" />
            ) : (
              <span className="p-4 text-center text-sm text-muted">{draft.processing ? "Procesando foto…" : "Tu foto va acá"}</span>
            )}
          </div>
          <figcaption className="text-xs text-muted">Tu referencia</figcaption>
        </figure>
      </div>
      <PhotoInput label="Foto de referencia" hint="JPG, PNG o WEBP de hasta 10 MB. Se procesa solo en tu navegador; en la demo no se sube." onFile={onFile} />
      {draft.error && <p role="alert" className="text-sm font-semibold text-danger">{draft.error}</p>}
      <Field id="p-notes" label="Notas para el taller" hint="Mínimo 10 caracteres.">
        <Textarea id="p-notes" value={draft.notes} onChange={(e) => onNotes(e.target.value)} placeholder={product.personalization?.notesPlaceholder} aria-describedby="p-notes-hint" maxLength={500} />
      </Field>
    </div>
  );
}
