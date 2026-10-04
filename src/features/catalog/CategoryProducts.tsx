"use client";
import { useMemo } from "react";
import { ButtonLink } from "@/components/atoms/Button";
import { EmptyState } from "@/components/molecules/EmptyState";
import { ProductGrid, type ProductCardData } from "@/components/molecules/ProductCard";
import { getProduct, sortProducts, type SortKey } from "@/demo/engine/catalog";
import { useAccount } from "@/stores/account";
import { useHydrated } from "@/stores/hydration";
import { toCard } from "./mappers";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "relevance", label: "Relevancia" },
  { value: "price-asc", label: "Menor precio" },
  { value: "price-desc", label: "Mayor precio" },
  { value: "new", label: "Nuevos primero" },
];

export function CategoryProducts({ slugs, initial }: { slugs: string[]; initial: ProductCardData[] }) {
  const hydrated = useHydrated();
  const storedSort = useAccount((s) => s.sort);
  const setSort = useAccount((s) => s.setSort);
  const sort = hydrated ? storedSort : "relevance";
  const cards = useMemo(() => {
    const list = slugs.flatMap((s) => getProduct(s) ?? []);
    return sortProducts(list, sort).map(toCard);
  }, [slugs, sort]);
  if (initial.length === 0) {
    return <EmptyState title="Todavía no hay productos acá" action={<ButtonLink href="/categorias/">Ver otras categorías</ButtonLink>}>Estamos preparando piezas nuevas.</EmptyState>;
  }
  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm text-muted" aria-live="polite">{cards.length} {cards.length === 1 ? "producto" : "productos"}</p>
        <label className="flex items-center gap-2 text-sm font-bold">
          Ordenar por
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="min-h-10 rounded-full border border-line bg-surface px-3 font-semibold">
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
      </div>
      <ProductGrid products={cards} />
    </>
  );
}
