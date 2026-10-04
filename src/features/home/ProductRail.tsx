"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard, type ProductCardData } from "@/components/molecules/ProductCard";

/** Riel de productos: desliza en el celular, grilla en escritorio. */
export function ProductRail({ id, eyebrow, title, accent, products, href }: { id: string; eyebrow: string; title: string; accent?: string; products: ProductCardData[]; href?: string }) {
  return (
    <section aria-labelledby={id}>
      <Reveal className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-brass-ink">{eyebrow}</p>
          <h2 id={id} className="font-display mt-3 text-4xl sm:text-5xl">{title} {accent && <span className="italic text-primary">{accent}</span>}</h2>
        </div>
        {href && <Link href={href} className="hidden shrink-0 items-center gap-1 font-bold text-primary hover:underline sm:flex">Ver todo <ArrowUpRight size={18} aria-hidden="true" /></Link>}
      </Reveal>
      <ul className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0">
        {products.map((p, i) => (
          <Reveal as="li" key={p.slug} delay={i * 0.07} className="w-[68%] shrink-0 snap-start sm:w-[42%] lg:w-auto">
            <ProductCard product={p} />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
