"use client";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Field";
import type { DemoSettings } from "@/demo/fixtures/commerce";
import { demoSettings } from "@/demo/fixtures/commerce";
import type { PaymentMethod } from "@/demo/types";
import { contrastRatio } from "@/lib/color";
import { useAdmin } from "@/stores/admin";
import { NumberField } from "./NumberField";
import { useDemoSave } from "./useDemoSave";

export function SettingsForm({ title, children, onSave, error }: { title: string; children: ReactNode; onSave: () => void; error?: string | null }) {
  return (
    <form noValidate className="flex flex-col gap-3 rounded-3xl bg-surface shadow-[var(--shadow-card)] p-4" onSubmit={(e) => { e.preventDefault(); onSave(); }}>
      <h2 className="font-extrabold">{title}</h2>
      {children}
      {error && <p role="alert" className="text-sm font-semibold text-danger">{error}</p>}
      <Button type="submit" size="sm" className="self-start">Guardar</Button>
    </form>
  );
}

export function useSettingsDraft() {
  const settings = useAdmin((s) => s.data.settings);
  const saveSettings = useAdmin((s) => s.saveSettings);
  const save = useDemoSave();
  return { settings, commit: (title: string, patch: Partial<DemoSettings>) => save(title, () => saveSettings(patch)) };
}

export function BrandSettings() {
  const { settings, commit } = useSettingsDraft();
  const [c, setC] = useState(settings.brandColors);
  const ratio = contrastRatio(c.primary, "#ffffff");
  const fields: { key: keyof typeof c; label: string }[] = [{ key: "primary", label: "Principal (botones)" }, { key: "accent", label: "Acento (fondos suaves)" }, { key: "background", label: "Fondo" }];
  return (
    <SettingsForm title="Marca (paleta provisional)" error={ratio < 4.5 ? `El color principal tiene contraste ${ratio.toFixed(1)}:1 con blanco; necesita 4,5:1 para texto legible (AA).` : null}
      onSave={() => ratio >= 4.5 && commit("Colores de marca aplicados", { brandColors: c })}>
      <div className="grid grid-cols-3 gap-3">
        {fields.map((f) => (
          <label key={f.key} className="flex flex-col gap-1 text-sm font-bold">{f.label}
            <input type="color" value={c[f.key]} onChange={(e) => setC({ ...c, [f.key]: e.target.value })} className="h-11 w-full rounded-xl border border-line" />
          </label>
        ))}
      </div>
      <p className="text-xs text-muted">Contraste del principal con blanco: {ratio.toFixed(1)}:1. Se aplica a toda la tienda y al panel en este navegador.</p>
      <button type="button" className="self-start text-sm font-bold text-primary underline" onClick={() => setC(demoSettings.brandColors)}>Volver a la paleta provisional</button>
    </SettingsForm>
  );
}

export function ContactSettings() {
  const { settings, commit } = useSettingsDraft();
  const [wa, setWa] = useState(settings.whatsappNumber ?? "");
  const [error, setError] = useState<string | null>(null);
  return (
    <SettingsForm title="WhatsApp" error={error} onSave={() => {
      const digits = wa.replace(/\D/g, "");
      if (digits && (digits.length < 10 || digits.length > 15)) return setError("Escribí el número con código de país y área, por ejemplo 54 9 223 555 0000.");
      setError(null);
      commit("WhatsApp guardado", { whatsappNumber: digits || null });
    }}>
      <label className="flex flex-col gap-1 text-sm font-bold">Número para el botón de WhatsApp
        <Input value={wa} onChange={(e) => setWa(e.target.value)} inputMode="tel" placeholder="54 9 223 555 0000" />
        <span className="text-xs font-normal text-muted">Vacío = el botón abre WhatsApp para elegir contacto. Usá un número de prueba en la demo.</span>
      </label>
    </SettingsForm>
  );
}

const METHODS: { value: PaymentMethod; label: string }[] = [{ value: "CHECKOUT_PRO", label: "Mercado Pago (Checkout Pro)" }, { value: "BANK_TRANSFER", label: "Transferencia" }, { value: "QR_MANUAL", label: "QR estático" }];

export function PaymentSettings() {
  const { settings, commit } = useSettingsDraft();
  const [d, setD] = useState({ methods: settings.enabledMethods, pct: settings.transferDiscountPct, hours: settings.pendingTransferHours });
  const [error, setError] = useState<string | null>(null);
  return (
    <SettingsForm title="Medios de pago" error={error} onSave={() => {
      if (d.methods.length === 0) return setError("Dejá al menos un medio de pago activo.");
      if (d.pct > 50) return setError("El descuento por transferencia/QR no puede superar 50%.");
      if (d.hours < 1 || d.hours > 168) return setError("La reserva va de 1 a 168 horas.");
      setError(null);
      commit("Medios de pago guardados", { enabledMethods: d.methods, transferDiscountPct: d.pct, pendingTransferHours: d.hours });
    }}>
      <fieldset className="flex flex-col"><legend className="mb-1 text-sm font-bold">Activos en el checkout</legend>
        {METHODS.map((m) => (
          <label key={m.value} className="flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" className="h-5 w-5 accent-[var(--color-primary)]" checked={d.methods.includes(m.value)}
              onChange={(e) => setD({ ...d, methods: e.target.checked ? [...d.methods, m.value] : d.methods.filter((x) => x !== m.value) })} />{m.label}
          </label>
        ))}
      </fieldset>
      <div className="grid gap-3 sm:grid-cols-2">
        <NumberField id="pct" label="Descuento transferencia/QR" suffix="%" value={d.pct} onChange={(pct) => setD({ ...d, pct })} />
        <NumberField id="hours" label="Reserva sin comprobante" suffix="horas" min={1} value={d.hours} onChange={(hours) => setD({ ...d, hours })} />
      </div>
    </SettingsForm>
  );
}
