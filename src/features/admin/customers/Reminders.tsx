"use client";
import Link from "next/link";
import { Cake, Copy, PawPrint, RefreshCw } from "lucide-react";
import { REMINDER_LABEL, type Reminder } from "@/demo/admin/workshop/reminders";
import { formatDay } from "@/lib/date";
import { cn } from "@/lib/cn";
import { useToasts } from "@/stores/toast";

const ICON = { "pet-birthday": PawPrint, birthday: Cake, repurchase: RefreshCw };

export function whenText(inDays: number): string {
  if (inDays === 0) return "hoy";
  if (inDays === 1) return "mañana";
  return inDays > 0 ? `en ${inDays} días` : `hace ${-inDays} días`;
}

export function profileHref(email: string): string {
  return `/admin-demo/usuarios/ficha/?email=${encodeURIComponent(email)}`;
}

/** Copia el mensaje sugerido para pegarlo en WhatsApp o en un email (la demo no envía nada). */
export function useCopyMessage() {
  const push = useToasts((s) => s.push);
  return async (text: string) => {
    try { await navigator.clipboard.writeText(text); push({ tone: "success", title: "Mensaje copiado", description: "Pegalo en WhatsApp o en un email. La demo no envía nada." }); }
    catch { push({ tone: "error", title: "No se pudo copiar", description: "Tu navegador no dejó usar el portapapeles." }); }
  };
}

/** Lista de recordatorios: cumpleaños de mascotas, del cliente y recompras, con el mensaje listo para copiar. */
export function ReminderList({ reminders, showCustomer = false }: { reminders: Reminder[]; showCustomer?: boolean }) {
  const copy = useCopyMessage();
  return (
    <ul className="flex flex-col gap-2">
      {reminders.map((r) => {
        const Icon = ICON[r.kind];
        return (
          <li key={r.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-surface p-3 shadow-[var(--shadow-card)]">
            <span aria-hidden="true" className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full", r.kind === "repurchase" ? "bg-accent text-ink" : "bg-brass/25 text-brass-ink")}><Icon size={18} /></span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold">{r.title}{showCustomer && <> · <Link href={profileHref(r.email)} className="hover:text-primary hover:underline">{r.name}</Link></>}</span>
              <span className="text-sm text-muted">{REMINDER_LABEL[r.kind]} · {formatDay(r.date)} ({whenText(r.inDays)})</span>
            </span>
            <button type="button" onClick={() => copy(r.message)} aria-label={`Copiar mensaje: ${r.title}${showCustomer ? `, ${r.name}` : ""}`}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-ink/15 px-3.5 text-sm font-bold hover:bg-accent/50">
              <Copy size={15} aria-hidden="true" /> Copiar mensaje
            </button>
          </li>
        );
      })}
    </ul>
  );
}
