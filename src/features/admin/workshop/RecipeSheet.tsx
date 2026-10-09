"use client";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Sheet } from "@/components/motion/Sheet";
import { marginPct, marginState, MARGIN_LABEL, recipeCost, suggestedPrice } from "@/demo/admin/workshop/costs";
import { productMinPrice } from "@/demo/admin/stock";
import { UNIT_SHORT, type Recipe } from "@/demo/fixtures/workshop";
import type { Product } from "@/demo/types";
import { formatARS } from "@/lib/money";
import { cn } from "@/lib/cn";
import { useAdmin } from "@/stores/admin";
import { CommitNumberField } from "../NumberField";
import { useDemoSave } from "../useDemoSave";
import { InlineNumber } from "./InlineNumber";

const EMPTY: Recipe = { items: [], machineMinutes: 0, handMinutes: 0 };
export const MARGIN_TONE = { ok: "text-success", low: "text-warning", loss: "text-danger", missing: "text-muted" } as const;

/** Receta de costo de un producto: insumos por unidad, minutos de máquina y a mano, margen y precio sugerido. */
export function RecipeSheet({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { materials, recipes, settings } = useAdmin((s) => s.workshop);
  const { saveRecipe, applyPrice } = useAdmin();
  const save = useDemoSave();
  const [add, setAdd] = useState("");
  const [trial, setTrial] = useState<number | null>(null);
  const recipe = (product && recipes[product.slug]) || EMPTY;
  const cost = recipeCost(recipe, materials, settings);
  const price = product ? productMinPrice(product) : 0;
  const test = trial ?? price;
  const margin = marginPct(test, cost.total);
  const state = recipe.items.length || recipe.machineMinutes || recipe.handMinutes ? marginState(margin, settings.targetMarginPct) : "missing";
  const suggested = suggestedPrice(cost.total, settings.targetMarginPct);
  const update = (r: Recipe, label = "Receta de costo guardada") => product && save(label, () => saveRecipe(product.slug, r));
  const unused = materials.filter((m) => !recipe.items.some((i) => i.materialId === m.id));
  const close = () => { setTrial(null); setAdd(""); onClose(); };
  const row = (label: string, value: number, strong = false) => <p className={cn("flex justify-between", strong && "border-t border-line pt-2 font-extrabold")}><span className={strong ? "" : "text-muted"}>{label}</span><span className="tabular-nums">{formatARS(value)}</span></p>;
  return (
    <Sheet open={!!product} onClose={close} title={product ? `Costo de ${product.name}` : "Costo"} side="right" className="max-w-xl bg-bg">
      {product && (
        <div className="flex h-full flex-col gap-5 overflow-y-auto p-6 pt-14">
          <div>
            <p className="eyebrow text-muted">Costo por unidad</p>
            <h2 className="font-display mt-1 text-3xl">{product.name}</h2>
          </div>
          <section aria-labelledby="r-items" className="rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]">
            <h3 id="r-items" className="mb-2 font-bold">Insumos por unidad</h3>
            {cost.lines.length ? (
              <ul className="flex flex-col divide-y divide-line">
                {cost.lines.map((l) => (
                  <li key={l.material.id} className="flex flex-wrap items-center gap-2 py-2 text-sm">
                    <span className="min-w-0 flex-1 font-semibold">{l.material.name}<span className="block text-xs font-normal text-muted">{formatARS(l.material.costPerUnit)} por {UNIT_SHORT[l.material.unit]}</span></span>
                    <InlineNumber decimals value={l.qty} label={`Cantidad de ${l.material.name}`} className="w-20"
                      onCommit={(qty) => update({ ...recipe, items: recipe.items.map((i) => (i.materialId === l.material.id ? { ...i, qty } : i)) })} />
                    <span className="w-8 text-xs text-muted">{UNIT_SHORT[l.material.unit]}</span>
                    <span className="w-20 text-right font-bold tabular-nums">{formatARS(l.cost)}</span>
                    <button type="button" aria-label={`Quitar ${l.material.name}`} onClick={() => update({ ...recipe, items: recipe.items.filter((i) => i.materialId !== l.material.id) }, "Insumo quitado de la receta")}
                      className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-danger-soft hover:text-danger"><Trash2 size={15} aria-hidden="true" /></button>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted">Todavía no tiene insumos cargados.</p>}
            {cost.missing.length > 0 && <p className="mt-2 text-xs font-bold text-warning">Hay insumos de la receta que ya no están en la lista.</p>}
            <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!add) return; update({ ...recipe, items: [...recipe.items, { materialId: add, qty: 1 }] }, "Insumo agregado a la receta"); setAdd(""); }}>
              <label htmlFor="r-add" className="sr-only">Insumo para agregar</label>
              <select id="r-add" value={add} onChange={(e) => setAdd(e.target.value)} className="h-11 min-w-0 flex-1 rounded-2xl border border-ink/12 bg-bg px-3 text-sm font-semibold">
                <option value="">Elegí un insumo…</option>
                {unused.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <Button type="submit" variant="secondary" size="sm" disabled={!add}><Plus size={16} aria-hidden="true" /> Agregar</Button>
            </form>
          </section>
          <section aria-label="Tiempos" className="grid grid-cols-2 gap-3 rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]">
            <CommitNumberField id="r-machine" label="Máquina" suffix="minutos" value={recipe.machineMinutes} onCommit={(n) => update({ ...recipe, machineMinutes: n })} hint={`${formatARS(settings.machineHourCost)} la hora`} />
            <CommitNumberField id="r-hand" label="Trabajo a mano" suffix="minutos" value={recipe.handMinutes} onCommit={(n) => update({ ...recipe, handMinutes: n })} hint={`${formatARS(settings.handHourCost)} la hora`} />
          </section>
          <section aria-label="Resultado" className="flex flex-col gap-1.5 rounded-3xl bg-surface p-4 text-sm shadow-[var(--shadow-card)]">
            {row("Insumos", cost.materials)}
            {row("Máquina", cost.machine)}
            {row("Trabajo a mano", cost.hand)}
            {row("Costo por unidad", cost.total, true)}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <CommitNumberField id="r-trial" label="Probar con el precio" suffix="pesos" value={test} onCommit={setTrial} hint={`Precio actual desde ${formatARS(price)}`} />
              <div className="rounded-2xl bg-bg p-3">
                <p className="text-xs font-bold text-muted">Margen</p>
                <p className={cn("text-2xl font-extrabold tabular-nums", MARGIN_TONE[state])}>{margin === null ? "—" : `${margin}%`}</p>
                <p className={cn("text-xs font-bold", MARGIN_TONE[state])}>{MARGIN_LABEL[state]} · ganancia {formatARS(test - cost.total)}</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted">Margen sobre el precio de venta, sin impuestos ni comisiones de cobro. Objetivo: {settings.targetMarginPct}%.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {suggested !== price && cost.total > 0 && (
                <Button size="sm" onClick={() => { save(`Precio de ${product.name}: desde ${formatARS(suggested)}`, () => applyPrice(product.slug, suggested)); setTrial(null); }}>Usar precio sugerido: {formatARS(suggested)}</Button>
              )}
              {trial !== null && trial !== price && trial !== suggested && (
                <Button size="sm" variant="secondary" onClick={() => { save(`Precio de ${product.name}: desde ${formatARS(trial)}`, () => applyPrice(product.slug, trial)); setTrial(null); }}>Usar {formatARS(trial)}</Button>
              )}
            </div>
          </section>
        </div>
      )}
    </Sheet>
  );
}
