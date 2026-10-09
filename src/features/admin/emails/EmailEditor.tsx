"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, RotateCcw, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Field";
import { Switch } from "@/components/atoms/Switch";
import { EmptyState } from "@/components/molecules/EmptyState";
import { contextForOrder, renderEmail, type EmailContext } from "@/demo/admin/emails/render";
import { TEST_INBOX } from "@/demo/admin/emails-slice";
import { ORDER_TOKENS, TOKEN_LABEL, TRIGGER_HINT, TRIGGER_LABEL, type EmailTemplate, type EmailToken } from "@/demo/fixtures/emails";
import { useAdmin } from "@/stores/admin";
import { useToasts } from "@/stores/toast";
import { TabFilter } from "../table/TabFilter";
import { useDemoSave } from "../useDemoSave";
import { BlockList } from "./BlockList";
import { ChipEditor, ChipEditorsProvider } from "./ChipEditor";
import { EmailPreview } from "./EmailPreview";
import { TokenPalette } from "./TokenPalette";

const ALL_TOKENS = Object.keys(TOKEN_LABEL) as EmailToken[];

/** Fichas que tienen sentido en cada disparador: sin pedido en el cumpleaños, sin mascota en los del pedido. */
export function tokensFor(trigger: EmailTemplate["trigger"]): EmailToken[] {
  return trigger === "pet-birthday" ? ALL_TOKENS.filter((t) => !ORDER_TOKENS.includes(t)) : ALL_TOKENS.filter((t) => t !== "pet.name");
}

