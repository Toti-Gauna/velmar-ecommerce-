"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Mail, PawPrint, Phone, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Field";
import { EmptyState } from "@/components/molecules/EmptyState";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { customerRows } from "@/demo/admin/customers";
import { remindersFor } from "@/demo/admin/workshop/reminders";
import { getProduct } from "@/demo/engine/catalog";
import { DEMO_TODAY } from "@/demo/fixtures/admin-orders";
import type { PetSpecies } from "@/demo/fixtures/workshop";
import { formatDate, formatDateTime } from "@/lib/date";
import { formatARS } from "@/lib/money";
import { useAdmin } from "@/stores/admin";
import { useDemoSave } from "../useDemoSave";
import { ReminderList } from "./Reminders";

const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const SPECIES: Record<PetSpecies, string> = { perro: "Perro", gato: "Gato", otro: "Otra" };
const birthdayText = (mmdd?: string) => (mmdd ? `${Number(mmdd.slice(3))} de ${MONTHS[Number(mmdd.slice(0, 2)) - 1]}` : "Sin cumpleaños");

/** Cumpleaños sin año: día y mes por separado. */
function BirthdayPicker({ id, value, onChange }: { id: string; value: string; onChange: (mmdd: string) => void }) {
  const [m, d] = value ? [value.slice(0, 2), value.slice(3)] : ["", ""];
  const set = (mm: string, dd: string) => onChange(mm && dd ? `${mm}-${dd}` : "");
  const cls = "h-12 rounded-2xl border border-ink/12 bg-surface px-3 font-semibold";
  return (
    <span className="flex gap-2">
      <label htmlFor={`${id}-d`} className="sr-only">Día del cumpleaños</label>
      <select id={`${id}-d`} value={d} onChange={(e) => set(m || "01", e.target.value)} className={`${cls} w-20`}>
        <option value="">Día</option>
        {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0")).map((x) => <option key={x} value={x}>{Number(x)}</option>)}
      </select>
      <label htmlFor={`${id}-m`} className="sr-only">Mes del cumpleaños</label>
      <select id={`${id}-m`} value={m} onChange={(e) => set(e.target.value, d || "01")} className={`${cls} min-w-0 flex-1`}>
        <option value="">Mes</option>
        {MONTHS.map((x, i) => <option key={x} value={String(i + 1).padStart(2, "0")}>{x}</option>)}
      </select>
    </span>
  );
}

/** Ficha del cliente (pedido de Ignacio, fuera de la especificación): historial, mascotas, fechas, notas y recordatorios. */
export function CustomerProfile() {
  const email = useSearchParams().get("email") ?? "";
  const users = useAdmin((s) => s.users);
  const orders = useAdmin((s) => s.orders);
  const products = useAdmin((s) => s.data.products);
  const { profiles, settings } = useAdmin((s) => s.workshop);
  const { savePet, removePet, addCustomerNote, setCustomerBirthday } = useAdmin();
  const save = useDemoSave();
  const [pet, setPet] = useState({ name: "", species: "perro" as PetSpecies, breed: "", birthday: "" });
  const [note, setNote] = useState("");
  const customer = customerRows(users, orders).find((c) => c.email.toLowerCase() === email.toLowerCase());
  if (!customer) {
    return <EmptyState title="No encontramos ese cliente" action={<Link href="/admin-demo/usuarios/" className="font-bold text-primary underline">Volver a Clientes</Link>}>Puede que el enlace sea viejo o que la demo se haya reiniciado.</EmptyState>;
  }
  const profile = profiles[customer.email.toLowerCase()] ?? { pets: [], notes: [] };
  const reminders = remindersFor(customer, profile, products, settings, DEMO_TODAY, 60);
  const bought = new Map<string, number>();
  for (const o of customer.orders) for (const l of o.lines) bought.set(l.productSlug, (bought.get(l.productSlug) ?? 0) + l.quantity);
  const stat = (label: string, value: string) => <div className="rounded-2xl bg-surface p-3 shadow-[var(--shadow-card)]"><p className="text-xs font-bold text-muted">{label}</p><p className="mt-0.5 text-lg font-extrabold tabular-nums">{value}</p></div>;
  const card = "rounded-[1.75rem] bg-surface p-5 shadow-[var(--shadow-card)]";
  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin-demo/usuarios/" className="inline-flex items-center gap-1.5 self-start text-sm font-bold text-muted hover:text-ink"><ArrowLeft size={16} aria-hidden="true" /> Clientes</Link>
      <header className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <div className="min-w-0 flex-1">
          <p className="eyebrow text-muted">{customer.registered ? "Cuenta registrada" : "Compró como invitado"}</p>
          <h1 className="font-display mt-1 text-4xl sm:text-5xl">{customer.name} <span className="font-sans align-middle text-sm font-bold text-warning">(demo)</span></h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            <Badge tone={customer.segment === "VIP" ? "brand" : "neutral"}>{customer.segment}</Badge>
            <span className="flex items-center gap-1.5"><Mail size={14} aria-hidden="true" />{customer.email}</span>
            {customer.phone && <span className="flex items-center gap-1.5"><Phone size={14} aria-hidden="true" />{customer.phone}</span>}
          </div>
        </div>
      </header>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stat("Total pagado", formatARS(customer.totalSpent))}
        {stat("Pedidos", String(customer.orders.length))}
        {stat("Ticket promedio", customer.avgTicket ? formatARS(customer.avgTicket) : "—")}
        {stat("Última compra", customer.lastOrderAt ? formatDate(customer.lastOrderAt) : "—")}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <section aria-labelledby="p-rem" className={card}>
            <h2 id="p-rem" className="mb-3 font-bold">Recordatorios (próximos 60 días)</h2>
            {reminders.length ? <ReminderList reminders={reminders} /> : <p className="text-sm text-muted">Nada por ahora. Cargá el cumpleaños de sus mascotas para que aparezcan acá y en Clientes.</p>}
          </section>
          <section aria-labelledby="p-orders" className={card}>
            <h2 id="p-orders" className="mb-3 font-bold">Historial de compras</h2>
            {customer.orders.length ? (
              <ul className="flex flex-col gap-2">
                {customer.orders.map((o) => (
                  <li key={o.code}>
                    <Link href={`/admin-demo/pedidos/detalle/?codigo=${o.code}`} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl bg-bg p-3 hover:ring-1 hover:ring-primary">
                      <span className="min-w-0 flex-1"><span className="block font-bold">{o.code}</span><span className="text-xs text-muted">{formatDate(o.createdAt)} · {o.lines.map((l) => getProduct(l.productSlug)?.name ?? l.productSlug).join(", ")}</span></span>
                      <StatusBadge status={o.status} /><span className="font-bold tabular-nums">{formatARS(o.total)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted">Sin compras.</p>}
            {bought.size > 0 && <p className="mt-3 text-sm text-muted">Compró: {[...bought].map(([slug, n]) => `${getProduct(slug)?.name ?? slug}${n > 1 ? ` × ${n}` : ""}`).join(" · ")}</p>}
          </section>
        </div>
        <div className="flex flex-col gap-6">
          <section aria-labelledby="p-pets" className={card}>
            <h2 id="p-pets" className="mb-3 flex items-center gap-2 font-bold"><PawPrint size={18} aria-hidden="true" className="text-brass-ink" /> Mascotas</h2>
            {profile.pets.length ? (
              <ul className="mb-4 flex flex-col divide-y divide-line">
                {profile.pets.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 py-2.5">
                    <span className="min-w-0 flex-1"><span className="block font-bold">{p.name}</span><span className="text-sm text-muted">{SPECIES[p.species]}{p.breed ? ` · ${p.breed}` : ""} · {birthdayText(p.birthday)}</span></span>
                    <button type="button" aria-label={`Quitar a ${p.name}`} onClick={() => save(`${p.name} quitado de la ficha`, () => removePet(customer.email, p.id))}
                      className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-danger-soft hover:text-danger"><Trash2 size={16} aria-hidden="true" /></button>
                  </li>
                ))}
              </ul>
            ) : <p className="mb-4 text-sm text-muted">Sin mascotas cargadas.</p>}
            <form className="flex flex-col gap-3 rounded-2xl bg-bg p-3" onSubmit={(e) => {
              e.preventDefault();
              if (!pet.name.trim()) return;
              save(`${pet.name.trim()} agregado a la ficha`, () => savePet(customer.email, { id: `pet-${Date.now().toString(36)}`, name: pet.name.trim(), species: pet.species, breed: pet.breed.trim() || undefined, birthday: pet.birthday || undefined }));
              setPet({ name: "", species: "perro", breed: "", birthday: "" });
            }}>
              <p className="text-sm font-bold">Agregar mascota</p>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-1 text-xs font-bold">Nombre<Input value={pet.name} onChange={(e) => setPet({ ...pet, name: e.target.value })} placeholder="Pancho" /></label>
                <label className="flex flex-col gap-1 text-xs font-bold">Especie
                  <select value={pet.species} onChange={(e) => setPet({ ...pet, species: e.target.value as PetSpecies })} className="h-12 rounded-2xl border border-ink/12 bg-surface px-3 text-base font-semibold">
                    {(Object.keys(SPECIES) as PetSpecies[]).map((s) => <option key={s} value={s}>{SPECIES[s]}</option>)}
                  </select>
                </label>
              </div>
              <label className="flex flex-col gap-1 text-xs font-bold">Raza o color<Input value={pet.breed} onChange={(e) => setPet({ ...pet, breed: e.target.value })} placeholder="Opcional" /></label>
              <div className="flex flex-col gap-1 text-xs font-bold">Cumpleaños<BirthdayPicker id="pet-bday" value={pet.birthday} onChange={(birthday) => setPet({ ...pet, birthday })} /></div>
              <Button type="submit" variant="secondary" size="sm" disabled={!pet.name.trim()} className="self-start"><Plus size={16} aria-hidden="true" /> Agregar</Button>
            </form>
          </section>
          <section aria-labelledby="p-bday" className={card}>
            <h2 id="p-bday" className="mb-2 font-bold">Cumpleaños del cliente</h2>
            <BirthdayPicker id="cust-bday" value={profile.birthday ?? ""} onChange={(b) => save(b ? `Cumpleaños: ${birthdayText(b)}` : "Cumpleaños borrado", () => setCustomerBirthday(customer.email, b || undefined))} />
          </section>
          <section aria-labelledby="p-notes" className={card}>
            <h2 id="p-notes" className="mb-3 font-bold">Notas internas</h2>
            <form className="mb-3 flex flex-col gap-2" onSubmit={(e) => { e.preventDefault(); if (!note.trim()) return; save("Nota guardada", () => addCustomerNote(customer.email, note)); setNote(""); }}>
              <label htmlFor="p-note" className="sr-only">Nota nueva</label>
              <textarea id="p-note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Prefiere retirar los sábados, alérgico a la lavanda…" className="rounded-2xl border border-ink/12 bg-bg p-3 text-base" />
              <Button type="submit" variant="secondary" size="sm" disabled={!note.trim()} className="self-start">Guardar nota</Button>
            </form>
            {profile.notes.length ? (
              <ul className="flex flex-col gap-2">{profile.notes.map((n) => <li key={n.at + n.text} className="rounded-2xl bg-bg p-3 text-sm"><p>{n.text}</p><p className="mt-1 text-xs text-muted">{formatDateTime(n.at)}</p></li>)}</ul>
            ) : <p className="text-sm text-muted">Sin notas.</p>}
          </section>
        </div>
      </div>
    </div>
  );
}
