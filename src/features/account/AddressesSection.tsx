"use client";
import { MapPin, Pencil, Plus, Star } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { ConfirmButton } from "@/components/molecules/ConfirmButton";
import { addressLine, type SavedAddress } from "@/demo/engine/profile";
import { useAccountProfile, useProfile } from "@/stores/profile";
import { useToasts } from "@/stores/toast";
import { AddressDialog } from "./AddressDialog";

/** Mis direcciones (8.4.6, pedido de Ignacio): agregar, editar, quitar y elegir la principal, en un modal. */
export function AddressesSection({ email }: { email: string }) {
  const { addresses, mainAddress } = useAccountProfile(email);
  const { saveAddress, removeAddress, setMainAddress } = useProfile();
  const toast = useToasts((s) => s.push);
  const [editing, setEditing] = useState<SavedAddress | "new" | null>(null);
  return (
    <div className="flex flex-col gap-3">
      {addresses.length === 0 && <p className="rounded-2xl bg-bg p-4 text-sm text-muted">Todavía no guardaste direcciones. Agregá una y la elegís en el checkout con un toque.</p>}
      <ul className="grid gap-3 sm:grid-cols-2">
        {addresses.map((a) => (
          <li key={a.id} className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-start gap-3">
              <MapPin size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
              <div className="min-w-0 text-sm">
                <p className="flex flex-wrap items-center gap-2 font-bold">{a.label}{a.id === mainAddress && <Badge tone="success">Principal</Badge>}</p>
                <p className="text-muted">{addressLine(a)}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={() => setEditing(a)} aria-label={`Editar ${a.label}`}><Pencil size={14} aria-hidden="true" /> Editar</Button>
              {a.id !== mainAddress && <Button size="sm" variant="ghost" onClick={() => { setMainAddress(email, a.id); toast({ tone: "success", title: `${a.label} es tu dirección principal` }); }}><Star size={14} aria-hidden="true" /> Usar como principal</Button>}
              <ConfirmButton size="sm" variant="ghost" title={`Quitar ${a.label}`} confirmLabel="Quitar" description="La dirección sale de tu cuenta. Los pedidos ya hechos no cambian."
                onConfirm={() => { removeAddress(email, a.id); toast({ tone: "info", title: "Dirección quitada", description: a.label }); }}>Quitar</ConfirmButton>
            </div>
          </li>
        ))}
      </ul>
      <Button variant="secondary" className="self-start" onClick={() => setEditing("new")}><Plus size={16} aria-hidden="true" /> Agregar dirección</Button>
      <AddressDialog address={editing} onClose={() => setEditing(null)}
        onSave={(a) => { saveAddress(email, a); setEditing(null); toast({ tone: "success", title: "Dirección guardada", description: a.label }); }} />
    </div>
  );
}
