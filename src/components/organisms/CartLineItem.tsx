import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { LinePersonalization } from "@/demo/engine/cart-types";
import type { ArtKey } from "@/demo/types";
import type { TextZone } from "@/demo/fixtures/templates";
import { formatARS } from "@/lib/money";
import { QuantityStepper } from "@/components/molecules/QuantityStepper";
import { LineThumb } from "./LineThumb";

export interface CartLineView {
  id: string;
  slug: string;
  name: string;
  variantLabel: string;
  art: ArtKey;
  tint?: string;
  unitPrice: number;
  lineTotal: number;
  quantity: number;
  maxQuantity: number;
  personalization?: LinePersonalization;
  zone?: TextZone;
  photoUrl?: string;
}

const KIND = { TEXT: "Texto", PHOTO: "Con tu foto", PHOTO_REFERENCE: "Desde foto de referencia" };

export function CartLineItem({ line, onQuantity, onRemove }: { line: CartLineView; onQuantity: (q: number) => void; onRemove: () => void }) {
  const p = line.personalization;
  return (
    <li className="animate-fade-up flex gap-3 rounded-2xl border border-line bg-surface p-3 sm:gap-4 sm:p-4">
      <div className="w-24 shrink-0 sm:w-28"><LineThumb art={line.art} tint={line.tint} name={line.name} personalization={p} zone={line.zone} /></div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link href={`/p/${line.slug}/`} className="font-bold leading-snug hover:underline">{line.name}</Link>
        <p className="text-sm text-muted">{line.variantLabel}</p>
        {p && (
          <p className="text-sm">
            <span className="font-bold text-success">✓ Vista previa aprobada</span> · {KIND[p.kind]}
            {p.text && <> · “{p.text}” ({p.font}, {p.colorName})</>}
            {p.notes && <span className="block truncate text-muted">Notas: {p.notes}</span>}
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
          <QuantityStepper label={`Cantidad de ${line.name}`} value={line.quantity} max={line.maxQuantity} onChange={onQuantity} />
          <div className="text-right">
            <p className="font-extrabold tabular-nums">{formatARS(line.lineTotal)}</p>
            {line.quantity > 1 && <p className="text-xs text-muted">{formatARS(line.unitPrice)} c/u</p>}
          </div>
        </div>
      </div>
      <button type="button" onClick={onRemove} aria-label={`Quitar ${line.name}`} className="grid h-10 w-10 shrink-0 place-items-center self-start rounded-full text-danger hover:bg-danger-soft">
        <Trash2 size={18} aria-hidden="true" />
      </button>
    </li>
  );
}
