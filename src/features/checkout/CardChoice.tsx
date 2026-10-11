"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { BRAND_LABEL, cardExpiry, cardLabel, type SavedCard } from "@/demo/engine/profile";
import { cn } from "@/lib/cn";
import { useAccount } from "@/stores/account";
import { useAccountProfile, useProfile } from "@/stores/profile";
import { CardForm } from "../account/CardsSection";

/**
 * ¿Con qué tarjeta? (8.4.22, pedido de Ignacio): las guardadas en Mis tarjetas o una nueva. Con cuenta, la nueva queda
 * guardada para la próxima; sin cuenta, se usa solo en esta compra. Nunca se guarda el número completo ni el código.
 */
export function CardChoice({ value, onChange, missing }: { value: SavedCard | null; onChange: (c: SavedCard) => void; missing: boolean }) {
  const user = useAccount((s) => s.user);
  const { cards } = useAccountProfile(user?.email ?? "");
  const saveCard = useProfile((s) => s.saveCard);
  const [adding, setAdding] = useState(false);
  const saved = user ? cards : [];
  const options = value && !saved.some((c) => c.id === value.id) ? [...saved, value] : saved;
  return (
    <fieldset className="flex flex-col gap-2 rounded-2xl bg-bg p-3 sm:p-4">
      <legend className="sr-only">¿Con qué tarjeta?</legend>
      <p aria-hidden="true" className="text-sm font-bold">¿Con qué tarjeta?</p>
      {options.map((c) => (
        <label key={c.id} className={cn("flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border-2 bg-surface p-3 text-sm transition-colors", value?.id === c.id ? "border-primary" : "border-transparent hover:border-ink/15")}>
          <input type="radio" name="checkout-card" className="h-5 w-5 shrink-0 accent-[var(--color-primary)]" checked={value?.id === c.id} onChange={() => onChange(c)} />
          <span aria-hidden="true" className="grid h-9 w-12 shrink-0 place-items-center rounded-lg bg-night text-[9px] font-extrabold uppercase tracking-wide text-brass">{BRAND_LABEL[c.brand].split(" ")[0]}</span>
          <span className="min-w-0 flex-1"><span className="block font-bold">{cardLabel(c)}</span><span className="text-muted">Vence {cardExpiry(c)}{saved.some((s) => s.id === c.id) ? " · en Mis tarjetas" : " · solo para esta compra"}</span></span>
        </label>
      ))}
      {options.length === 0 && <p className="text-sm text-muted">{user ? "No tenés tarjetas guardadas todavía." : "Cargala para esta compra: sin cuenta no se guarda."}</p>}
      <Button variant="secondary" size="sm" className="self-start" onClick={() => setAdding(true)}><Plus size={15} aria-hidden="true" /> {options.length ? "Usar otra tarjeta" : "Agregar tarjeta"}</Button>
      <p className="text-xs text-muted">{user ? "La nueva queda en Mis tarjetas para la próxima compra." : "Entrá con tu cuenta para guardarla en Mis tarjetas."} En la demo, probá con la tarjeta de prueba del formulario.</p>
      {missing && <p role="alert" className="text-sm font-semibold text-danger">Elegí una tarjeta o agregá una.</p>}
      {adding && (
        <CardForm saveLabel={user ? "Guardar y usar" : "Usar esta tarjeta"} onClose={() => setAdding(false)}
          onSave={(c) => { if (user) saveCard(user.email, c); onChange(c); setAdding(false); }} />
      )}
    </fieldset>
  );
}
