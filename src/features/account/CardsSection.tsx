"use client";
import { CreditCard, Plus, ShieldCheck, Wand2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Field, Input, describedBy } from "@/components/atoms/Field";
import { ConfirmButton } from "@/components/molecules/ConfirmButton";
import { BRAND_LABEL, TEST_CARD, cardBrand, cardExpiry, cardLabel, checkCard, formatCardNumber, formatExpiry, toSavedCard, type CardInput, type SavedCard } from "@/demo/engine/profile";
import { useAccountProfile, useProfile } from "@/stores/profile";
import { useToasts } from "@/stores/toast";
import { AccountFormDialog, newId, today } from "./AccountFormDialog";

/** Aviso de seguridad de la demo: lo dice el modal y la lista. */
export const CARD_NOTE = "Demo: se guarda solo la marca, los últimos 4 números y el vencimiento; nunca el número completo ni el código. No cargues una tarjeta real.";

/** Mis tarjetas (8.4.22, pedido de Ignacio): inputs de demostración para elegirlas después en el checkout. */
export function CardsSection({ email }: { email: string }) {
  const { cards } = useAccountProfile(email);
  const { saveCard, removeCard } = useProfile();
  const toast = useToasts((s) => s.push);
  const [adding, setAdding] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <p className="flex gap-2 rounded-2xl bg-warning-soft p-3 text-sm font-semibold text-warning"><ShieldCheck size={17} aria-hidden="true" className="mt-0.5 shrink-0" /> {CARD_NOTE}</p>
      {cards.length === 0 && <p className="rounded-2xl bg-bg p-4 text-sm text-muted">No guardaste tarjetas. Agregá una para pagar con un toque en el checkout.</p>}
      <ul className="grid gap-3 sm:grid-cols-2">
        {cards.map((c) => (
          <li key={c.id} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
            <span className="grid h-10 w-14 shrink-0 place-items-center rounded-lg bg-night text-[10px] font-extrabold uppercase tracking-wide text-brass">{BRAND_LABEL[c.brand].split(" ")[0]}</span>
            <span className="min-w-0 flex-1 text-sm"><span className="block font-bold">{cardLabel(c)}</span><span className="text-muted">Vence {cardExpiry(c)}</span></span>
            <ConfirmButton size="sm" variant="ghost" title={`Quitar ${cardLabel(c)}`} confirmLabel="Quitar" description="La tarjeta sale de tu cuenta."
              onConfirm={() => { removeCard(email, c.id); toast({ tone: "info", title: "Tarjeta quitada", description: cardLabel(c) }); }}>Quitar</ConfirmButton>
          </li>
        ))}
      </ul>
      <Button variant="secondary" className="self-start" onClick={() => setAdding(true)}><Plus size={16} aria-hidden="true" /> Agregar tarjeta</Button>
      {adding && <CardForm onClose={() => setAdding(false)} onSave={(c) => { saveCard(email, c); setAdding(false); toast({ tone: "success", title: "Tarjeta guardada", description: cardLabel(c) }); }} />}
    </div>
  );
}

const EMPTY: CardInput = { number: "", expiry: "", holder: "", cvv: "" };

/** Alta de una tarjeta de demostración. Los campos no usan el autocompletado de tarjetas del navegador a propósito. */
export function CardForm({ onSave, onClose }: { onSave: (c: SavedCard) => void; onClose: () => void }) {
  const [card, setCard] = useState<CardInput>(EMPTY);
  const [tried, setTried] = useState(false);
  const errors = tried ? checkCard(card, today()) : {};
  const brand = cardBrand(card.number);
  const set = (p: Partial<CardInput>) => setCard((c) => ({ ...c, ...p }));
  const save = () => {
    setTried(true);
    const e = checkCard(card, today());
    const first = (["number", "expiry", "holder", "cvv"] as const).find((k) => e[k]);
    if (first) return document.getElementById(`card-${first}`)?.focus();
    // Lo que no se guarda se descarta acá mismo: número completo, código y titular.
    onSave(toSavedCard(card, newId("tarjeta")));
  };
  const field = (key: keyof CardInput, label: string, props: Parameters<typeof Input>[0] & { "data-autofocus"?: boolean }) => (
    <Field id={`card-${key}`} label={label} error={errors[key]}>
      <Input id={`card-${key}`} value={card[key]} autoComplete="off" aria-invalid={Boolean(errors[key])} aria-describedby={describedBy(`card-${key}`, errors[key])} {...props} />
    </Field>
  );
  return (
    <AccountFormDialog open title="Nueva tarjeta" intro={CARD_NOTE} saveLabel="Guardar tarjeta" onSave={save} onClose={onClose}>
      <Button variant="secondary" size="sm" className="self-start" onClick={() => { setCard(TEST_CARD); setTried(false); }}><Wand2 size={15} aria-hidden="true" /> Usar tarjeta de prueba</Button>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">{field("number", "Número de la tarjeta", { inputMode: "numeric", placeholder: "0000 0000 0000 0000", "data-autofocus": true, onChange: (e) => set({ number: formatCardNumber(e.target.value) }) })}</div>
        {field("expiry", "Vencimiento (MM/AA)", { inputMode: "numeric", placeholder: "12/29", maxLength: 5, onChange: (e) => set({ expiry: formatExpiry(e.target.value) }) })}
        {field("cvv", "Código de seguridad", { inputMode: "numeric", type: "password", maxLength: brand === "amex" ? 4 : 3, placeholder: brand === "amex" ? "4 números" : "3 números", onChange: (e) => set({ cvv: e.target.value.replace(/\D/g, "") }) })}
        <div className="sm:col-span-2">{field("holder", "Nombre como figura en la tarjeta", { placeholder: "Nombre Apellido", onChange: (e) => set({ holder: e.target.value }) })}</div>
      </div>
      <p className="flex items-center gap-2 text-sm text-muted"><CreditCard size={16} aria-hidden="true" /> {card.number ? `${BRAND_LABEL[brand]} detectada` : "La marca se detecta sola al escribir el número."}</p>
    </AccountFormDialog>
  );
}
