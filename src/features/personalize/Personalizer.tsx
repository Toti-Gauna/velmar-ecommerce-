"use client";
import type Konva from "konva";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { AvailabilityNote } from "@/components/molecules/AvailabilityNote";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { StepIndicator } from "@/components/molecules/StepIndicator";
import { VariantPicker } from "@/components/molecules/VariantPicker";
import { availability, isPurchasable, unitPrice } from "@/demo/engine/catalog";
import { validateText } from "@/demo/engine/personalization";
import type { Product } from "@/demo/types";
import { formatARS } from "@/lib/money";
import { useDemoData } from "@/stores/admin";
import { useCart } from "@/stores/cart";
import { useToasts } from "@/stores/toast";
import { useVariantSelection } from "../product/useVariantSelection";
import { PhotoEditor, type PhotoDraft } from "./PhotoEditor";
import { ReviewStep } from "./ReviewStep";
import { TextEditor, type TextDraft } from "./TextEditor";
import { useReferenceDraft } from "./useReferenceDraft";
import { ReferenceEditor } from "./ReferenceEditor";

const STEPS = ["Opción", "Personalizar", "Revisar y aprobar"];

export function Personalizer({ product: initial }: { product: Product }) {
  const product = useDemoData((d) => d.products.find((p) => p.slug === initial.slug)) ?? initial;
  const tmpl = product.personalization ?? initial.personalization!;
  const router = useRouter();
  const sel = useVariantSelection(product, useSearchParams().get("variante"));
  const [step, setStep] = useState(0);
  const [touched, setTouched] = useState(false);
  const firstColor = tmpl.colors?.[0];
  const [text, setText] = useState<TextDraft>({ text: "", font: tmpl.fonts?.[0] ?? "Redondeada", color: firstColor?.hex ?? "#3d4a2a", colorName: firstColor?.name ?? "" });
  const [photo, setPhoto] = useState<PhotoDraft>({ url: null, zoom: 1, offset: { x: 0, y: 0 } });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const ref = useReferenceDraft();
  const [approved, setApproved] = useState(false);
  const stageRef = useRef<Konva.Stage | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const add = useCart((s) => s.add);
  const toast = useToasts((s) => s.push);
  const price = unitPrice(product, sel.variant, true);

  useEffect(() => heading.current?.focus(), [step]);
  useEffect(() => () => { if (photo.url) URL.revokeObjectURL(photo.url); }, [photo.url]);

  const editorProblem =
    tmpl.kind === "TEXT" ? validateText(text.text, tmpl.maxChars ?? 12)
    : tmpl.kind === "PHOTO" ? (photo.url ? null : "Subí una foto para continuar.")
    : !ref.draft.thumbnail ? "Subí la foto de referencia." : ref.draft.notes.trim().length < 10 ? "Contanos un poco más en las notas (mínimo 10 caracteres)." : null;

  const next = () => {
    if (step === 0) return setStep(1);
    setTouched(true);
    if (editorProblem) return;
    if (tmpl.kind === "PHOTO") setPhotoPreview(stageRef.current?.toDataURL({ mimeType: "image/jpeg", quality: 0.85, pixelRatio: 1 }) ?? null);
    setApproved(false);
    setStep(2);
  };

  const addToCart = () => {
    add({
      productSlug: product.slug, variantId: sel.variant.id, quantity: 1,
      personalization: {
        kind: tmpl.kind, approvedAt: new Date().toISOString(),
        ...(tmpl.kind === "TEXT" && { text: text.text, font: text.font, color: text.color, colorName: text.colorName }),
        ...(tmpl.kind === "PHOTO" && { previewDataUrl: photoPreview ?? undefined }),
        ...(tmpl.kind === "PHOTO_REFERENCE" && { notes: ref.draft.notes.trim(), referenceDataUrl: ref.draft.thumbnail ?? undefined }),
      },
    });
    toast({ tone: "success", title: "Pieza aprobada y agregada", description: product.name, action: { label: "Ver carrito", href: "/carrito/" } });
    router.push("/carrito/");
  };

  return (
    <div className="flex flex-col gap-6">
      <StepIndicator steps={STEPS} current={step} />
      <h2 ref={heading} tabIndex={-1} className="text-xl font-extrabold focus:outline-none">Paso {step + 1}: {STEPS[step]}</h2>
      <div key={step} className="animate-fade-up">
        {step === 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            <ProductArt art={product.art} tint={sel.variant.colorHex} label={product.name} className="aspect-square w-full max-w-[420px] rounded-[var(--radius-card)]" />
            <div className="flex flex-col gap-5">
            {sel.colorOptions.length > 0 && <VariantPicker legend="Color" options={sel.colorOptions} value={sel.color} onChange={sel.chooseColor} swatches />}
            {sel.sizeOptions.length > 0 && <VariantPicker legend="Opción" options={sel.sizeOptions} value={sel.size} onChange={sel.chooseSize} />}
            <AvailabilityNote availability={availability(product, sel.variant)} />
            <p className="text-lg font-extrabold">{formatARS(price)}</p>
            </div>
          </div>
        )}
        {step === 1 && tmpl.kind === "TEXT" && <TextEditor product={product} template={tmpl} tint={sel.variant.colorHex} draft={text} onChange={setText} touched={touched} />}
        {step === 1 && tmpl.kind === "PHOTO" && <PhotoEditor draft={photo} onChange={setPhoto} stageRef={stageRef} mask={tmpl.mask ?? "arch"} />}
        {step === 1 && tmpl.kind === "PHOTO_REFERENCE" && <ReferenceEditor product={product} draft={ref.draft} onFile={ref.onFile} onNotes={ref.setNotes} />}
        {step === 2 && <ReviewStep product={product} variant={sel.variant} price={price} text={text} photoPreview={photoPreview} reference={ref.draft} approved={approved} onApprove={setApproved} />}
      </div>
      {step === 1 && touched && editorProblem && tmpl.kind !== "TEXT" && <p role="alert" className="text-sm font-semibold text-danger">{editorProblem}</p>}
      <div className="flex flex-wrap gap-3 border-t border-line pt-5">
        {step > 0 && <Button variant="secondary" onClick={() => setStep(step - 1)}>{step === 2 ? "Volver a editar" : "Atrás"}</Button>}
        {step < 2 ? (
          <Button onClick={next} disabled={step === 0 && !isPurchasable(sel.variant, 1)}>{step === 0 ? "Siguiente: personalizar" : "Ver vista previa final"}</Button>
        ) : (
          <Button onClick={addToCart} disabled={!approved}>Agregar al carrito</Button>
        )}
      </div>
      {step === 2 && !approved && <p className="-mt-3 text-sm text-muted">Marcá “Así lo quiero” para agregar al carrito.</p>}
    </div>
  );
}
