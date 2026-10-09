"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Inbox, MailCheck, PencilLine } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Switch } from "@/components/atoms/Switch";
import { ConfirmButton } from "@/components/molecules/ConfirmButton";
import { EmptyState } from "@/components/molecules/EmptyState";
import { contextForOrder, resolveInline } from "@/demo/admin/emails/render";
import { matchesQuery } from "@/demo/admin/table";
import { TRIGGER_HINT, TRIGGER_LABEL, type EmailTrigger } from "@/demo/fixtures/emails";
import { formatDateTime } from "@/lib/date";
import { useAdmin } from "@/stores/admin";
import { AdminPageHeader } from "../AdminPageHeader";
import { TabFilter } from "../table/TabFilter";
import { useDemoSave } from "../useDemoSave";
import { OutboxSheet } from "./OutboxSheet";

type View = "auto" | "outbox";

/** Emails automáticos (pedido de Ignacio, fuera de la especificación): qué se envía en cada momento y la bandeja de salida. */
export function EmailsAdmin() {
  const router = useRouter();
  const params = useSearchParams();
  const view: View = params.get("vista") === "enviados" ? "outbox" : "auto";
  const { templates, outbox } = useAdmin((s) => s.emails);
  const orders = useAdmin((s) => s.orders);
  const { setEmailTemplateActive, clearOutbox } = useAdmin();
  const save = useDemoSave();
  const [open, setOpen] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [trigger, setTrigger] = useState<EmailTrigger | "all">("all");
  const sample = orders.find((o) => o.code === "VEL-000121") ?? orders[0];
  const ctx = sample ? contextForOrder(sample) : { customerName: "Cliente", email: "" };
  const list = outbox.filter((m) => (trigger === "all" || m.trigger === trigger) && matchesQuery(q, m.email.subject, m.to, m.name, m.orderCode ?? ""));
  const go = (v: View) => router.replace(v === "outbox" ? "/admin-demo/emails/?vista=enviados" : "/admin-demo/emails/");

  return (
    <>
      <AdminPageHeader title="Emails automáticos">
        Un email por cada momento del pedido, con la marca y los datos del cliente puestos solos. En la demo no sale nada: lo “enviado” queda en la bandeja de salida.
      </AdminPageHeader>
      <div className="mb-5">
        <TabFilter label="Sección" value={view} onChange={go} tabs={[{ id: "auto", label: "Disparadores", count: templates.filter((t) => t.active).length }, { id: "outbox", label: "Bandeja de salida", count: outbox.length }]} />
      </div>

      {view === "auto" ? (
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((t) => {
            const sent = outbox.filter((m) => m.templateId === t.id && !m.test);
            return (
              <li key={t.id} className="flex flex-col gap-3 rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)] ring-1 ring-ink/[0.04]">
                <div className="flex items-start gap-2">
                  <span className="min-w-0 flex-1">
                    <span className="eyebrow block text-muted">{TRIGGER_LABEL[t.trigger]}</span>
                    <span className="mt-1 block text-lg font-extrabold">{t.name}</span>
                  </span>
                  <Badge tone={t.active ? "success" : "neutral"}>{t.active ? "Activo" : "Pausado"}</Badge>
                </div>
                <p className="text-sm text-muted">{TRIGGER_HINT[t.trigger]}</p>
                <p className="rounded-2xl bg-bg p-3 text-sm"><span className="block text-xs font-bold text-muted">Asunto (ejemplo)</span>{resolveInline(t.subject, t.trigger === "pet-birthday" ? { customerName: "Diego Álvarez", email: "", pet: { name: "Ñoqui" } } : ctx)}</p>
                <p className="flex items-center gap-1.5 text-xs font-semibold text-muted"><MailCheck size={14} aria-hidden="true" />{sent.length} {sent.length === 1 ? "enviado" : "enviados"}{sent[0] ? ` · último ${formatDateTime(sent[0].at)}` : ""}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                  <Switch checked={t.active} label={t.active ? "Se envía solo" : "Pausado"} onChange={(v) => save(v ? `“${t.name}” activado` : `“${t.name}” pausado`, () => setEmailTemplateActive(t.id, v))} />
                  <Link href={`/admin-demo/emails/editar/?id=${t.id}`} aria-label={`Editar ${t.name}`} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-on-primary hover:bg-primary-hover">
                    <PencilLine size={15} aria-hidden="true" /> Editar
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <section aria-label="Bandeja de salida" className="rounded-[1.75rem] bg-surface p-4 shadow-[var(--shadow-card)]">
          <div className="mb-3 flex flex-wrap items-end gap-2">
            <label className="flex min-w-[min(100%,16rem)] flex-1 flex-col gap-1 text-sm font-bold">Buscar en la bandeja
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cliente, email, asunto o pedido" className="h-11 rounded-2xl border border-ink/12 bg-bg px-3 font-semibold" />
            </label>
            <label className="flex flex-col gap-1 text-sm font-bold">Momento
              <select value={trigger} onChange={(e) => setTrigger(e.target.value as EmailTrigger | "all")} className="h-11 rounded-2xl border border-ink/12 bg-bg px-3 font-semibold">
                <option value="all">Todos</option>
                {(Object.keys(TRIGGER_LABEL) as EmailTrigger[]).map((t) => <option key={t} value={t}>{TRIGGER_LABEL[t]}</option>)}
              </select>
            </label>
            {outbox.length > 0 && (
              <ConfirmButton size="sm" variant="danger" title="Vaciar la bandeja de salida" confirmLabel="Vaciar" description="Se borran los emails simulados de este navegador. Las plantillas no cambian."
                onConfirm={() => save("Bandeja de salida vaciada", () => clearOutbox())}>Vaciar</ConfirmButton>
            )}
          </div>
          {list.length ? (
            <ul className="flex flex-col divide-y divide-line">
              {list.map((m) => (
                <li key={m.id}>
                  <button type="button" onClick={() => setOpen(m.id)} className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 px-1 py-3 text-left hover:bg-bg">
                    <Inbox size={18} aria-hidden="true" className="shrink-0 text-muted" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold">{m.email.subject}</span>
                      <span className="block truncate text-sm text-muted">{m.name} · {m.to}{m.orderCode ? ` · ${m.orderCode}` : ""}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      {m.test && <Badge tone="demo">Prueba</Badge>}
                      <Badge>{TRIGGER_LABEL[m.trigger]}</Badge>
                      <span className="whitespace-nowrap text-xs text-muted">{formatDateTime(m.at)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : <EmptyState title="Sin emails">{outbox.length ? "Ningún email coincide con la búsqueda." : "Cuando un pedido cambie de estado o alguien compre en la tienda demo, el email aparece acá."}</EmptyState>}
        </section>
      )}
      <OutboxSheet mail={outbox.find((m) => m.id === open) ?? null} onClose={() => setOpen(null)} />
    </>
  );
}
