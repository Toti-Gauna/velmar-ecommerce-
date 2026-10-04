"use client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";
import type { CarouselSlide } from "@/demo/types";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { cn } from "@/lib/cn";

/** Carrusel editorial (contenido editable desde el panel). Scroll-snap, sin autoplay. */
export function Carousel({ slides }: { slides: CarouselSlide[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const go = (i: number) => {
    const el = track.current;
    const card = el?.children[0] as HTMLElement | undefined;
    if (!el || !card) return;
    const next = Math.max(0, Math.min(slides.length - 1, i));
    el.scrollTo({ left: next * (card.offsetWidth + 16), behavior: "smooth" });
    setIndex(next);
  };
  return (
    <section aria-roledescription="carrusel" aria-label="Destacados" className="relative">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-brass-ink">En el taller ahora</p>
          <h2 className="font-display mt-3 text-4xl sm:text-5xl">Destacados</h2>
        </div>
        <div className="flex gap-2">
          <button type="button" aria-label="Anterior" disabled={index === 0} onClick={() => go(index - 1)} className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 bg-surface transition-colors hover:bg-ink hover:text-surface disabled:opacity-30"><ArrowLeft size={20} aria-hidden="true" /></button>
          <button type="button" aria-label="Siguiente" disabled={index >= slides.length - 1} onClick={() => go(index + 1)} className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 bg-surface transition-colors hover:bg-ink hover:text-surface disabled:opacity-30"><ArrowRight size={20} aria-hidden="true" /></button>
        </div>
      </div>
      <div ref={track} onScroll={(e) => {
        const card = e.currentTarget.children[0] as HTMLElement | undefined;
        if (card) setIndex(Math.round(e.currentTarget.scrollLeft / (card.offsetWidth + 16)));
      }} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
        {slides.map((s, i) => (
          <Link key={s.id} href={s.ctaHref} role="group" aria-roledescription="diapositiva" aria-label={`${i + 1} de ${slides.length}: ${s.title}`}
            className="group relative aspect-[4/5] w-[82%] shrink-0 snap-start overflow-hidden rounded-[2rem] shadow-[var(--shadow-card)] sm:aspect-[16/11] sm:w-[60%] lg:w-[46%]">
            <ProductArt art={s.art} label={s.title} showBadge={false} className="absolute inset-0 transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-105 [&>svg]:h-full" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-[#fffdf8] sm:p-8">
              <p className="font-display text-3xl leading-tight sm:text-4xl">{s.title}</p>
              <p className="mt-2 max-w-sm text-sm opacity-90 sm:text-base">{s.subtitle}</p>
              <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#fffdf8] px-5 py-2.5 text-sm font-bold text-night">{s.ctaLabel} <ArrowUpRight size={16} aria-hidden="true" /></span>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-5 flex justify-center gap-2" aria-hidden="true">
        {slides.map((s, i) => <span key={s.id} className={cn("h-1.5 rounded-full transition-all duration-500", i === index ? "w-8 bg-primary" : "w-1.5 bg-ink/20")} />)}
      </div>
    </section>
  );
}
