"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button, ButtonLink } from "@/components/atoms/Button";
import { Textarea } from "@/components/atoms/Field";
import { EmptyState } from "@/components/molecules/EmptyState";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { STATUS_LABEL } from "@/demo/engine/orders";
import { formatDate, formatDateTime } from "@/lib/date";
import { formatARS } from "@/lib/money";
import { useAdmin } from "@/stores/admin";
import { fulfillmentLabel, paymentLabel } from "./OrderCard";
import { OrderItems } from "./OrderItems";
import { OrderStatusActions } from "./OrderStatusActions";
import { ProofReview } from "./ProofReview";
import { useDemoSave } from "./useDemoSave";
import { OutboxSheet } from "./emails/OutboxSheet";
import { TRIGGER_LABEL } from "@/demo/fixtures/emails";
import { emailsOfOrder } from "@/demo/admin/emails/triggers";

/** Emails automáticos que "salieron" para este pedido (bandeja de salida simulada). */
function OrderEmails({ code, createdAt }: { code: string; createdAt: string }) {
  const outbox = useAdmin((s) => s.emails.outbox);
  const [open, setOpen] = useState<string | null>(null);
  const mails = emailsOfOrder(outbox, code, createdAt);
  return (
    <Panel title="Emails enviados (simulados)">
      {mails.length ? (
        <ul className="flex flex-col gap-1.5 text-sm">
          {mails.map((m) => (
            <li key={m.id}>
              <button type="button" onClick={() => setOpen(m.id)} className="w-full rounded-xl bg-bg p-2 text-left hover:ring-1 hover:ring-primary">
                <span className="block font-bold">{m.email.subject}</span>
                <span className="text-xs text-muted">{TRIGGER_LABEL[m.trigger]} · {formatDateTime(m.at)}{m.test ? " · prueba" : ""}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : <p className="text-sm text-muted">Todavía no salió ningún email para este pedido.</p>}
      <Link href="/admin-demo/emails/" className="mt-3 inline-block text-xs font-bold text-primary underline">Configurar emails automáticos</Link>
      <OutboxSheet mail={mails.find((m) => m.id === open) ?? null} onClose={() => setOpen(null)} />
    </Panel>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-3xl bg-surface shadow-[var(--shadow-card)] p-4"><h2 className="mb-3 font-extrabold">{title}</h2>{children}</section>;
}

export function OrderDetail() {
  const code = useSearchParams().get("codigo") ?? "";
  const order = useAdmin((s) => s.orders.find((o) => o.code === code));
  const addNote = useAdmin((s) => s.addNote);
  const save = useDemoSave();
  const [note, setNote] = useState("");
  if (!order) return <EmptyState title="Pedido no encontrado en la demo" action={<ButtonLink href="/admin-demo/pedidos/">Ver pedidos</ButtonLink>}>Revisá el código o reiniciá la demo.</EmptyState>;
  return (
    <div className="flex flex-col gap-4">
      <Link href="/admin-demo/pedidos/" className="flex w-fit items-center gap-1 text-sm font-bold text-primary"><ArrowLeft size={16} aria-hidden="true" /> Pedidos</Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold sm:text-3xl">{order.code} <span className="text-sm text-warning">(pedido ficticio)</span></h1>
        <StatusBadge status={order.status} />
        <span className="ml-auto text-2xl font-extrabold tabular-nums">{formatARS(order.total)}</span>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <Panel title="Productos y personalización aprobada"><OrderItems lines={order.lines} /></Panel>
          <Panel title={`Pago · ${paymentLabel(order.paymentMethod)}`}><ProofReview order={order} /></Panel>
          <Panel title="Cambiar estado"><OrderStatusActions order={order} /></Panel>
        </div>
        <div className="flex flex-col gap-4">
          <Panel title="Cliente y entrega">
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
              <dt className="text-muted">Nombre</dt><dd className="font-semibold">{order.customer.name}</dd>
              <dt className="text-muted">Email</dt><dd className="break-all">{order.customer.email}</dd>
              <dt className="text-muted">Teléfono</dt><dd>{order.customer.phone}</dd>
              <dt className="text-muted">Entrega</dt><dd>{fulfillmentLabel(order.fulfillment)}{order.address ? ` · ${order.address}` : ""}</dd>
              <dt className="text-muted">Creado</dt><dd>{formatDateTime(order.createdAt)}</dd>
              {order.promisedDate && (<><dt className="text-muted">Comprometido</dt><dd>{formatDate(order.promisedDate)}</dd></>)}
            </dl>
          </Panel>
          <Panel title="Historial">
            <ol className="flex flex-col gap-2 border-l-2 border-line pl-4 text-sm">
              {[...order.log].reverse().map((l, i) => (
                <li key={`${l.at}-${i}`}><p className="font-bold">{STATUS_LABEL[l.to]}</p><p className="text-xs text-muted">{formatDateTime(l.at)}{l.note ? ` · ${l.note}` : ""}</p></li>
              ))}
            </ol>
          </Panel>
          <OrderEmails code={order.code} createdAt={order.createdAt} />
          <Panel title="Notas internas (ficticias)">
            <ul className="mb-3 flex flex-col gap-1.5 text-sm">{order.notes.length ? order.notes.map((n, i) => <li key={i} className="rounded-xl bg-accent/50 p-2">{n}</li>) : <li className="text-muted">Sin notas.</li>}</ul>
            <form onSubmit={(e) => { e.preventDefault(); if (!note.trim()) return; save("Nota agregada", () => addNote(order.code, note.trim())); setNote(""); }} className="flex flex-col gap-2">
              <label htmlFor="note" className="text-sm font-bold">Nueva nota (no la ve el comprador)</label>
              <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} className="min-h-20" />
              <Button type="submit" variant="secondary" size="sm" className="self-start">Agregar nota</Button>
            </form>
          </Panel>
        </div>
      </div>
    </div>
  );
}
