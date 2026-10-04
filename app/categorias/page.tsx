import type { Metadata } from "next";
import { CategoryTile } from "@/components/molecules/CategoryTile";
import { PageHeader } from "@/components/templates/PageHeader";
import { SearchForm } from "@/components/molecules/SearchForm";
import { productsInCategory, visibleCategories } from "@/demo/engine/catalog";

export const metadata: Metadata = { title: "Categorías", description: "Todas las categorías de la tienda." };

export default function CategoriesPage() {
  return (
    <>
      <PageHeader title="Buscar más cosas">Todo el catálogo por categoría.</PageHeader>
      <div className="mb-8 max-w-xl"><SearchForm /></div>
      <ul className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {visibleCategories().map((c) => (
          <li key={c.slug}><CategoryTile slug={c.slug} name={c.name} art={c.art} count={productsInCategory(c.slug).length} /></li>
        ))}
      </ul>
    </>
  );
}
