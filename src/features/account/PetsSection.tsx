"use client";
import { Cake, PawPrint, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Field, Input, describedBy } from "@/components/atoms/Field";
import { Select } from "@/components/atoms/Select";
import { BirthdayPicker, birthdayText } from "@/components/molecules/BirthdayPicker";
import { ConfirmButton } from "@/components/molecules/ConfirmButton";
import type { Pet, PetSpecies } from "@/demo/fixtures/workshop";
import { useAccount } from "@/stores/account";
import { useAdmin } from "@/stores/admin";
import { useToasts } from "@/stores/toast";
import { AccountFormDialog, newId } from "./AccountFormDialog";

const SPECIES: Record<PetSpecies, string> = { perro: "Perro", gato: "Gato", otro: "Otra" };
const NONE: Pet[] = [];

/**
 * Mis mascotas (8.4.14, pedido de Ignacio): el comprador carga a sus mascotas y su cumpleaños. Van a la misma ficha que
 * ve el dueño en el panel (Clientes), así que el saludo de cumpleaños sale igual que si las hubiera cargado el taller.
 */
export function PetsSection({ email }: { email: string }) {
  const pets = useAdmin((s) => s.workshop.profiles[email.trim().toLowerCase()]?.pets ?? NONE);
  const { savePet, removePet, syncShopAccount } = useAdmin();
  const user = useAccount((s) => s.user);
  const toast = useToasts((s) => s.push);
  const [editing, setEditing] = useState<Pet | "new" | null>(null);
  return (
    <div className="flex flex-col gap-3">
      {pets.length === 0 && <p className="rounded-2xl bg-bg p-4 text-sm text-muted">Sumá a tu mascota con su cumpleaños y ese día te mandamos un saludo (en la demo, el taller lo ve en sus recordatorios).</p>}
      <ul className="grid gap-3 sm:grid-cols-2">
        {pets.map((p) => (
          <li key={p.id} className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-brass-ink"><PawPrint size={18} aria-hidden="true" /></span>
              <div className="min-w-0 text-sm">
                <p className="font-bold">{p.name}</p>
                <p className="text-muted">{SPECIES[p.species]}{p.breed ? ` · ${p.breed}` : ""}</p>
                <p className="mt-1 flex items-center gap-1.5 font-semibold text-primary"><Cake size={14} aria-hidden="true" /> {birthdayText(p.birthday)}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={() => setEditing(p)} aria-label={`Editar a ${p.name}`}><Pencil size={14} aria-hidden="true" /> Editar</Button>
              <ConfirmButton size="sm" variant="ghost" title={`Quitar a ${p.name}`} confirmLabel="Quitar" description="Deja de figurar en tu cuenta y no recibís el saludo de su cumpleaños."
                onConfirm={() => { removePet(email, p.id); toast({ tone: "info", title: `${p.name} quitado de tu cuenta` }); }}>Quitar</ConfirmButton>
            </div>
          </li>
        ))}
      </ul>
      <Button variant="secondary" className="self-start" onClick={() => setEditing("new")}><Plus size={16} aria-hidden="true" /> Agregar mascota</Button>
      {editing && <PetForm key={editing === "new" ? "new" : editing.id} pet={editing} onClose={() => setEditing(null)}
        onSave={(pet) => { if (user) syncShopAccount(user); savePet(email, pet); setEditing(null); toast({ tone: "success", title: `${pet.name} guardado`, description: pet.birthday ? `Cumple el ${birthdayText(pet.birthday)}` : "Sin cumpleaños" }); }} />}
    </div>
  );
}

function PetForm({ pet, onSave, onClose }: { pet: Pet | "new"; onSave: (p: Pet) => void; onClose: () => void }) {
  const [draft, setDraft] = useState({ name: "", species: "perro" as PetSpecies, breed: "", birthday: "", ...(pet === "new" ? {} : { ...pet, breed: pet.breed ?? "", birthday: pet.birthday ?? "" }) });
  const [error, setError] = useState<string | undefined>();
  const save = () => {
    if (draft.name.trim().length < 2) { setError("Escribí su nombre."); return document.getElementById("pet-name")?.focus(); }
    onSave({ id: pet === "new" ? newId("pet") : pet.id, name: draft.name.trim(), species: draft.species, breed: draft.breed.trim() || undefined, birthday: draft.birthday || undefined });
  };
  return (
    <AccountFormDialog open title={pet === "new" ? "Nueva mascota" : `Editar a ${pet.name}`} intro="El cumpleaños es sin año: elegí el día y el mes." saveLabel="Guardar mascota" onSave={save} onClose={onClose}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="pet-name" label="Nombre" error={error}>
          <Input id="pet-name" data-autofocus value={draft.name} maxLength={30} placeholder="Ñoqui" aria-invalid={Boolean(error)} aria-describedby={describedBy("pet-name", error)}
            onChange={(e) => { setDraft({ ...draft, name: e.target.value }); setError(undefined); }} />
        </Field>
        <Field id="pet-species" label="Especie">
          <Select id="pet-species" value={draft.species} onChange={(e) => setDraft({ ...draft, species: e.target.value as PetSpecies })}>
            {(Object.keys(SPECIES) as PetSpecies[]).map((s) => <option key={s} value={s}>{SPECIES[s]}</option>)}
          </Select>
        </Field>
        <Field id="pet-breed" label="Raza o color (opcional)">
          <Input id="pet-breed" value={draft.breed} maxLength={40} placeholder="Mestizo" onChange={(e) => setDraft({ ...draft, breed: e.target.value })} />
        </Field>
        <div className="flex flex-col gap-1.5"><span className="text-sm font-bold">Cumpleaños</span><BirthdayPicker id="pet-bday" value={draft.birthday} onChange={(birthday) => setDraft({ ...draft, birthday })} /></div>
      </div>
    </AccountFormDialog>
  );
}
