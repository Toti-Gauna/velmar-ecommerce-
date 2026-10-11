"use client";
import { CalendarHeart, CheckCircle2, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Input } from "@/components/atoms/Field";
import { Switch } from "@/components/atoms/Switch";
import { PREHEADER_MAX, SUBJECT_MAX, type EmailCheck } from "@/demo/admin/emails/checks";
import type { RenderedEmail } from "@/demo/admin/emails/render";
import { TRIGGER_HINT, TRIGGER_LABEL, type EmailTemplate, type EmailToken, type EmailTrigger } from "@/demo/fixtures/emails";
import type { ArtKey } from "@/demo/types";
import { cn } from "@/lib/cn";
import { BlockList } from "./BlockList";
import { ChipEditor } from "./ChipEditor";
import { EMAIL_STEPS } from "./EmailStepper";
import { TokenPalette } from "./TokenPalette";

const FLOW: EmailTrigger[] = ["order-created", "custom-received", "payment-approved", "in-production", "ready", "shipped"];
const CARD = "flex flex-col gap-3 rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)] sm:p-5";
type Set = (p: Partial<EmailTemplate>) => void;

/** Paso 1: en qué momento sale (fijo para cada plantilla), si sale solo y cómo se llama en el panel. */
export function StepWhen({ draft, set }: { draft: EmailTemplate; set: Set }) {
  const pet = draft.trigger === "pet-birthday";
  return (
    <>
      <div className={CARD}>
        <h3 className="font-bold">Sale cuando: {TRIGGER_LABEL[draft.trigger]}</h3>
        <p className="text-sm text-muted">{TRIGGER_HINT[draft.trigger]} Cada plantilla tiene su momento: no hace falta programarlo.</p>
        {pet ? (
          <p className="flex items-center gap-2 rounded-2xl bg-bg p-3 text-sm font-semibold"><CalendarHeart size={18} aria-hidden="true" className="text-brass-ink" /> Una vez por año, el día del cumpleaños de cada mascota.</p>
        ) : (
          <ol aria-label="Momentos del pedido" className="flex flex-wrap gap-1.5">
            {FLOW.map((t, i) => (
              <li key={t} aria-current={t === draft.trigger ? "step" : undefined}
                className={cn("rounded-full px-3 py-1.5 text-xs font-bold", t === draft.trigger ? "bg-night text-[#f6f1e8]" : "bg-bg text-muted")}>{i + 1}. {TRIGGER_LABEL[t]}</li>
            ))}
          </ol>
        )}
      </div>
      <div className={CARD}>
        <Switch checked={draft.active} onChange={(active) => set({ active })} label={draft.active ? "Activo" : "Pausado"}
          description={draft.active ? "Sale solo en su momento." : "No sale hasta que lo actives. Igual podés mandar pruebas."} />
        <label className="flex flex-col gap-1 text-sm font-bold">Nombre interno
          <Input value={draft.name} onChange={(e) => set({ name: e.target.value })} aria-describedby="e-name-h" />
          <span id="e-name-h" className="text-xs font-normal text-muted">Solo lo ves vos, para reconocerlo en la lista. El cliente lee el asunto.</span>
        </label>
      </div>
    </>
  );
}

function Palette({ tokens }: { tokens: EmailToken[] }) {
  return (
    <section id="e-data" aria-labelledby="e-data-t" className="sticky top-[calc(7.25rem+env(safe-area-inset-top))] z-10 rounded-3xl bg-bg/95 p-3 ring-1 ring-ink/[0.06]">
      <h3 id="e-data-t" className="mb-2 text-sm font-extrabold">Datos del pedido y del cliente</h3>
      <TokenPalette tokens={tokens} />
      <p className="mt-2 hidden text-xs text-muted sm:block">Tocá un texto y después el dato: entra como ficha y en cada email se reemplaza por el valor real.</p>
    </section>
  );
}

function Counter({ n, max }: { n: number; max: number }) {
  return <span className={cn("text-xs font-bold tabular-nums", n > max ? "text-warning" : "text-muted")}>{n} / {max}</span>;
}

