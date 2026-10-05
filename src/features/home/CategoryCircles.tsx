"use client";
import Link from "next/link";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { productsInCategory, visibleCategories } from "@/demo/engine/catalog";
import { useDemoVersion } from "@/stores/admin";

/** Accesos rápidos a categorías, como en cualquier tienda: círculo con la pieza más vendida de cada una. */
export function CategoryCircles() {
  useDemoVersion();
  const cats = visibleCategories();
  return (
    <section aria-labelledby="cats-title">
      <div className="mb-5 flex items-end justify-between">
        <h2 id="cats-title" className="font-display text-3xl sm:text-4xl">Comprá por categoría</h2>
        <Link href="/categorias/" className="text-sm font-bold text-primary hover:underline">Ver todas</Link>
      </div>
      <ul className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain px-4 pb-3 pt-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0 lg:grid-cols-8">
        {cats.map((c) => {
          const top = [...productsInCategory(c.slug)].sort((a, b) => b.soldCount - a.soldCount)[0];
          return (
            <li key={c.slug} className="w-[5.5rem] shrink-0 sm:w-auto">
              <Link href={`/c/${c.slug}/`} className="group flex flex-col items-center gap-2 text-center">
                <span className="relative block aspect-square w-full overflow-hidden rounded-full bg-accent shadow-[var(--shadow-card)] ring-1 ring-line transition-all duration-500 group-hover:shadow-[var(--shadow-lift)] group-hover:ring-2 group-hover:ring-primary">
                  {top && <ProductArt art={top.art} tint={top.variants[0]?.colorHex} label="" showBadge={false} className="h-full w-full scale-110 transition-transform duration-700 group-hover:scale-125 [&>svg]:h-full" />}
                </span>
                <span className="text-[13px] font-bold leading-tight">{c.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