/** Editor de una plantilla (pedido de Ignacio, fuera de la especificación): bloques, fichas de datos y vista previa en vivo. */
export function EmailEditor() {
  const id = useSearchParams().get("id") ?? "";
  const saved = useAdmin((s) => s.emails.templates.find((t) => t.id === id));
  const orders = useAdmin((s) => s.orders);
  const products = useAdmin((s) => s.data.products);
  const { saveEmailTemplate, resetEmailTemplate, sendTestEmail } = useAdmin();
  const save = useDemoSave();
  const push = useToasts((s) => s.push);
  const [draft, setDraft] = useState<EmailTemplate | null>(saved ?? null);
  const [seen, setSeen] = useState(saved);
  // Si la plantilla guardada cambia (restaurar, otra pestaña), el borrador vuelve a ella.
  if (saved !== seen) { setSeen(saved); setDraft(saved ?? null); }
  const sampleOrders = orders.filter((o) => o.status !== "CANCELLED");
  const [sample, setSample] = useState(sampleOrders.find((o) => o.code === "VEL-000121")?.code ?? sampleOrders[0]?.code ?? "");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const dirty = !!draft && !!saved && JSON.stringify(draft) !== JSON.stringify(saved);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (!draft || !saved) {
    return <EmptyState title="No encontramos esa plantilla" action={<Link href="/admin-demo/emails/" className="font-bold text-primary underline">Volver a Emails</Link>} />;
  }
  const isPet = draft.trigger === "pet-birthday";
  const order = orders.find((o) => o.code === sample);
  const ctx: EmailContext = isPet
    ? { customerName: "Diego Álvarez", email: "diego.a@ejemplo.com", pet: { name: "Ñoqui" } }
    : order ? contextForOrder(order) : { customerName: "Cliente de muestra", email: "cliente@ejemplo.com" };
  const rendered = renderEmail(draft, ctx);
  const tokens = tokensFor(draft.trigger);
  const arts = [...new Map(products.map((p) => [p.art, { art: p.art, name: p.name }])).values()];
  const set = (p: Partial<EmailTemplate>) => setDraft({ ...draft, ...p });

  return (
    <ChipEditorsProvider>
      <div className="flex flex-col gap-6">
        <Link href="/admin-demo/emails/" className="inline-flex items-center gap-1.5 self-start text-sm font-bold text-muted hover:text-ink"><ArrowLeft size={16} aria-hidden="true" /> Emails automáticos</Link>
        <header className="flex flex-wrap items-end gap-x-6 gap-y-3">
          <div className="min-w-0 flex-1">
            <p className="eyebrow text-muted">Se envía con: {TRIGGER_LABEL[draft.trigger]}</p>
            <h1 className="font-display mt-1 text-4xl sm:text-5xl">{draft.name} <span className="font-sans align-middle text-sm font-bold text-warning">(demo)</span></h1>
            <p className="mt-1 text-sm text-muted">{TRIGGER_HINT[draft.trigger]}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Switch checked={draft.active} onChange={(active) => set({ active })} label={draft.active ? "Activo" : "Pausado"} />
            <Button variant="ghost" size="sm" onClick={() => save("Plantilla restaurada", () => resetEmailTemplate(draft.id))}><RotateCcw size={15} aria-hidden="true" /> Restaurar</Button>
            <Button variant="secondary" size="sm" disabled={dirty || !order} title={dirty ? "Guardá los cambios para mandar la prueba" : undefined}
              onClick={() => { if (sendTestEmail(draft.id, sample)) push({ tone: "success", title: "Prueba en la bandeja de salida", description: `Simulada para ${TEST_INBOX}. La demo no envía nada.` }); }}>
              <Send size={15} aria-hidden="true" /> Enviar prueba
            </Button>
            <Button size="sm" disabled={!dirty} onClick={() => save("Plantilla guardada", () => saveEmailTemplate(draft))}>Guardar cambios</Button>
          </div>
        </header>
        {dirty && <p role="status" className="-mt-3 text-sm font-bold text-warning">Cambios sin guardar</p>}

        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div className="flex flex-col gap-4">
            <section aria-labelledby="e-data" className="sticky top-[calc(7.25rem+env(safe-area-inset-top))] z-10 rounded-3xl bg-bg/95 p-3 ring-1 ring-ink/[0.06] backdrop-blur">
              <h2 id="e-data" className="mb-2 text-sm font-extrabold">Datos del pedido y del cliente</h2>
              <TokenPalette tokens={tokens} />
              <p className="mt-2 hidden text-xs text-muted sm:block">Tocá un texto y después el dato: entra como ficha y en cada email se reemplaza por el valor real.</p>
            </section>
            <section aria-label="Datos del email" className="flex flex-col gap-3 rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]">
              <label className="flex flex-col gap-1 text-sm font-bold">Nombre interno<Input value={draft.name} onChange={(e) => set({ name: e.target.value })} /></label>
              <div className="flex flex-col gap-1 text-sm font-bold">Asunto
                <ChipEditor id="e-subject" label="Asunto" value={draft.subject} tokens={tokens} onChange={(subject) => set({ subject })} />
              </div>
              <div className="flex flex-col gap-1 text-sm font-bold">Texto de vista previa
                <ChipEditor id="e-preheader" label="Texto de vista previa" value={draft.preheader} tokens={tokens} placeholder="Lo que se lee al lado del asunto" onChange={(preheader) => set({ preheader })} />
              </div>
            </section>
            <BlockList blocks={draft.blocks} onChange={(blocks) => set({ blocks })} tokens={tokens} hasOrder={!isPet} arts={arts} />
          </div>

          <section aria-labelledby="e-preview" className="flex flex-col gap-3 xl:sticky xl:top-4 xl:self-start">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="e-preview" className="mr-auto font-bold">Vista previa</h2>
              <TabFilter label="Dispositivo" value={device} onChange={setDevice} tabs={[{ id: "desktop", label: "Escritorio" }, { id: "mobile", label: "Celular" }]} />
            </div>
            {!isPet && (
              <label className="flex items-center gap-2 text-sm font-bold">Con el pedido
                <select value={sample} onChange={(e) => setSample(e.target.value)} className="h-10 min-w-0 flex-1 rounded-2xl border border-ink/12 bg-surface px-3 font-semibold">
                  {sampleOrders.map((o) => <option key={o.code} value={o.code}>{o.code} · {o.customer.name}</option>)}
                </select>
              </label>
            )}
            <EmailPreview email={rendered} to={`${ctx.customerName} <${ctx.email}>`} device={device} />
          </section>
        </div>
      </div>
    </ChipEditorsProvider>
  );
}
