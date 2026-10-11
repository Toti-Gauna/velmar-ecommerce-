"use client";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/atoms/Button";
import type { EmailStepId } from "@/demo/admin/emails/checks";
import { cn } from "@/lib/cn";

export const EMAIL_STEPS: { id: EmailStepId; label: string; hint: string }[] = [
  { id: "cuando", label: "Cuándo se envía", hint: "Momento y nombre" },
  { id: "asunto", label: "Asunto", hint: "Lo primero que lee" },
  { id: "contenido", label: "Contenido", hint: "Bloques y datos" },
  { id: "revisar", label: "Revisar y probar", hint: "Prueba y guardar" },
];

/** Los cuatro pasos del editor (8.4.19): se puede saltar a cualquiera; los listos llevan un tilde. */
export function EmailStepper({ step, done, onStep }: { step: number; done: Record<EmailStepId, boolean>; onStep: (i: number) => void }) {
  return (
    <nav aria-label="Pasos del editor">
      <ol className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {EMAIL_STEPS.map((s, i) => {
          const current = step === i, ok = done[s.id];
          return (
            <li key={s.id} className="min-w-0">
              <button type="button" onClick={() => onStep(i)} aria-current={current ? "step" : undefined}
                className={cn("flex h-full w-full items-center justify-center gap-2.5 rounded-2xl p-2 text-left transition-colors sm:justify-start sm:p-3",
                  current ? "bg-night text-[#f6f1e8] shadow-[var(--shadow-lift)]" : "bg-surface shadow-[var(--shadow-card)] hover:bg-accent/60")}>
                <span aria-hidden="true" className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-extrabold",
                  current ? "bg-brass text-night" : ok ? "bg-success-soft text-success" : "bg-bg text-muted")}>
                  {ok && !current ? <Check size={15} strokeWidth={3} /> : i + 1}
                </span>
                <span className="sr-only">Paso {i + 1}: </span>
                <span className="hidden min-w-0 md:block">
                  <span className="block truncate text-sm font-bold">{s.label}</span>
                  <span className={cn("block truncate text-xs", current ? "text-[#cfc6b3]" : "text-muted")}>{s.hint}</span>
                </span>
                <span className="sr-only md:hidden">{s.label}</span>
                {ok && <span className="sr-only"> (listo)</span>}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Abajo de cada paso: volver, seguir al próximo y, en el último, las acciones finales. */
export function StepFooter({ step, onStep, children }: { step: number; onStep: (i: number) => void; children?: ReactNode }) {
  const next = EMAIL_STEPS[step + 1];
  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
      {step > 0 && <Button variant="ghost" onClick={() => onStep(step - 1)}><ArrowLeft size={16} aria-hidden="true" /> Atrás</Button>}
      <span className="ml-auto flex flex-wrap justify-end gap-2">
        {children}
        {next && <Button onClick={() => onStep(step + 1)}>Siguiente: {next.label} <ArrowRight size={16} aria-hidden="true" /></Button>}
      </span>
    </div>
  );
}
