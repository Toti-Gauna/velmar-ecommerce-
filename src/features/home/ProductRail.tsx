"use client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard, type ProductCardData } from "@/components/molecules/ProductCard";

interface Props { id: string; eyebrow: string; title: string; accent?: string; products: ProductCardData[]; href?: string }

/** Riel de productos deslizable (como en cualquier tienda), con flechas en escritorio. */
export function ProductRail({ id, eyebrow, title, accent, products, href }: Props) {
  const track = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: "smooth" });
  if (products.length === 0) return null;
  const arrow = "hidden h-11 w-11 place-items-center rounded-full border border-ink/15 bg-surface transition-colors hover:bg-ink hover:text-bg sm:grid";
  return (
    <section aria-labelledby={id}>
      <Reveal className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-brass-ink">{eyebrow}</p>
          <h2 id={id} className="font-display mt-2 text-3xl sm:text-5xl">{title} {accent && <span className="italic text-primary">{accent}</span>}</h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {href && <Link href={href} className="mr-2 inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">Ver todo <ArrowUpRight size={16} aria-hidden="true" /></Link>}
          {products.length > 4 && (
            <>
              <button type="button" aria-label={`Anteriores de ${title}`} onClick={() => scroll(-1)} className={arrow}><ArrowLeft size={18} aria-hidden="true" /></button>
              <button type="button" aria-label={`Más de ${title}`} onClick={() => scroll(1)} className={arrow}><ArrowRight size={18} aria-hidden="true" /></button>
            </>
          )}
        </div>
      </Reveal>
      <ul ref={track} className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth px-4 pb-3 pt-2 sm:-mx-6 sm:gap-5 sm:px-6 lg:mx-0 lg:px-0">
        {products.map((p, i) => (
          <Reveal as="li" key={p.slug} y={0} delay={Math.min(i, 4) * 0.06} className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[calc(25%-15px)]">
            <ProductCard product={p} />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
