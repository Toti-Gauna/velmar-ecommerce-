"use client";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Eye, RotateCcw, Send } from "lucide-react";
import { useState, type ComponentProps } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ConfirmButton } from "@/components/molecules/ConfirmButton";
import { Sheet } from "@/components/motion/Sheet";
import { TEST_INBOX } from "@/demo/admin/emails-slice";
import { TRIGGER_HINT, TRIGGER_LABEL, type EmailTemplate } from "@/demo/fixtures/emails";
import { useAdmin } from "@/stores/admin";
import { useToasts } from "@/stores/toast";
import { useDemoSave } from "../useDemoSave";
import { EmailLivePreview } from "./EmailLivePreview";

/** Migas, título a todo el ancho (8.3.24), estado y guardar siempre a mano, y el aviso del borrador recuperado. */
export function EditorHeader({ saved, draft, dirty, restored, onDiscard }: { saved: EmailTemplate; draft: EmailTemplate; dirty: boolean; restored: boolean; onDiscard: () => void }) {
  const saveEmailTemplate = useAdmin((s) => s.saveEmailTemplate);
  const save = useDemoSave();
  return (
    <>
      <nav aria-label="Migas de pan" className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <Link href="/admin-demo/emails/" className="inline-flex items-center gap-1.5 font-bold text-muted hover:text-ink"><ArrowLeft size={16} aria-hidden="true" /> Volver a Emails automáticos</Link>
        <span aria-hidden="true" className="h-4 w-px bg-line" />
        <ol className="flex min-w-0 flex-wrap items-center gap-1 text-muted">
          <li className="flex items-center gap-1"><Link href="/admin-demo/marketing/" className="hover:text-ink hover:underline">Marketing</Link><ChevronRight size={14} aria-hidden="true" /></li>
          <li className="flex items-center gap-1"><Link href="/admin-demo/emails/" className="hover:text-ink hover:underline">Emails automáticos</Link><ChevronRight size={14} aria-hidden="true" /></li>
          <li aria-current="page" className="font-semibold text-ink">{saved.name}</li>
        </ol>
      </nav>
      <header className="flex flex-col gap-3">
        <div>
          <p className="eyebrow text-muted">Se envía con: {TRIGGER_LABEL[draft.trigger]}</p>
          <h1 className="font-display mt-1 text-4xl text-balance sm:text-5xl">{draft.name} <span className="font-sans align-middle text-sm font-bold text-warning">(demo)</span></h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">{TRIGGER_HINT[draft.trigger]}</p>
        </div>
        <div role="group" aria-label="Acciones de la plantilla" className="flex flex-wrap items-center gap-2 rounded-[1.5rem] bg-surface p-2 pl-4 shadow-[var(--shadow-card)] ring-1 ring-ink/[0.04]">
          <Badge tone={draft.active ? "success" : "neutral"}>{draft.active ? "Activo" : "Pausado"}</Badge>
          <span role="status" className={dirty ? "text-sm font-bold text-warning" : "text-sm font-semibold text-muted"}>{dirty ? "Cambios sin guardar" : "Todo guardado"}</span>
          <Button size="sm" className="ml-auto" disabled={!dirty} onClick={() => save("Plantilla guardada", () => saveEmailTemplate(draft))}>Guardar cambios</Button>
        </div>
        {restored && (
          <div role="status" className="flex flex-wrap items-center gap-3 rounded-2xl bg-warning-soft px-4 py-3 text-sm ring-1 ring-warning/30">
            <p className="flex-1 font-bold text-warning">Recuperamos los cambios sin guardar de esta plantilla.</p>
            <ConfirmButton size="sm" variant="secondary" title="Descartar los cambios" confirmLabel="Descartar" description="La plantilla vuelve a como está guardada." onConfirm={onDiscard}>Descartar cambios</ConfirmButton>
          </div>
        )}
      </header>
    </>
  );
}

/** En pantallas sin lugar al costado, la vista previa se abre en un modal sin salir del paso. */
export function PreviewButton(props: ComponentProps<typeof EmailLivePreview>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" size="sm" className="xl:hidden" onClick={() => setOpen(true)}><Eye size={15} aria-hidden="true" /> Ver cómo queda</Button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Vista previa del email" side="dialog" className="bg-bg sm:w-[min(94vw,760px)]">
        {open && <div className="max-h-[94dvh] overflow-y-auto p-5 pt-14 sm:max-h-[90dvh] sm:p-7 sm:pt-14"><EmailLivePreview {...props} /></div>}
      </Sheet>
    </>
  );
}

/** Último paso: mandar una prueba (simulada) y volver a la plantilla original. */
export function ReviewActions({ draft, dirty, canTest, sample }: { draft: EmailTemplate; dirty: boolean; canTest: boolean; sample: string }) {
  const { sendTestEmail, resetEmailTemplate } = useAdmin();
  const push = useToasts((s) => s.push);
  const save = useDemoSave();
  return (
    <>
      <section aria-labelledby="e-test" className="flex flex-col gap-3 rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)] sm:p-5">
        <h3 id="e-test" className="font-bold">Mandá una prueba</h3>
        <p className="text-sm text-muted">Sale simulada a {TEST_INBOX} con el pedido de la vista previa y queda en la bandeja de salida. La demo no envía nada.</p>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" disabled={dirty || !canTest}
            onClick={() => { if (sendTestEmail(draft.id, sample)) push({ tone: "success", title: "Prueba en la bandeja de salida", description: `Simulada para ${TEST_INBOX}. La demo no envía nada.` }); }}>
            <Send size={15} aria-hidden="true" /> Enviar prueba
          </Button>
          {dirty && <p className="text-sm font-bold text-warning">Guardá los cambios para mandar la prueba.</p>}
        </div>
      </section>
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
        <span>¿Querés empezar de nuevo?</span>
        <ConfirmButton size="sm" variant="ghost" title="Volver a la plantilla original" confirmLabel="Restaurar" description="La plantilla vuelve al texto y los bloques de muestra; se pierden tus cambios."
          onConfirm={() => save("Plantilla restaurada", () => resetEmailTemplate(draft.id))}><RotateCcw size={15} aria-hidden="true" /> Restaurar la original</ConfirmButton>
      </div>
    </>
  );
}

/** Cierre del último paso: guarda y vuelve a la lista (o solo vuelve si ya está todo guardado). */
export function FinishButton({ draft, dirty, onDone }: { draft: EmailTemplate; dirty: boolean; onDone: () => void }) {
  const saveEmailTemplate = useAdmin((s) => s.saveEmailTemplate);
  const save = useDemoSave();
  if (!dirty) return <Link href="/admin-demo/emails/" className="inline-flex h-12 items-center rounded-full bg-primary px-5 font-bold text-on-primary hover:bg-primary-hover">Listo, volver a Emails</Link>;
  return <Button onClick={() => { save("Plantilla guardada", () => saveEmailTemplate(draft)); onDone(); }}>Guardar y volver a Emails</Button>;
}
