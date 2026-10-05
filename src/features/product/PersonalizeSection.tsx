"use client";
import { Check, Sparkles } from "lucide-react";
import type { Product } from "@/demo/types";
import { cn } from "@/lib/cn";
import { formatARS } from "@/lib/money";
import { PhotoControls } from "../personalize/PhotoControls";
import { ReferenceFields } from "../personalize/ReferenceFields";
import { TextFields } from "../personalize/TextFields";
import type { PersonalizationDraft } from "../personalize/usePersonalizationDraft";

const TITLE = { TEXT: "Escribí tu nombre", PHOTO: "Subí tu foto", PHOTO_REFERENCE: "Contanos cómo lo querés" };

/** Personalización en la misma ficha: campos + aprobación "Así lo quiero" (obligatoria para comprar). */
export function PersonalizeSection({ product, draft, needApproval }: { product: Product; draft: PersonalizationDraft; needApproval: boolean }) {
  const tmpl = draft.tmpl!;
  const ready = !draft.problem;
  return (
    <section id="personalizar" aria-labelledby="personalizar-title" className="scroll-mt-28 rounded-[1.75rem] border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-night text-brass"><Sparkles size={18} aria-hidden="true" /></span>
        <div>
          <h2 id="personalizar-title" className="font-display text-2xl leading-tight">{TITLE[tmpl.kind]}</h2>
          <p className="text-sm text-muted">La vista previa se actualiza en vivo{tmpl.surcharge > 0 ? ` · personalización ${formatARS(tmpl.surcharge)} incluida` : ""}.</p>
        </div>
      </div>
      {tmpl.kind === "TEXT" && <TextFields template={tmpl} draft={draft.text} onChange={draft.setText} touched={draft.touched} />}
      {tmpl.kind === "PHOTO" && <PhotoControls draft={draft.photo} onChange={draft.setPhoto} />}
      {tmpl.kind === "PHOTO_REFERENCE" && <ReferenceFields product={product} draft={draft.reference} onFile={draft.onReferenceFile} onNotes={draft.setNotes} />}
      {draft.touched && draft.problem && tmpl.kind !== "TEXT" && <p role="alert" className="mt-4 text-sm font-semibold text-danger">{draft.problem}</p>}
      <label className={cn(
        "mt-5 flex items-start gap-3 rounded-2xl border-2 p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/50",
        draft.approved ? "border-success bg-success-soft" : needApproval ? "border-danger bg-danger-soft" : "border-line bg-bg",
        ready ? "cursor-pointer" : "cursor-not-allowed opacity-60",
      )}>
        <input id="aprobar" type="checkbox" checked={draft.approved} disabled={!ready} onChange={(e) => draft.setApproved(e.target.checked)} className="peer sr-only" />
        <span aria-hidden="true" className={cn("mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 transition-colors", draft.approved ? "border-success bg-success text-white" : "border-ink/30 bg-surface")}>
          {draft.approved && <Check size={15} strokeWidth={3} />}
        </span>
        <span className="text-sm">
          <strong className="text-base">Así lo quiero.</strong> Revisé la vista previa y la apruebo para fabricar.
          {!ready && <span className="block text-muted">Completá la personalización para aprobarla.</span>}
          {ready && needApproval && !draft.approved && <span role="alert" className="block font-semibold text-danger">Aprobá la vista previa para continuar.</span>}
        </span>
      </label>
    </section>
  );
}
