"use client";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Switch } from "@/components/atoms/Switch";
import { useAdmin } from "@/stores/admin";
import { useDemoSave } from "./useDemoSave";

export function CategoriesOrder() {
  const categories = useAdmin((s) => s.data.categories);
  const products = useAdmin((s) => s.data.products);
  const { moveCategory, toggleCategoryFeatured } = useAdmin();
  const save = useDemoSave();
  const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
  return (
    <ol className="flex flex-col gap-2">
      {sorted.map((c, i) => {
        const count = products.filter((p) => p.categorySlug === c.slug && p.active !== false).length;
        return (
          <li key={c.slug} className="rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-sm font-extrabold tabular-nums text-primary">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{c.name}</p>
                <p className="text-xs text-muted">{count} {count === 1 ? "producto activo" : "productos activos"}{count === 0 ? " · no se muestra en la tienda" : ""}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button type="button" aria-label={`Subir ${c.name}`} disabled={i === 0} onClick={() => save("Orden actualizado", () => moveCategory(c.slug, -1))} className="grid h-10 w-10 place-items-center rounded-xl border border-line disabled:opacity-40"><ArrowUp size={18} aria-hidden="true" /></button>
                <button type="button" aria-label={`Bajar ${c.name}`} disabled={i === sorted.length - 1} onClick={() => save("Orden actualizado", () => moveCategory(c.slug, 1))} className="grid h-10 w-10 place-items-center rounded-xl border border-line disabled:opacity-40"><ArrowDown size={18} aria-hidden="true" /></button>
              </div>
            </div>
            <div className="mt-3 border-t border-line pt-3">
              <Switch checked={c.featured} onChange={() => save("Categoría destacada actualizada", () => toggleCategoryFeatured(c.slug))} label="Destacada en inicio" />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
