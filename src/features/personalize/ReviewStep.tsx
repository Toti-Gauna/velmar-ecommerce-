"use client";
import { Price } from "@/components/atoms/Price";
import { TextPreview } from "@/components/organisms/TextPreview";
import { FONT_FAMILIES } from "@/demo/fixtures/templates";
import { useDemoData } from "@/stores/admin";
import type { Product, Variant } from "@/demo/types";
import type { TextDraft } from "./TextEditor";

interface Props {
  product: Product;
  variant: Variant;
  price: number;
  text: TextDraft;
  photoPreview: string | null;
  reference: { thumbnail: string | null; notes: string };
  approved: boolean;
  onApprove: (v: boolean) => void;
}

export function ReviewStep({ product, variant, price, text, photoPreview, reference, approved, onApprove }: Props) {
  const kind = product.personalization!.kind;
  const zone = useDemoData((d) => d.textZones[product.art]);
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="w-full max-w-[420px]">
        {kind === "TEXT" && zone && (
          <TextPreview art={product.art} tint={variant.colorHex} text={text.text} fontFamily={FONT_FAMILIES[text.font]!} color={text.color} zone={zone} label={`Vista previa final de ${product.name}`} className="overflow-hidden rounded-[var(--radius-card)]" />
        )}
        {kind === "PHOTO" && photoPreview && (
          // eslint-disable-next-line @next/next/no-img-element -- data URL generado en el navegador
          <img src={photoPreview} alt={`Vista previa final de ${product.name} con tu foto`} className="w-full rounded-[var(--radius-card)]" />
        )}
        {kind === "PHOTO_REFERENCE" && reference.thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element -- data URL generado en el navegador
          <img src={reference.thumbnail} alt="Tu foto de referencia" className="aspect-square w-full rounded-[var(--radius-card)] object-cover" />
        )}
        <p className="mt-2 text-xs text-muted">Vista previa ilustrativa. Lo que apruebes es lo que recibe el taller.</p>
      </div>
      <div className="flex flex-col gap-4">
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-2xl border border-line bg-surface p-4 text-sm">
          <dt className="text-muted">Producto</dt><dd className="font-bold">{product.name}</dd>
          <dt className="text-muted">Opción</dt><dd className="font-bold">{variant.label}</dd>
          {kind === "TEXT" && (<><dt className="text-muted">Texto</dt><dd className="font-bold">“{text.text}” · {text.font} · {text.colorName}</dd></>)}
          {kind === "PHOTO" && (<><dt className="text-muted">Foto</dt><dd className="font-bold">Encuadre y zoom aprobados</dd></>)}
          {kind === "PHOTO_REFERENCE" && (<><dt className="text-muted">Notas</dt><dd className="font-bold">{reference.notes}</dd></>)}
          {product.madeToOrderDays && (<><dt className="text-muted">Plazo</dt><dd className="font-bold">{product.madeToOrderDays} días hábiles desde el pago</dd></>)}
        </dl>
        <Price amount={price} size="lg" />
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-primary bg-accent/40 p-4 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/50">
          <input type="checkbox" checked={approved} onChange={(e) => onApprove(e.target.checked)} className="mt-1 h-5 w-5 accent-[var(--color-primary)]" />
          <span><strong>Así lo quiero.</strong> Revisé la vista previa y la apruebo para fabricar.</span>
        </label>
      </div>
    </div>
  );
}
