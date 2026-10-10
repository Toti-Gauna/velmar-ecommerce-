"use client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ProductArt } from "@/components/illustrations/ProductArt";
import type { CarouselSlide } from "@/demo/types";
import { cn } from "@/lib/cn";
import { scrollBehavior } from "@/lib/scroll";
import { useHydrated } from "@/stores/hydration";

/** Fondos que rotan por diapositiva: noche, oliva (mezcla de noche y primario: oscuro en cualquier temática) y arcilla. */
const TONES = [
  { bg: "bg-night", eyebrow: "text-brass", glow: "rgb(210_173_105/0.28)" },
  { bg: "bg-[color-mix(in_oklab,var(--c-night-2)_68%,var(--color-primary))]", eyebrow: "text-[#e9d9b4]", glow: "rgb(255_253_248/0.22)" },
  { bg: "bg-[#6d3a26]", eyebrow: "text-[#f1cfa0]", glow: "rgb(241_207_160/0.26)" },
];

const INTERVAL = 4000;

/**
 * Carrusel principal del inicio (editable desde el panel). Avanza solo cada 4 s; se frena al tocarlo,
 * al pasar el mouse o con foco, tiene botón de pausa y con "reducir movimiento" no avanza solo.
 * `lead`: diapositiva propia que va primero (el banner de la temática vigente).
 * Desde tablet, las flechas van en franjas laterales reservadas (`--hero-safe`: margen + flecha + 1 rem de aire) y
 * el contenido de cada diapositiva arranca después de esa franja: ninguna flecha pisa el título ni la imagen.
 */
export function HeroCarousel({ slides, lead }: { slides: CarouselSlide[]; lead?: { node: ReactNode; label: string } }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hold, setHold] = useState(false);
  // Hasta hidratar se muestra lo mismo que el servidor; si no, con "reducir movimiento" React rehace todo el árbol.
  const hydrated = useHydrated();
  const reduce = useReducedMotion() === true && hydrated;
  const total = slides.length + (lead ? 1 : 0);
  const offset = lead ? 1 : 0;
  const auto = !paused && !hold && !reduce && total > 1;
  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const next = (i + total) % total;
    el.scrollTo({ left: next * el.clientWidth, behavior: scrollBehavior() });
    setIndex(next);
  };
  useEffect(() => {
    if (!auto) return;
    const t = window.setTimeout(() => go(index + 1), INTERVAL);
    return () => window.clearTimeout(t);
  });
  if (total === 0) return null;
  const arrow = "absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-[#fffdf8]/90 text-night shadow-[var(--shadow-card)] backdrop-blur transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fffdf8] sm:grid lg:h-12 lg:w-12";
  return (
    <section aria-roledescription="carrusel" aria-label="Destacados de Velmar" className="relative -mx-4 -mt-6 sm:mx-0 sm:mt-0 sm:[--hero-safe:4.5rem] lg:[--hero-safe:5.5rem]"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHold(true)} onPointerLeave={() => setHold(false)} onTouchStart={() => setPaused(true)}
      onFocusCapture={() => setHold(true)} onBlurCapture={() => setHold(false)}>
      <div ref={track} onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / Math.max(1, e.currentTarget.clientWidth)))}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain sm:rounded-[2rem]">
        {lead && (
          <div role="group" aria-roledescription="diapositiva" aria-label={`1 de ${total}: ${lead.label}`} className="relative flex w-full shrink-0 snap-center">{lead.node}</div>
        )}
        {slides.map((s, j) => {
          const i = j + offset;
          const tone = TONES[j % TONES.length]!;
          return (
            <Link key={s.id} href={s.ctaHref} role="group" aria-roledescription="diapositiva" aria-label={`${i + 1} de ${total}: ${s.title}`}
              className={cn("group relative grid min-h-[19rem] w-full shrink-0 snap-center grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] overflow-hidden text-[#fffdf8] sm:min-h-[26rem] sm:grid-cols-[1.05fr_1fr]", tone.bg)}>
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(135deg,#fff_0_1px,transparent_1px_22px)]" />
              <div className="relative z-10 flex flex-col justify-center py-8 pl-5 pr-1 sm:py-12 sm:pl-[var(--hero-safe)] sm:pr-6 lg:pr-8">
                <p className={cn("eyebrow", tone.eyebrow)}>Velmar · {String(j + 1).padStart(2, "0")}</p>
                <p className="font-display mt-2 text-[1.75rem] leading-[1.04] sm:mt-3 sm:text-5xl lg:text-6xl">{s.title}</p>
                <p className="mt-2 line-clamp-2 max-w-md text-[13px] text-white/80 sm:mt-3 sm:line-clamp-none sm:text-lg">{s.subtitle}</p>
                <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#fffdf8] px-4 py-2.5 text-[13px] font-bold sm:mt-6 sm:px-6 sm:py-3 sm:text-sm text-night shadow-[0_12px_30px_-14px_rgb(0_0_0/0.6)] transition-transform group-hover:translate-x-1">
                  {s.ctaLabel} <ArrowRight size={16} aria-hidden="true" />
                </span>
              </div>
              <div className="relative grid place-items-center py-8 pl-1 pr-5 sm:py-8 sm:pl-6 sm:pr-[var(--hero-safe)]">
                <div aria-hidden="true" className="absolute inset-0 m-auto aspect-square w-[85%]" style={{ background: `radial-gradient(closest-side, ${tone.glow.replace(/_/g, " ")}, transparent)` }} />
                <ProductArt art={s.art} label="" showBadge={false} className="relative aspect-square w-full max-w-[19rem] overflow-hidden rounded-[1.4rem] sm:rounded-[2rem] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.65)] transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.03] sm:max-w-[22rem]" />
              </div>
            </Link>
          );
        })}
      </div>
      {total > 1 && (
        <>
          <button type="button" aria-label="Diapositiva anterior" onClick={() => go(index - 1)} className={cn(arrow, "left-3 lg:left-5")}><ArrowLeft size={20} aria-hidden="true" /></button>
          <button type="button" aria-label="Diapositiva siguiente" onClick={() => go(index + 1)} className={cn(arrow, "right-3 lg:right-5")}><ArrowRight size={20} aria-hidden="true" /></button>
          <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused || reduce ? "Reproducir carrusel" : "Pausar carrusel"}
            className="absolute bottom-2 right-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/25 text-white backdrop-blur transition hover:bg-black/40 sm:bottom-4 sm:right-5">
            {paused || reduce ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          </button>
          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1 sm:bottom-4">
            {Array.from({ length: total }, (_, i) => (
              <button key={i} type="button" onClick={() => go(i)} aria-label={`Ir a la diapositiva ${i + 1}`} aria-current={i === index ? "true" : undefined} className="grid h-6 min-w-6 place-items-center px-0.5">
                <span className={cn("block h-1.5 rounded-full transition-all duration-500", i === index ? "w-8 bg-[#fffdf8]" : "w-1.5 bg-white/40")} />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
