"use client";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import type { CarouselSlide } from "@/demo/types";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { buttonClass } from "@/components/atoms/Button";
import { cn } from "@/lib/cn";

/** Carrusel con scroll-snap. Sin autoplay (no hay animaciones permanentes). */
export function Carousel({ slides }: { slides: CarouselSlide[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const next = (i + slides.length) % slides.length;
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    setIndex(next);
  };
  return (
    <section aria-roledescription="carrusel" aria-label="Destacados" className="relative">
      <div
        ref={track}
        onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-[var(--radius-card)] [scrollbar-width:none]"
      >
        {slides.map((s, i) => (
          <div key={s.id} role="group" aria-roledescription="diapositiva" aria-label={`${i + 1} de ${slides.length}`} className="grid w-full shrink-0 snap-start grid-cols-1 items-center gap-4 bg-accent p-5 sm:grid-cols-2 sm:p-10">
            <div className="order-2 flex flex-col items-start gap-3 sm:order-1">
              <h2 className="text-2xl font-extrabold leading-tight text-ink sm:text-4xl">{s.title}</h2>
              <p className="text-muted sm:text-lg">{s.subtitle}</p>
              <Link href={s.ctaHref} tabIndex={i === index ? 0 : -1} className={buttonClass("primary", "md")}>{s.ctaLabel}</Link>
            </div>
            <ProductArt art={s.art} label={s.title} className="order-1 mx-auto aspect-[4/3] w-full max-w-sm rounded-2xl sm:order-2 sm:aspect-square" />
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-3">
        <button type="button" aria-label="Anterior" onClick={() => go(index - 1)} className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface hover:bg-accent"><ChevronLeft size={20} aria-hidden="true" /></button>
        <div className="flex gap-2">
          {slides.map((s, i) => (
            <button key={s.id} type="button" aria-label={`Ir a la diapositiva ${i + 1}`} aria-current={i === index} onClick={() => go(i)}
              className="grid h-11 w-6 place-items-center">
              <span className={cn("block h-2.5 rounded-full transition-all duration-300", i === index ? "w-6 bg-primary" : "w-2.5 bg-line")} />
            </button>
          ))}
        </div>
        <button type="button" aria-label="Siguiente" onClick={() => go(index + 1)} className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface hover:bg-accent"><ChevronRight size={20} aria-hidden="true" /></button>
      </div>
    </section>
  );
}
