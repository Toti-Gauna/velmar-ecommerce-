"use client";
import type { RenderedEmail } from "@/demo/admin/emails/render";
import type { AdminOrder } from "@/demo/admin/types";
import { cn } from "@/lib/cn";
import { TabFilter } from "../table/TabFilter";
import { EmailPreview } from "./EmailPreview";

export type Device = "desktop" | "mobile";

interface Props {
  email: RenderedEmail;
  to: string;
  device: Device;
  onDevice: (d: Device) => void;
  /** Pedidos para probar el email; vacío en el cumpleaños (no tiene pedido). */
  orders: AdminOrder[];
  sample: string;
  onSample: (code: string) => void;
  className?: string;
}

/** Vista previa en vivo con los datos de un pedido real de la demo, en escritorio o celular. */
export function EmailLivePreview({ email, to, device, onDevice, orders, sample, onSample, className }: Props) {
  return (
    <section id="e-preview-s" aria-labelledby="e-preview" className={cn("flex min-w-0 flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="e-preview" className="mr-auto font-bold">Vista previa</h2>
        <TabFilter label="Dispositivo" value={device} onChange={onDevice} tabs={[{ id: "desktop", label: "Escritorio" }, { id: "mobile", label: "Celular" }]} />
      </div>
      {orders.length > 0 && (
        <label className="flex items-center gap-2 text-sm font-bold">Con el pedido
          <select value={sample} onChange={(e) => onSample(e.target.value)} className="h-10 min-w-0 flex-1 rounded-2xl border border-ink/12 bg-surface px-3 font-semibold">
            {orders.map((o) => <option key={o.code} value={o.code}>{o.code} · {o.customer.name}</option>)}
          </select>
        </label>
      )}
      <EmailPreview email={email} to={to} device={device} />
    </section>
  );
}
