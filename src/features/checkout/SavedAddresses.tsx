"use client";
import { MapPin, Plus } from "lucide-react";
import { OptionCard } from "@/components/atoms/OptionCard";
import { addressLine, type SavedAddress } from "@/demo/engine/profile";

/** Valor del selector cuando se escribe una dirección nueva. */
export const OTHER_ADDRESS = "otra";

/**
 * 8.4.6: con la sesión abierta, las direcciones de "Mis direcciones" se eligen con un toque en el paso Entrega; "Otra
 * dirección" abre los campos de siempre.
 */
export function SavedAddresses({ addresses, main, value, onChange }: { addresses: SavedAddress[]; main?: string; value: string; onChange: (id: string) => void }) {
  return (
    <fieldset className="animate-fade-up flex flex-col gap-3">
      <legend className="mb-1 font-bold">¿A qué dirección?</legend>
      {addresses.map((a) => (
        <OptionCard key={a.id} name="saved-address" value={a.id} checked={value === a.id} onChange={onChange} icon={<MapPin size={20} aria-hidden="true" />}
          title={a.label} description={addressLine(a)} aside={a.id === main ? <span className="text-xs font-bold text-success">Principal</span> : undefined} />
      ))}
      <OptionCard name="saved-address" value={OTHER_ADDRESS} checked={value === OTHER_ADDRESS} onChange={onChange} icon={<Plus size={20} aria-hidden="true" />}
        title="Otra dirección" description="Escribila acá; si querés, la guardás en tu cuenta." />
    </fieldset>
  );
}

/** ¿Es la misma dirección (sin contar el nombre)? */
export const sameAddress = (a: Omit<SavedAddress, "id" | "label">, b: Omit<SavedAddress, "id" | "label">) =>
  a.street.trim() === b.street.trim() && a.number.trim() === b.number.trim() && a.postalCode.trim() === b.postalCode.trim();
