"use client";
import { Field, Input } from "@/components/atoms/Field";
import { TextPreview } from "@/components/organisms/TextPreview";
import { validateText } from "@/demo/engine/personalization";
import { FONT_FAMILIES } from "@/demo/fixtures/templates";
import { useDemoData } from "@/stores/admin";
import type { PersonalizationTemplate, Product } from "@/demo/types";
import { cn } from "@/lib/cn";

export interface TextDraft {
  text: string;
  font: string;
  color: string;
  colorName: string;
}

interface Props { product: Product; template: PersonalizationTemplate; tint?: string; draft: TextDraft; onChange: (d: TextDraft) => void; touched: boolean }

export function TextEditor({ product, template: tmpl, tint, draft, onChange, touched }: Props) {
  const zones = useDemoData((d) => d.textZones);
  const max = tmpl.maxChars ?? 12;
  const error = draft.text || touched ? validateText(draft.text, max) : null;
  const zone = zones[product.art] ?? { x: 100, y: 180, w: 200, h: 40, cover: "#ffffff" };
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <TextPreview art={product.art} tint={tint} text={draft.text || "Tu texto"} fontFamily={FONT_FAMILIES[draft.font] ?? FONT_FAMILIES.Redondeada!} color={draft.color} zone={zone} label={`Vista previa de ${product.name}`} className="w-full max-w-[420px] overflow-hidden rounded-[var(--radius-card)]" />
      <div className="flex flex-col gap-5">
        <Field id="p-text" label="Texto" hint={`Hasta ${max} caracteres. Acentos y ñ permitidos.`} error={error ?? undefined}>
          <Input id="p-text" value={draft.text} maxLength={max + 4} autoComplete="off" aria-invalid={Boolean(error)} aria-describedby={error ? "p-text-error" : "p-text-hint"}
            onChange={(e) => onChange({ ...draft, text: e.target.value })} placeholder="Ej.: Ñoqui" />
        </Field>
        <p className="-mt-3 text-right text-xs tabular-nums text-muted" aria-live="polite">{[...draft.text].length}/{max}</p>
        <fieldset>
          <legend className="mb-2 text-sm font-bold">Fuente</legend>
          <div className="flex flex-wrap gap-2">
            {(tmpl.fonts ?? []).map((f) => (
              <label key={f} className={cn("cursor-pointer rounded-full border-2 px-4 py-2 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/50", draft.font === f ? "border-primary bg-accent/50" : "border-line bg-surface")} style={{ fontFamily: FONT_FAMILIES[f] }}>
                <input type="radio" name="font" className="sr-only" checked={draft.font === f} onChange={() => onChange({ ...draft, font: f })} />
                <span className="text-lg font-bold">{f}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-sm font-bold">Color: <span className="font-semibold text-muted">{draft.colorName}</span></legend>
          <div className="flex flex-wrap gap-2">
            {(tmpl.colors ?? []).map((c) => (
              <label key={c.hex} title={c.name} className={cn("grid h-11 w-11 cursor-pointer place-items-center rounded-full border-2 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/50", draft.color === c.hex ? "border-primary" : "border-transparent")}>
                <input type="radio" name="color" className="sr-only" checked={draft.color === c.hex} onChange={() => onChange({ ...draft, color: c.hex, colorName: c.name })} />
                <span aria-hidden="true" className="h-8 w-8 rounded-full border border-black/15" style={{ background: c.hex }} />
                <span className="sr-only">{c.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
}
