"use client";
import { ProductCard } from "@/components/molecules/ProductCard";
import { getProduct } from "@/demo/engine/catalog";
import { useFavorites } from "@/stores/favorites";
import { toCard } from "../catalog/mappers";

/** Favoritos guardados con el corazón de cada ficha. */
export function FavoritesSection() {
  const slugs = useFavorites((s) => s.slugs);
  const products = slugs.flatMap((s) => getProduct(s) ?? []);
  if (products.length === 0) return <p className="rounded-2xl border border-dashed border-line p-5 text-sm text-muted">Todavía no guardaste favoritos. Tocá el corazón en cualquier producto.</p>;
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => <li key={p.slug}><ProductCard product={toCard(p)} /></li>)}
    </ul>
  );
}
