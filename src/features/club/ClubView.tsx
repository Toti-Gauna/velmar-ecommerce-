"use client";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { demoAccountProgress } from "@/demo/fixtures/commerce";
import { useAccount } from "@/stores/account";
import { useDemoData } from "@/stores/admin";
import { MissionCard } from "./MissionCard";
import { MissionPath } from "./MissionPath";
import { RewardsWallet } from "./RewardsWallet";
import { WheelSpinner } from "./WheelSpinner";

const RULES = ["Solo suman pedidos pagados.", "Cada premio es de un uso y vence.", "Lo que sobra pasa a la misión siguiente.", "Ilustrativo: en la tienda real se calcula en el servidor."];

export function ClubView() {
  const all = useDemoData((d) => d.missions);
  const missions = all.filter((m) => m.active !== false);
  const { user, login } = useAccount();
  const done = all.reduce((s, m) => s + (m.completedCount ?? 0), 0);
  return (
    <div className="flex flex-col gap-16">
      <section className="relative -mx-4 -mt-6 overflow-hidden rounded-b-[2.5rem] bg-night px-6 pb-14 pt-14 text-[#f6f1e8] sm:-mx-6 sm:-mt-10 sm:px-10 lg:pt-20">
        <div aria-hidden="true" className="absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,rgb(210_173_105/0.25),transparent)]" />
        <p className="eyebrow animate-rise text-brass">Club Velmar</p>
        <h1 className="font-display animate-rise mt-4 max-w-3xl text-[clamp(2.6rem,6.5vw,5rem)] leading-[1]" style={{ animationDelay: "120ms" }}>Comprás, sumás, <span className="italic text-brass">ganás.</span></h1>
        <p className="animate-rise mt-5 max-w-xl text-lg text-[#cfc6b3]" style={{ animationDelay: "220ms" }}>Misiones simples, premios en producto y una ruleta para tu próxima compra.</p>
        <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4">
          <div><dt className="text-xs text-[#cfc6b3]">Misiones activas</dt><dd className="font-display text-4xl"><Counter value={missions.length} /></dd></div>
          <div><dt className="text-xs text-[#cfc6b3]">Completadas (demo)</dt><dd className="font-display text-4xl"><Counter value={done} /></dd></div>
          <div><dt className="text-xs text-[#cfc6b3]">Premios en producto</dt><dd className="font-display text-4xl"><Counter value={missions.length} /></dd></div>
        </dl>
        {!user && (
          <Button variant="light" className="mt-8" onClick={() => login({ name: "Sofía Demo", email: "sofia.demo@ejemplo.com" })}>
            <Sparkles size={18} aria-hidden="true" /> Ver mi progreso con la cuenta demo
          </Button>
        )}
      </section>
      <section aria-labelledby="mis">
        <Reveal><h2 id="mis" className="font-display text-4xl sm:text-5xl">Tus misiones {!user && <span className="text-base text-muted">(progreso en cero sin cuenta)</span>}</h2></Reveal>
        <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {missions.map((m, i) => <Reveal as="li" key={m.id} delay={i * 0.08}><MissionCard mission={m} progress={user ? (demoAccountProgress[m.id] ?? 0) : 0} /></Reveal>)}
        </ul>
      </section>
      <section aria-labelledby="ruleta" className="grid items-center gap-10 rounded-[2.5rem] bg-surface p-6 shadow-[var(--shadow-card)] sm:p-10 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow text-brass-ink">Ruleta de cupones</p>
          <h2 id="ruleta" className="font-display mt-3 text-4xl sm:text-5xl">Girá y <span className="italic text-primary">llevate un premio</span></h2>
          <p className="mt-4 max-w-md text-muted">Envío gratis, grabado gratis, un llavero de regalo o un descuento para tu próxima compra. Todos los premios ganan.</p>
        </Reveal>
        <WheelSpinner />
      </section>
      <section aria-labelledby="path" className="rounded-[2.5rem] bg-night p-6 text-[#f6f1e8] sm:p-10">
        <h2 id="path" className="font-display mb-6 text-3xl sm:text-4xl">Camino de premios</h2>
        <MissionPath missions={missions} />
      </section>
      <section aria-labelledby="wallet">
        <h2 id="wallet" className="font-display mb-6 text-3xl sm:text-4xl">Tus premios</h2>
        <RewardsWallet />
        <ul className="mt-8 grid gap-2 text-sm text-muted sm:grid-cols-2">{RULES.map((r) => <li key={r}>· {r}</li>)}</ul>
        <Link href="/cuenta/" className="mt-4 inline-block text-sm font-bold text-primary underline">Ver mi cuenta</Link>
      </section>
    </div>
  );
}
