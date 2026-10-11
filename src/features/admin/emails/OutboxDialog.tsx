"use client";
import Link from "next/link";
import { ArrowUpRight, Info } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Sheet } from "@/components/motion/Sheet";
import type { OutboxEmail } from "@/demo/admin/emails/triggers";
import { TRIGGER_LABEL } from "@/demo/fixtures/emails";
import { formatDateTime } from "@/lib/date";
import { TabFilter } from "../table/TabFilter";
import { EmailPreview } from "./EmailPreview";

/**
 * Email "enviado" abierto desde la bandeja o desde el pedido, tal cual salió (aunque después se edite la plantilla).
 * Modal centrado (8.4.20; antes, panel lateral); en el celular sube desde abajo con su propio scroll.
 */
export function OutboxDialog({ mail, onClose }: { mail: OutboxEmail | null; onClose: () => void }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  return (
    <Sheet open={!!mail} onClose={onClose} title={mail ? `Email: ${mail.email.subject}` : "Email"} side="dialog" className="bg-bg sm:w-[min(94vw,880px)]">
      {mail && (
        <div className="flex max-h-[94dvh] flex-col gap-4 overflow-y-auto p-5 pt-6 sm:max-h-[90dvh] sm:p-7">
          <div className="pr-12">
            <p className="eyebrow text-brass-ink">Bandeja de salida</p>
            <h2 className="font-display mt-1 text-2xl leading-tight sm:text-3xl">{mail.email.subject}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <Badge tone="brand">{TRIGGER_LABEL[mail.trigger]}</Badge>
            {mail.test && <Badge tone="demo">Prueba</Badge>}
            <span>{formatDateTime(mail.at)}</span>
            {mail.orderCode && <Link href={`/admin-demo/pedidos/detalle/?codigo=${mail.orderCode}`} className="inline-flex items-center gap-1 font-bold text-primary underline">{mail.orderCode} <ArrowUpRight size={14} aria-hidden="true" /></Link>}
            <span className="ml-auto"><TabFilter label="Dispositivo" value={device} onChange={setDevice} tabs={[{ id: "desktop", label: "Escritorio" }, { id: "mobile", label: "Celular" }]} /></span>
          </div>
          <EmailPreview email={mail.email} to={`${mail.name} <${mail.to}>`} device={device} />
          <p className="flex gap-2 rounded-2xl bg-warning-soft p-3 text-sm font-semibold text-warning">
            <Info size={17} aria-hidden="true" className="mt-0.5 shrink-0" />
            Simulado: en la demo no sale ningún email. En producción lo arma React Email y lo envía Nodemailer desde el servidor.
          </p>
        </div>
      )}
    </Sheet>
  );
}
