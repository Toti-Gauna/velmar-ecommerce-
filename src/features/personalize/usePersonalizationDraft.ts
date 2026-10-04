"use client";
import type Konva from "konva";
import { useEffect, useRef, useState } from "react";
import type { LinePersonalization } from "@/demo/engine/cart-types";
import { validateText } from "@/demo/engine/personalization";
import type { PersonalizationTemplate } from "@/demo/types";
import type { PhotoDraft } from "./PhotoControls";
import type { TextDraft } from "./TextFields";
import { useReferenceDraft } from "./useReferenceDraft";

/**
 * Borrador de personalización de la ficha. Cualquier cambio en el diseño desmarca "Así lo quiero":
 * lo aprobado es siempre exactamente lo que llega al carrito.
 */
export function usePersonalizationDraft(tmpl: PersonalizationTemplate | undefined) {
  const firstColor = tmpl?.colors?.[0];
  const [text, setTextState] = useState<TextDraft>({ text: "", font: tmpl?.fonts?.[0] ?? "Redondeada", color: firstColor?.hex ?? "#3a4527", colorName: firstColor?.name ?? "" });
  const [photo, setPhotoState] = useState<PhotoDraft>({ url: null, zoom: 1, offset: { x: 0, y: 0 } });
  const ref = useReferenceDraft();
  const [approved, setApproved] = useState(false);
  const [touched, setTouched] = useState(false);
  const stageRef = useRef<Konva.Stage | null>(null);
  useEffect(() => () => { if (photo.url) URL.revokeObjectURL(photo.url); }, [photo.url]);

  const problem = !tmpl ? null
    : tmpl.kind === "TEXT" ? validateText(text.text, tmpl.maxChars ?? 12)
    : tmpl.kind === "PHOTO" ? (photo.url ? null : "Subí una foto para armar la vista previa.")
    : !ref.draft.thumbnail ? "Subí la foto de referencia." : ref.draft.notes.trim().length < 10 ? "Contanos un poco más en las notas (mínimo 10 caracteres)." : null;

  const build = (): LinePersonalization | undefined => {
    if (!tmpl) return undefined;
    return {
      kind: tmpl.kind, approvedAt: new Date().toISOString(),
      ...(tmpl.kind === "TEXT" && { text: text.text, font: text.font, color: text.color, colorName: text.colorName }),
      ...(tmpl.kind === "PHOTO" && { previewDataUrl: stageRef.current?.toDataURL({ mimeType: "image/jpeg", quality: 0.85, pixelRatio: 1 }) }),
      ...(tmpl.kind === "PHOTO_REFERENCE" && { notes: ref.draft.notes.trim(), referenceDataUrl: ref.draft.thumbnail ?? undefined }),
    };
  };

  return {
    tmpl, text, photo, reference: ref.draft, approved, touched, problem, stageRef,
    setText: (d: TextDraft) => { setTextState(d); setApproved(false); },
    setPhoto: (d: PhotoDraft) => { setPhotoState(d); setApproved(false); },
    onReferenceFile: (f: File) => { setApproved(false); return ref.onFile(f); },
    setNotes: (n: string) => { ref.setNotes(n); setApproved(false); },
    setApproved,
    touch: () => setTouched(true),
    build,
  };
}

export type PersonalizationDraft = ReturnType<typeof usePersonalizationDraft>;
