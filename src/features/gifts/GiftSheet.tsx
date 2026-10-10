"use client";
import { Gift } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/atoms/Button";
import { Field, Input, Textarea, describedBy } from "@/components/atoms/Field";
import { Select } from "@/components/atoms/Select";
import { Sheet } from "@/components/motion/Sheet";
import type { LineGift } from "@/demo/engine/cart-types";
import { GIFT_LIMITS, cleanGift, giftProblem, isOccasion } from "@/demo/engine/gifts";
import { seasonalThemes } from "@/demo/fixtures/themes";
import type { GiftOccasion } from "@/demo/types";
import { GIFT_SCENE_NAMES } from "./scenes";

interface Props {
  open: boolean;
  onClose: () => void;
  productName: string;
  /** Nombre de la cuenta (para "De parte de"). */
  fromName?: string;
  /** Temática vigente: es la ocasión que se propone. */
  occasion: GiftOccasion;
  onSubmit: (gift: LineGift, mode: "cart" | "buy") => void;
}

const FIELD_OF: Record<string, string> = { "para quién": "gift-to", "de parte": "gift-from", email: "gift-email", caracteres: "gift-message" };

/**
 * "Es para regalar" (pedido de Ignacio, fuera de la especificación): para quién, de parte de quién, un mensaje y la
 * ocasión, que define cómo se abre. Quien lo recibe nunca ve el precio.
 */
export function GiftSheet({ open, onClose, productName, fromName, occasion: initial, onSubmit }: Props) {
  const [draft, setDraft] = useState<LineGift>({ to: "", from: fromName ?? "", toEmail: "", message: "", occasion: initial });
  const [error, setError] = useState<string | null>(null);
  const set = (patch: Partial<LineGift>) => { setDraft((d) => ({ ...d, ...patch })); setError(null); };
  const left = GIFT_LIMITS.message - Array.from(draft.message).length;

  const submit = (mode: "cart" | "buy") => (e?: FormEvent) => {
    e?.preventDefault();
    const problem = giftProblem(draft);
    if (problem) {
      setError(problem);
      const id = Object.entries(FIELD_OF).find(([k]) => problem.includes(k))?.[1];
      if (id) document.getElementById(id)?.focus();
      return;
    }
    onSubmit(cleanGift(draft), mode);
  };

  return (
    <Sheet open={open} onClose={onClose} title="Es para regalar" side="right">
      <form onSubmit={submit("cart")} noValidate className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-8 pt-16">
        <p className="eyebrow text-brass-ink">Es para regalar</p>
        <h2 className="font-display mt-2 text-3xl leading-tight">{productName}</h2>
        <p className="mt-2 text-sm text-muted">Al confirmar el pedido te damos un link y un código para mandarle. Lo abre a golpes, con una escena de la ocasión, y nunca ve el precio.</p>
        <div className="mt-6 flex flex-col gap-4">
          <Field id="gift-to" label="Para" error={error?.includes("para quién") ? error : undefined}>
            <Input id="gift-to" data-autofocus value={draft.to} maxLength={GIFT_LIMITS.name} autoComplete="off" placeholder="Sofía" onChange={(e) => set({ to: e.target.value })}
              aria-invalid={Boolean(error?.includes("para quién"))} aria-describedby={describedBy("gift-to", error?.includes("para quién") ? error : undefined)} />
          </Field>
          <Field id="gift-from" label="De parte de" error={error?.includes("de parte") ? error : undefined}>
            <Input id="gift-from" value={draft.from} maxLength={GIFT_LIMITS.name} autoComplete="name" placeholder="Lucía" onChange={(e) => set({ from: e.target.value })}
              aria-invalid={Boolean(error?.includes("de parte"))} aria-describedby={describedBy("gift-from", error?.includes("de parte") ? error : undefined)} />
          </Field>
          <Field id="gift-email" label="Email de quien lo recibe (opcional)" hint="Si tiene cuenta en Velmar, el regalo le aparece ahí sin abrir el link. En la demo no se manda ningún email." error={error?.includes("email") ? error : undefined}>
            <Input id="gift-email" type="email" inputMode="email" autoComplete="off" value={draft.toEmail} onChange={(e) => set({ toEmail: e.target.value })}
              aria-invalid={Boolean(error?.includes("email"))} aria-describedby={describedBy("gift-email", error?.includes("email") ? error : undefined, true)} />
          </Field>
          <Field id="gift-message" label="Mensaje" hint={`${left} ${left === 1 ? "carácter disponible" : "caracteres disponibles"}`} error={error?.includes("caracteres") ? error : undefined}>
            <Textarea id="gift-message" value={draft.message} maxLength={GIFT_LIMITS.message} placeholder="¡Feliz día! Para que lo disfrutes." onChange={(e) => set({ message: e.target.value })}
              aria-describedby={describedBy("gift-message", undefined, true)} />
          </Field>
          <Field id="gift-occasion" label="Ocasión" hint={`Se abre como: ${GIFT_SCENE_NAMES[draft.occasion].toLowerCase()}.`}>
            <Select id="gift-occasion" value={draft.occasion} onChange={(e) => isOccasion(e.target.value) && set({ occasion: e.target.value })} aria-describedby="gift-occasion-hint">
              <option value="velmar">Sin fecha especial (caja de Velmar)</option>
              {seasonalThemes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
          </Field>
        </div>
        {error && <p role="alert" className="sr-only">{error}</p>}
        <div className="mt-8 flex flex-col gap-2">
          <Button type="submit" size="lg"><Gift size={18} aria-hidden="true" /> Agregar regalo al carrito</Button>
          <Button variant="dark" size="lg" onClick={() => submit("buy")()}>Regalar y pagar ahora</Button>
        </div>
      </form>
    </Sheet>
  );
}
