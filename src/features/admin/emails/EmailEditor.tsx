"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/molecules/EmptyState";
import { emailChecks, stepsDone } from "@/demo/admin/emails/checks";
import { contextForOrder, petSampleContext, renderEmail, sampleOrder, type EmailContext } from "@/demo/admin/emails/render";
import { ORDER_TOKENS, TOKEN_LABEL, type EmailTemplate, type EmailToken } from "@/demo/fixtures/emails";
import { useAdmin } from "@/stores/admin";
import { playSound } from "@/lib/sound";
import { useSessionDraft } from "../useSessionDraft";
import { ChipEditorsProvider } from "./ChipEditor";
import { EditorHeader, FinishButton, PreviewButton, ReviewActions } from "./EmailEditorParts";
import { EmailLivePreview, type Device } from "./EmailLivePreview";
import { EMAIL_STEPS, EmailStepper, StepFooter } from "./EmailStepper";
import { StepContent, StepReview, StepSubject, StepWhen } from "./EmailSteps";

const ALL_TOKENS = Object.keys(TOKEN_LABEL) as EmailToken[];
const STEP_HINT = [
  "Elegí si sale solo y cómo lo vas a reconocer en la lista.",
  "Lo primero que lee el cliente en su bandeja: corto y con su nombre o su pedido.",
  "Armá el email con bloques. Los datos del pedido se completan solos en cada envío.",
  "Mirá cómo queda, mandate una prueba y guardá.",
];

/** Lleva al paso elegido: el foco va a su título y, si quedó fuera de la pantalla, se sube hasta él. */
function focusStep() {
  const el = document.getElementById("e-step");
  if (!el) return;
  if (el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  el.focus({ preventScroll: true });
}

/** Fichas que tienen sentido en cada disparador: sin pedido en el cumpleaños, sin mascota en los del pedido. */
export function tokensFor(trigger: EmailTemplate["trigger"]): EmailToken[] {
  return trigger === "pet-birthday" ? ALL_TOKENS.filter((t) => !ORDER_TOKENS.includes(t)) : ALL_TOKENS.filter((t) => t !== "pet.name");
}

const isTemplate = (id: string) => (x: unknown): x is EmailTemplate => {
  const t = x as EmailTemplate | null;
  return !!t && t.id === id && typeof t.name === "string" && Array.isArray(t.subject) && Array.isArray(t.preheader) && Array.isArray(t.blocks);
};

/**
 * Editor de una plantilla (pedido de Ignacio, fuera de la especificación) en cuatro pasos (8.4.19): cuándo se envía,
 * asunto, contenido y revisar. La vista previa en vivo queda al costado en pantallas anchas; en las otras se abre en un
 * modal y se ve entera en el último paso.
 */
export function EmailEditor() {
  const id = useSearchParams().get("id") ?? "";
  const saved = useAdmin((s) => s.emails.templates.find((t) => t.id === id));
  if (!saved) return <EmptyState title="No encontramos esa plantilla" action={<Link href="/admin-demo/emails/" className="font-bold text-primary underline">Volver a Emails</Link>} />;
  return <Editor key={saved.id} saved={saved} />;
}

/** Los cambios sin guardar quedan en la pestaña (8.3.24): salir a otra sección y volver no los pierde. */
function Editor({ saved }: { saved: EmailTemplate }) {
  const router = useRouter();
  const orders = useAdmin((s) => s.orders);
  const products = useAdmin((s) => s.data.products);
  const users = useAdmin((s) => s.users);
  const profiles = useAdmin((s) => s.workshop.profiles);
  const session = useSessionDraft<EmailTemplate>(`velmar-ui:email-draft:${saved.id}`, saved, isTemplate(saved.id));
  const draft = session.draft;
  const [seen, setSeen] = useState(saved);
  // Si la plantilla guardada cambia (guardar, restaurar, otra pestaña), el borrador vuelve a ella.
  if (saved !== seen) { setSeen(saved); session.reset(saved); }
  const [sample, setSample] = useState(sampleOrder(orders)?.code ?? "");
  const [device, setDevice] = useState<Device>("desktop");
  const [step, setStep] = useState(0);
  const dirty = session.dirty;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const isPet = draft.trigger === "pet-birthday";
  const order = orders.find((o) => o.code === sample);
  const ctx: EmailContext = isPet
    ? petSampleContext(profiles, orders, users)
    : order ? contextForOrder(order) : { customerName: "Cliente de muestra", email: "cliente@ejemplo.com" };
  const rendered = renderEmail(draft, ctx);
  const tokens = tokensFor(draft.trigger);
  const arts = [...new Map(products.map((p) => [p.art, { art: p.art, name: p.name }])).values()];
  const set = (p: Partial<EmailTemplate>) => session.setDraft({ ...draft, ...p });
  const checks = emailChecks(draft, rendered, dirty);
  const go = (i: number) => { if (i !== step) playSound(i > step ? "step" : "back"); setStep(i); requestAnimationFrame(focusStep); };
  const preview = { email: rendered, to: `${ctx.customerName} <${ctx.email}>`, device, onDevice: setDevice, orders: isPet ? [] : orders.filter((o) => o.status !== "CANCELLED"), sample, onSample: setSample };
  const current = EMAIL_STEPS[step]!;

  return (
    <ChipEditorsProvider>
      <div className="flex flex-col gap-6">
        <EditorHeader saved={saved} draft={draft} dirty={dirty} restored={session.restored} onDiscard={() => session.reset()} />
        <EmailStepper step={step} done={stepsDone(draft.name, checks)} onStep={go} />
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <section id="e-step" tabIndex={-1} aria-labelledby="e-step-t" className="flex min-w-0 scroll-mt-32 flex-col gap-4 focus:outline-none">
            <div className="flex flex-wrap items-start gap-3">
              <div className="min-w-0 flex-1 basis-60">
                <p className="eyebrow text-muted">Paso {step + 1} de {EMAIL_STEPS.length}</p>
                <h2 id="e-step-t" className="font-display mt-1 text-3xl leading-tight">{current.label}</h2>
                <p className="mt-1 text-sm text-muted">{STEP_HINT[step]}</p>
              </div>
              {step < 3 && <PreviewButton {...preview} />}
            </div>
            {current.id === "cuando" && <StepWhen draft={draft} set={set} />}
            {current.id === "asunto" && <StepSubject draft={draft} set={set} tokens={tokens} email={rendered} />}
            {current.id === "contenido" && <StepContent draft={draft} set={set} tokens={tokens} hasOrder={!isPet} arts={arts} />}
            {current.id === "revisar" && (
              <StepReview checks={checks} onStep={go}>
                <ReviewActions draft={draft} dirty={dirty} canTest={Boolean(order) || isPet} sample={sample} />
              </StepReview>
            )}
            <StepFooter step={step} onStep={go}>
              {current.id === "revisar" && <FinishButton dirty={dirty} draft={draft} onDone={() => router.push("/admin-demo/emails/")} />}
            </StepFooter>
          </section>
          <EmailLivePreview {...preview} className={step === 3 ? "xl:sticky xl:top-28 xl:self-start" : "hidden xl:sticky xl:top-28 xl:flex xl:self-start"} />
        </div>
      </div>
    </ChipEditorsProvider>
  );
}
