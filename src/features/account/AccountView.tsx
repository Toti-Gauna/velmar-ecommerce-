"use client";
import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Field, Input } from "@/components/atoms/Field";
import { Skeleton } from "@/components/atoms/Skeleton";
import { useAccount } from "@/stores/account";
import { useCheckout } from "@/stores/checkout";
import { useHydrated } from "@/stores/hydration";
import { AddressesSection, MissionsSection, OrdersSection, RewardsSection } from "./AccountSections";

function DemoLogin() {
  const login = useAccount((s) => s.login);
  const [name, setName] = useState("Sofía Demo");
  const [email, setEmail] = useState("sofia.demo@ejemplo.com");
  return (
    <form onSubmit={(e) => { e.preventDefault(); login({ name: name.trim() || "Cliente demo", email }); }} className="flex max-w-md flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-surface p-5">
      <p className="text-sm text-muted">Cuenta de demostración: no hay registro ni contraseña real y nada se guarda fuera de este navegador.</p>
      <Field id="l-name" label="Nombre"><Input id="l-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></Field>
      <Field id="l-email" label="Email"><Input id="l-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></Field>
      <Button type="submit" size="lg">Entrar a la cuenta demo</Button>
    </form>
  );
}

export function AccountView() {
  const hydrated = useHydrated();
  const { user, logout, usedRewards, markRewardUsed } = useAccount();
  const lastOrder = useCheckout((s) => s.lastOrder);
  if (!hydrated) return <Skeleton className="h-80 w-full" />;
  if (!user) return <DemoLogin />;
  const sections = [
    { id: "pedidos", title: "Mis pedidos", body: <OrdersSection lastOrder={lastOrder} /> },
    { id: "misiones", title: "Misiones", body: <MissionsSection /> },
    { id: "premios", title: "Premios", body: <RewardsSection used={usedRewards} onUse={markRewardUsed} /> },
    { id: "direcciones", title: "Direcciones", body: <AddressesSection /> },
  ];
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-lg">Hola, <strong>{user.name}</strong> <span className="text-sm text-muted">({user.email} · cuenta demo)</span></p>
        <Button variant="ghost" size="sm" onClick={logout}>Salir</Button>
      </div>
      <nav aria-label="Secciones de la cuenta" className="flex gap-2 overflow-x-auto">
        {sections.map((s) => <a key={s.id} href={`#${s.id}`} className="shrink-0 rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-bold hover:bg-accent">{s.title}</a>)}
      </nav>
      {sections.map((s) => (
        <section key={s.id} id={s.id} aria-labelledby={`${s.id}-t`} className="scroll-mt-24">
          <h2 id={`${s.id}-t`} className="mb-3 text-xl font-extrabold">{s.title}</h2>
          {s.body}
        </section>
      ))}
    </div>
  );
}
