"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { productsInCategory, visibleCategories } from "@/demo/engine/catalog";
import { cn } from "@/lib/cn";
import { useDemoVersion } from "@/stores/admin";

/** Categorías en grilla bento: las destacadas (orden del panel) ocupan más lugar. */
export function CategoryBento() {
  useDemoVersion();
  const cats = visibleCategories();
  const featured = cats.filter((c) => c.featured);
  const ordered = [...featured, ...cats.filter((c) => !c.featured)].slice(0, 5);
  return (
    <section aria-labelledby="cats">
      <Reveal className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-brass-ink">Explorá</p>
          <h2 id="cats" className="font-display mt-3 text-4xl sm:text-5xl">Para cada rincón <span className="italic text-primary">y cada mascota</span></h2>
        </div>
        <Link href="/categorias/" className="hidden shrink-0 items-center gap-1 font-bold text-primary hover:underline sm:flex">Todas <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </Reveal>
      <ul className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:gap-4 lg:grid-cols-4">
        {ordered.map((c, i) => (
          <Reveal as="li" key={c.slug} delay={i * 0.06} className={cn(i === 0 && "col-span-2 row-span-2")}>
            <Link href={`/c/${c.slug}/`} className="group relative block h-full overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
              <ProductArt art={c.art} label="" showBadge={false} className="absolute inset-0 transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-105 [&>svg]:h-full [&>svg]:w-full" />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night/70 via-night/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 text-[#fffdf8] sm:p-5">
                <div>
                  <p className={cn("font-display leading-tight", i === 0 ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl")}>{c.name}</p>
                  <p className="text-xs font-semibold opacity-80">{productsInCategory(c.slug).length} productos</p>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#fffdf8] text-night transition-transform duration-300 group-hover:rotate-45"><ArrowUpRight size={18} aria-hidden="true" /></span>
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
