"use client";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowRight, Check, Gift } from "lucide-react";
import type { CSSProperties, PointerEvent } from "react";
import { ButtonLink } from "@/components/atoms/Button";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { brand } from "@/config/brand";

const delay = (ms: number) => ({ animationDelay: `${ms}ms` }) as CSSProperties;

/** Hero editorial. El texto entra por CSS (visible sin JS); la composición tiene parallax suave con el puntero. */
export function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 20 });
  const sy = useSpring(my, { stiffness: 120, damping: 20 });
  const far = { x: useTransform(sx, (v) => v * 18), y: useTransform(sy, (v) => v * 14) };
  const near = { x: useTransform(sx, (v) => v * -26), y: useTransform(sy, (v) => v * -20) };
  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  return (
    <section onPointerMove={onMove} onPointerLeave={() => { mx.set(0); my.set(0); }} aria-labelledby="hero-title"
      className="relative -mx-4 -mt-6 overflow-hidden rounded-b-[2.5rem] bg-[radial-gradient(120%_90%_at_80%_10%,#efe5d2_0%,var(--color-bg)_55%)] px-4 pb-14 pt-10 sm:-mx-6 sm:-mt-10 sm:px-6 lg:pb-20 lg:pt-16">
      <div className="chevron-pattern pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="eyebrow animate-rise text-brass-ink" style={delay(80)}>{brand.city} · Taller de objetos a pedido</p>
          <h1 id="hero-title" className="font-display mt-5 text-[clamp(2.7rem,7.2vw,5.6rem)] leading-[0.98] text-ink">
            <span className="animate-rise block" style={delay(160)}>Objetos con alma,</span>
            <span className="animate-rise block italic text-primary" style={delay(260)}>hechos a pedido</span>
            <span className="animate-rise block" style={delay(360)}>para tu casa y tu mascota.</span>
          </h1>
          <p className="animate-rise mt-6 max-w-lg text-lg leading-relaxed text-muted" style={delay(460)}>
            Escribí el nombre, subí la foto y <strong className="text-ink">mirá tu pieza antes de pagar</strong>. La aprobás y llega igual al taller.
          </p>
          <div className="animate-rise mt-8 flex flex-wrap gap-3" style={delay(560)}>
            <ButtonLink href="/crear/" size="lg">Crear mi pieza <ArrowRight size={18} aria-hidden="true" className="transition-transform group-hover/btn:translate-x-1" /></ButtonLink>
            <ButtonLink href="/categorias/" variant="secondary" size="lg">Ver la tienda</ButtonLink>
          </div>
          <ul className="animate-rise mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-muted" style={delay(660)}>
            {["Vista previa antes de pagar", "Mercado Pago, QR o transferencia", "Envíos a todo el país"].map((t) => (
              <li key={t} className="flex items-center gap-2"><Check size={16} aria-hidden="true" className="text-primary" />{t}</li>
            ))}
          </ul>
        </div>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px]" aria-hidden="true">
          <motion.div style={far} className="animate-fade-in absolute inset-x-6 bottom-0 top-0 overflow-hidden rounded-t-full rounded-b-[2.5rem] shadow-[var(--shadow-lift)]">
            <ProductArt art="lamp-photo" label="" showBadge={false} className="h-full w-full [&>svg]:h-full [&>svg]:w-full [&>svg]:object-cover" />
          </motion.div>
          <motion.div style={near} className="absolute -left-2 bottom-16 w-40 rounded-3xl bg-surface p-2.5 shadow-[var(--shadow-lift)] sm:-left-8 sm:w-48">
            <ProductArt art="bowl-dog" tint="#8cbfe0" label="" showBadge={false} className="aspect-square rounded-2xl" />
            <p className="mt-2 px-1 text-sm font-bold">Comedero perro globo</p>
            <p className="px-1 text-xs text-muted">desde $ 18.500</p>
          </motion.div>
          <motion.div style={near} className="absolute -right-1 top-10 flex items-center gap-2 rounded-2xl bg-surface px-3 py-2.5 shadow-[var(--shadow-lift)] sm:-right-6">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-success text-white"><Check size={16} /></span>
            <span className="text-sm"><span className="block font-bold">Vista previa aprobada</span><span className="font-script text-lg leading-none text-primary">“Ñoqui”</span></span>
          </motion.div>
          <motion.div style={far} className="absolute -right-2 bottom-4 flex items-center gap-2 rounded-2xl bg-night px-3 py-2.5 text-[#f6f1e8] shadow-[var(--shadow-lift)] sm:-right-10">
            <Gift size={18} className="text-brass" />
            <span className="text-xs"><span className="block font-bold">Club Velmar</span>1 de 2 · llavero de regalo</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
