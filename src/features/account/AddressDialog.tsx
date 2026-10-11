"use client";
import { useState } from "react";
import { Field, Input, describedBy } from "@/components/atoms/Field";
import { checkAddress, type AddressDraft, type SavedAddress } from "@/demo/engine/profile";
import { AccountFormDialog, newId } from "./AccountFormDialog";

const EMPTY: AddressDraft = { label: "", street: "", number: "", postalCode: "", city: "Mar del Plata", province: "Buenos Aires" };
const FIELDS: { key: keyof AddressDraft; label: string; auto: string; mode?: "numeric"; placeholder?: string; wide?: boolean }[] = [
  { key: "label", label: "Nombre de la dirección", auto: "off", placeholder: "Casa, Trabajo, Lo de mamá…", wide: true },
  { key: "street", label: "Calle", auto: "address-line1" },
  { key: "number", label: "Altura", auto: "address-line2" },
  { key: "postalCode", label: "Código postal", auto: "postal-code", mode: "numeric" },
  { key: "city", label: "Ciudad", auto: "address-level2" },
  { key: "province", label: "Provincia", auto: "address-level1", wide: true },
];

/** Alta o edición de una dirección (8.4.6). Mismas reglas que el paso Entrega del checkout. */
export function AddressDialog({ address, onSave, onClose }: { address: SavedAddress | "new" | null; onSave: (a: SavedAddress) => void; onClose: () => void }) {
  return address ? <Form key={address === "new" ? "new" : address.id} address={address} onSave={onSave} onClose={onClose} /> : null;
}

function Form({ address, onSave, onClose }: { address: SavedAddress | "new"; onSave: (a: SavedAddress) => void; onClose: () => void }) {
  const [draft, setDraft] = useState<AddressDraft>(address === "new" ? EMPTY : address);
  const [tried, setTried] = useState(false);
  const errors = tried ? checkAddress(draft) : {};
  const save = () => {
    setTried(true);
    const e = checkAddress(draft);
    const first = FIELDS.find((f) => e[f.key]);
    if (first) return document.getElementById(`addr-${first.key}`)?.focus();
    onSave({ id: address === "new" ? newId("dir") : address.id, ...Object.fromEntries(Object.entries(draft).map(([k, v]) => [k, v.trim()])) as AddressDraft });
  };
  return (
    <AccountFormDialog open title={address === "new" ? "Nueva dirección" : "Editar dirección"} intro="Queda en tu cuenta y la podés elegir en el checkout. En la demo se guarda solo en este navegador."
      saveLabel="Guardar dirección" onSave={save} onClose={onClose}>
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <Field key={f.key} id={`addr-${f.key}`} label={f.label} error={errors[f.key]} className={f.wide ? "sm:col-span-2" : undefined}>
            <Input id={`addr-${f.key}`} value={draft[f.key]} autoComplete={f.auto} inputMode={f.mode} placeholder={f.placeholder} data-autofocus={f.key === "label" ? true : undefined}
              aria-invalid={Boolean(errors[f.key])} aria-describedby={describedBy(`addr-${f.key}`, errors[f.key])} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} />
          </Field>
        ))}
      </div>
    </AccountFormDialog>
  );
}
