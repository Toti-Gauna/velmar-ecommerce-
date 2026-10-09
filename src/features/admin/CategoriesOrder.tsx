"use client";
import Link from "next/link";
import { ArrowDown, ArrowUp, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Switch } from "@/components/atoms/Switch";
import { DEFAULT_LOW_STOCK, lowStockRows } from "@/demo/admin/stock";
import type { Category } from "@/demo/types";
import { useAdmin } from "@/stores/admin";
import { useDemoSave } from "./useDemoSave";

function NameCell({ category, onSave }: { category: Category; onSave: (name: string) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  const cancelled = useRef(false);
  const commit = () => { if (cancelled.current) { cancelled.current = false; setDraft(null); return; } if (draft !== null && draft.trim() && draft.trim() !== category.name) onSave(draft.trim()); setDraft(null); };
  return (
    <input aria-label={`Nombre de la categoría ${category.name}`} value={draft ?? category.name} onChange={(e) => setDraft(e.target.value)} onBlur={commit}
      onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); if (e.key === "Escape") { cancelled.current = true; e.currentTarget.blur(); } }}
      className="h-10 w-full min-w-40 rounded-xl border border-transparent bg-transparent px-2 font-bold hover:border-ink/12 focus:border-primary focus:bg-surface focus:outline-none" />
  );
}

/** Categorías como tabla: nombre editable, orden, destacadas, productos activos y variantes para reponer. */
export function CategoriesOrder() {
  const { data, moveCategory, toggleCategoryFeatured, saveCategory, createCategory } = useAdmin();
  const save = useDemoSave();
  const [name, setName] = useState("");
  const low = lowStockRows(data.products, data.categories, data.settings.lowStockThreshold ?? DEFAULT_LOW_STOCK);
  const sorted = [...data.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  const btn = "grid h-9 w-9 place-items-center rounded-xl border border-line disabled:opacity-30";
  return (
    <div className="overflow-hidden rounded-[1.75rem] bg-surface shadow-[var(--shadow-card)] ring-1 ring-ink/[0.04]">
      <form onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; save(`Categoría “${name.trim()}” creada`, () => { createCategory(name); }); setName(""); }} className="flex flex-wrap items-end gap-2 border-b border-line p-4">
        <label className="flex min-w-[min(100%,16rem)] flex-1 flex-col gap-1 text-sm font-bold">Nueva categoría<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Mates y cocina" className="h-11 rounded-2xl border border-ink/12 bg-bg px-3 font-semibold" /></label>
        <Button type="submit" variant="secondary"><Plus size={17} aria-hidden="true" /> Crear</Button>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <caption className="sr-only">Categorías en el orden de la tienda</caption>
          <thead className="text-[12px] font-bold uppercase tracking-[0.06em] text-muted"><tr className="border-b border-line"><th className="px-4 py-3">Orden</th><th className="px-3">Nombre</th><th className="px-3 text-right">Productos activos</th><th className="px-3">Para reponer</th><th className="px-3">Inicio</th></tr></thead>
          <tbody>
            {sorted.map((c, i) => {
              const active = data.products.filter((p) => p.categorySlug === c.slug && p.active !== false).length;
              const total = data.products.filter((p) => p.categorySlug === c.slug).length;
              const reorder = low.filter((r) => r.categorySlug === c.slug).length;
              return (
                <tr key={c.slug} className="border-b border-line/70 last:border-0">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1">
                      <span className="w-6 text-center font-extrabold tabular-nums text-muted">{i + 1}</span>
                      <button type="button" aria-label={`Subir ${c.name}`} disabled={i === 0} onClick={() => save("Orden actualizado", () => moveCategory(c.slug, -1))} className={btn}><ArrowUp size={16} aria-hidden="true" /></button>
                      <button type="button" aria-label={`Bajar ${c.name}`} disabled={i === sorted.length - 1} onClick={() => save("Orden actualizado", () => moveCategory(c.slug, 1))} className={btn}><ArrowDown size={16} aria-hidden="true" /></button>
                    </div>
                  </td>
                  <td className="px-3"><NameCell category={c} onSave={(n) => save("Categoría renombrada", () => saveCategory({ ...c, name: n }))} />{active === 0 && <p className="px-2 pb-1 text-xs text-muted">No se muestra en la tienda (sin productos activos)</p>}</td>
                  <td className="px-3 text-right tabular-nums">{active}<span className="text-muted"> / {total}</span></td>
                  <td className="px-3">{reorder ? <Link href="/admin-demo/stock/?vista=reponer" className="font-bold text-warning underline">{reorder} {reorder === 1 ? "variante" : "variantes"}</Link> : <span className="text-muted">—</span>}</td>
                  <td className="px-3"><Switch checked={c.featured} onChange={() => save("Categoría destacada actualizada", () => toggleCategoryFeatured(c.slug))} label="Destacada" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
