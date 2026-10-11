"use client";
import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { TRIGGER_LABEL } from "@/demo/fixtures/emails";
import { formatDateTime } from "@/lib/date";
import { useAdmin } from "@/stores/admin";
import { OutboxDialog } from "./OutboxDialog";

const LATEST = 3;

/**
 * Bandeja de salida arriba de todo en Emails automáticos (8.4.20, pedido de Ignacio): los últimos emails "enviados"
 * se abren en un modal acá mismo; la bandeja completa (buscador y filtro) sigue en su página.
 */
export function OutboxCard() {
  const outbox = useAdmin((s) => s.emails.outbox);
  const [open, setOpen] = useState<string | null>(null);
  const latest = outbox.slice(0, LATEST);
  return (
    <section aria-labelledby="outbox-card" className="mb-6 overflow-hidden rounded-[1.75rem] bg-night text-[#f6f1e8] shadow-[var(--shadow-lift)]">
      <div className="flex flex-wrap items-center gap-3 p-4 sm:p-5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brass/20 text-brass"><Inbox size={20} aria-hidden="true" /></span>
        <span className="min-w-0 flex-1 basis-48">
          <h2 id="outbox-card" className="font-display text-2xl leading-tight">Bandeja de salida</h2>
          <span className="block text-sm text-[#cfc6b3]">{outbox.length} {outbox.length === 1 ? "email simulado" : "emails simulados"} · nada sale de este navegador</span>
        </span>
        <Link href="/admin-demo/emails/enviados/" className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#f6f1e8] px-4 text-sm font-bold text-night hover:bg-white">
          Ver toda la bandeja <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
      {latest.length ? (
        <ul aria-label="Últimos emails" className="grid gap-px bg-white/10 md:grid-cols-3">
          {latest.map((m) => (
            <li key={m.id} className="bg-night">
              <button type="button" onClick={() => setOpen(m.id)} className="flex h-full w-full flex-col gap-1.5 p-4 text-left transition-colors hover:bg-white/[0.06] sm:px-5">
                <span className="flex flex-wrap items-center gap-1.5">
                  <Badge tone="brand">{TRIGGER_LABEL[m.trigger]}</Badge>
                  {m.test && <Badge tone="demo">Prueba</Badge>}
                </span>
                <span className="line-clamp-2 font-bold">{m.email.subject}</span>
                <span className="block truncate text-xs text-[#cfc6b3]">{m.name} · {formatDateTime(m.at)}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="border-t border-white/10 px-4 py-4 text-sm text-[#cfc6b3] sm:px-5">Todavía no salió ningún email. Cuando un pedido cambie de estado o alguien compre en la tienda demo, aparece acá.</p>
      )}
      <OutboxDialog mail={outbox.find((m) => m.id === open) ?? null} onClose={() => setOpen(null)} />
    </section>
  );
}
