"use client";
import { CategoryTile } from "@/components/molecules/CategoryTile";
import { categoryHref, productsInCategory, visibleCategories } from "@/demo/engine/catalog";
import { useDemoVersion } from "@/stores/admin";

export function CategoriesGrid() {
  useDemoVersion();
  return (
    <ul className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-8">
      {visibleCategories().map((c) => (
        <li key={c.slug}><CategoryTile href={categoryHref(c.slug)} name={c.name} art={c.art} count={productsInCategory(c.slug).length} /></li>
      ))}
    </ul>
  );
}