/** Paso 2: asunto y texto de vista previa, con cómo se ven en la bandeja de entrada de un celular. */
export function StepSubject({ draft, set, tokens, email }: { draft: EmailTemplate; set: Set; tokens: EmailToken[]; email: RenderedEmail }) {
  return (
    <>
      <Palette tokens={tokens} />
      <div className={CARD}>
        <div className="flex flex-col gap-1 text-sm font-bold">
          <span className="flex items-center justify-between gap-2">Asunto <Counter n={email.subject.trim().length} max={SUBJECT_MAX} /></span>
          <ChipEditor id="e-subject" label="Asunto" value={draft.subject} tokens={tokens} onChange={(subject) => set({ subject })} />
        </div>
        <div className="flex flex-col gap-1 text-sm font-bold">
          <span className="flex items-center justify-between gap-2">Texto de vista previa <Counter n={email.preheader.trim().length} max={PREHEADER_MAX} /></span>
          <ChipEditor id="e-preheader" label="Texto de vista previa" value={draft.preheader} tokens={tokens} placeholder="Lo que se lee al lado del asunto" onChange={(preheader) => set({ preheader })} />
        </div>
      </div>
      <figure className={CARD}>
        <figcaption className="text-sm font-bold">Así aparece en la bandeja del celular</figcaption>
        <div className="mx-auto w-full max-w-[380px] rounded-[1.75rem] bg-[#ece6da] p-2.5">
          <div className="flex gap-3 rounded-[1.25rem] bg-white p-3 text-left text-[#1c2016] shadow-sm">
            <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1c2016] font-display text-lg text-[#e8c98a]">V</span>
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-2"><span className="font-bold">Velmar</span><span className="text-xs text-[#6b675c]">ahora</span></span>
              <span className="block truncate text-sm font-semibold">{email.subject || "(sin asunto)"}</span>
              <span className="line-clamp-2 text-sm text-[#6b675c]">{email.preheader}</span>
            </span>
          </div>
        </div>
      </figure>
    </>
  );
}

/** Paso 3: los bloques del email, en orden, con las fichas de datos a mano. */
export function StepContent({ draft, set, tokens, hasOrder, arts }: { draft: EmailTemplate; set: Set; tokens: EmailToken[]; hasOrder: boolean; arts: { art: ArtKey; name: string }[] }) {
  return (
    <>
      <Palette tokens={tokens} />
      <div id="e-blocks"><BlockList blocks={draft.blocks} onChange={(blocks) => set({ blocks })} tokens={tokens} hasOrder={hasOrder} arts={arts} /></div>
    </>
  );
}

/** Paso 4: lo que conviene revisar (cada aviso lleva a su paso), la prueba y volver a la original. */
export function StepReview({ checks, onStep, children }: { checks: EmailCheck[]; onStep: (i: number) => void; children: ReactNode }) {
  return (
    <>
      <section aria-labelledby="e-checks" className={CARD}>
        <h3 id="e-checks" className="font-bold">Antes de dejarlo andando</h3>
        <ul className="flex flex-col gap-2">
          {checks.map((c) => {
            const at = EMAIL_STEPS.findIndex((s) => s.id === c.step);
            return (
              <li key={c.id} className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl p-3 text-sm font-semibold", c.ok ? "bg-success-soft text-success" : "bg-warning-soft text-warning")}>
                {c.ok ? <CheckCircle2 size={17} aria-hidden="true" className="shrink-0" /> : <TriangleAlert size={17} aria-hidden="true" className="shrink-0" />}
                <span className="min-w-0 flex-1 basis-48">{c.label}</span>
                {!c.ok && c.step !== "revisar" && <button type="button" onClick={() => onStep(at)} className="font-bold text-ink underline underline-offset-2">Ir a {EMAIL_STEPS[at]!.label}</button>}
              </li>
            );
          })}
        </ul>
      </section>
      {children}
    </>
  );
}
