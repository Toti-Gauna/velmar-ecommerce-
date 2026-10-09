"use client";
import { ArrowDown, ArrowUp, ArrowUpDown, Redo2, Save, Search, Undo2 } from "lucide-react";
import { useEffect, useReducer, useState, type KeyboardEvent } from "react";
import { Button } from "@/components/atoms/Button";
import { applyDraft, cellKey, COLUMN_LABEL, SHEET_COLUMNS, sheetReducer, type SheetColumn } from "@/demo/admin/sheet";
import { DEFAULT_LOW_STOCK, stockRows } from "@/demo/admin/stock";
import { matchesQuery, sortRows, type SortDir } from "@/demo/admin/table";
import { cn } from "@/lib/cn";
import { formatARS } from "@/lib/money";
import { useAdmin } from "@/stores/admin";
import { useToasts } from "@/stores/toast";
import { AdminPageHeader } from "../AdminPageHeader";
import { SheetCell } from "./SheetCell";
import { useSheetGrid } from "./useSheetGrid";

const WIDTH: Record<SheetColumn, string> = { productName: "min-w-[10.5rem] sm:min-w-[15rem]", variantLabel: "min-w-[9rem] sm:min-w-[11rem]", categorySlug: "min-w-[9rem] sm:min-w-[10rem]", price: "min-w-[7rem] sm:min-w-[8rem]", stock: "min-w-[6rem] sm:min-w-[7rem]", active: "min-w-[5rem]" };

/** Planilla nativa: se edita como Excel (teclado, copiar y pegar, deshacer) y se guarda todo junto. */
export function SpreadsheetView() {
  const { data, updateProducts } = useAdmin();
  const push = useToasts((s) => s.push);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  // El orden se calcula al tocar el encabezado y queda fijo mientras editás (como en Excel): la fila no salta de lugar.
  const [sort, setSort] = useState<{ col: SheetColumn; dir: SortDir; keys: string[] } | null>(null);
  const all = stockRows(data.products, data.categories, data.settings.lowStockThreshold ?? DEFAULT_LOW_STOCK);
  const filtered = all.filter((r) => (category === "all" || r.categorySlug === category) && matchesQuery(q, r.productName, r.variantLabel, r.categoryName));
  const [history, dispatch] = useReducer(sheetReducer, { draft: {}, past: [], future: [] });
  const current = (r: (typeof all)[number], col: SheetColumn) => history.draft[cellKey(r.key, col)] ?? r[col];
  const order = new Map(sort?.keys.map((k, i) => [k, i]));
  const rows = sort ? [...filtered].sort((a, b) => (order.get(a.key) ?? Infinity) - (order.get(b.key) ?? Infinity)) : filtered;
  const g = useSheetGrid(rows, all, data.categories, history, dispatch);
  const changes = Object.keys(g.dirty).length;
  useEffect(() => {
    if (!changes) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [changes]);

  const save = () => {
    updateProducts(applyDraft(data.products, all, g.dirty), `Planilla: ${changes} ${changes === 1 ? "celda guardada" : "celdas guardadas"}`, "Catálogo");
    g.dispatch({ type: "reset" });
    g.clearErrors();
    push({ tone: "success", title: "Cambios guardados", description: "Ya se ven en la tienda de este navegador." });
  };
  const onGridKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("input, select")) return;
    const mod = e.metaKey || e.ctrlKey;
    const { r, c } = g.focus;
    const moves: Record<string, [number, number]> = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1], Tab: [0, e.shiftKey ? -1 : 1] };
    if (mod && e.key.toLowerCase() === "z") { e.preventDefault(); g.dispatch({ type: e.shiftKey ? "redo" : "undo" }); return; }
    if (mod && e.key.toLowerCase() === "y") { e.preventDefault(); g.dispatch({ type: "redo" }); return; }
    if (mod && e.key.toLowerCase() === "s") { e.preventDefault(); if (changes) save(); return; }
    if (moves[e.key]) { e.preventDefault(); const [dr, dc] = moves[e.key]!; g.select({ r: r + dr, c: c + dc }, e.shiftKey && e.key !== "Tab"); return; }
    if (e.key === "Enter" || e.key === "F2" || e.key === " ") { e.preventDefault(); g.startEdit(g.focus); return; }
    if (!mod && e.key.length === 1) { e.preventDefault(); g.startEdit(g.focus, e.key); }
  };
  const onEditKey = (e: KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.key === "Enter") { e.preventDefault(); if (g.commit({ r: 1, c: 0 })) focusGrid(); }
    if (e.key === "Tab") { e.preventDefault(); if (g.commit({ r: 0, c: e.shiftKey ? -1 : 1 })) focusGrid(); }
    if (e.key === "Escape") { e.preventDefault(); g.setEditing(null); focusGrid(); }
  };
  const focusGrid = () => window.setTimeout(() => document.getElementById("sheet-grid")?.focus(), 0);
  const sortBy = (col: SheetColumn, dir: SortDir) => ({ col, dir, keys: sortRows(all, (r) => { const v = current(r, col); return typeof v === "boolean" ? Number(v) : v; }, dir).map((r) => r.key) });
  const toggleSort = (col: SheetColumn) => setSort(sort?.col !== col ? sortBy(col, "asc") : sort.dir === "asc" ? sortBy(col, "desc") : null);
  const totals = rows.reduce((t, r) => { const s = Number(g.value(r, "stock")); const p = Number(g.value(r, "price")); return { units: t.units + Math.max(0, s), value: t.value + Math.max(0, s) * p }; }, { units: 0, value: 0 });
  const tool = "grid h-11 w-11 place-items-center rounded-2xl border border-ink/12 bg-surface transition-colors hover:border-ink/25 disabled:opacity-30";
  return (
    <>
      <AdminPageHeader title="Planilla" actions={(
        <div className="flex flex-wrap items-center gap-2">
          <span aria-live="polite" className={cn("text-sm font-bold", changes ? "text-warning" : "text-muted")}>{changes ? `${changes} ${changes === 1 ? "cambio" : "cambios"} sin guardar` : "Todo guardado"}</span>
          <Button variant="ghost" disabled={!changes} onClick={() => { g.dispatch({ type: "reset" }); g.clearErrors(); }}>Descartar</Button>
          <Button disabled={!changes} onClick={save}><Save size={17} aria-hidden="true" /> Guardar cambios</Button>
        </div>
      )}>Como un Excel, pero conectado a la tienda: escribí sobre una celda, pegá columnas desde tu planilla, ordená y filtrá. Nada cambia hasta que guardás.</AdminPageHeader>
      <div className="mb-3 flex flex-wrap items-end gap-2">
        <label className="flex min-w-[min(100%,15rem)] flex-1 flex-col gap-1 text-sm font-bold">Buscar en la planilla
          <span className="relative"><Search size={17} aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" /><input type="search" value={q} onChange={(e) => setQ(e.target.value)} className="h-11 w-full rounded-2xl border border-ink/12 bg-surface pl-10 pr-3 font-medium" /></span>
        </label>
        <div className="flex flex-col gap-1 text-sm font-bold"><label htmlFor="sheet-category">Categoría</label>
          <select id="sheet-category" value={category} onChange={(e) => setCategory(e.target.value)} className="h-11 rounded-2xl border border-ink/12 bg-surface px-3 font-bold"><option value="all">Todas</option>{data.categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
        </div>
        <button type="button" className={tool} aria-label="Deshacer (Ctrl+Z)" disabled={!g.history.past.length} onClick={() => g.dispatch({ type: "undo" })}><Undo2 size={18} aria-hidden="true" /></button>
        <button type="button" className={tool} aria-label="Rehacer (Ctrl+Y)" disabled={!g.history.future.length} onClick={() => g.dispatch({ type: "redo" })}><Redo2 size={18} aria-hidden="true" /></button>
      </div>
      <div id="sheet-grid" role="grid" aria-label="Planilla de productos y stock" aria-rowcount={rows.length + 1} tabIndex={0} onKeyDown={onGridKey}
        onCopy={(e) => { if ((e.target as HTMLElement).closest("input")) return; e.preventDefault(); e.clipboardData.setData("text/plain", g.copyText()); push({ tone: "info", title: "Celdas copiadas", description: "Pegalas en Excel o en otra parte de la planilla." }); }}
        onPaste={(e) => { if ((e.target as HTMLElement).closest("input")) return; e.preventDefault(); const r = g.paste(e.clipboardData.getData("text/plain")); push({ tone: r.failed ? "error" : "success", title: `${r.pasted} ${r.pasted === 1 ? "celda pegada" : "celdas pegadas"}`, description: r.failed ? `${r.failed} no entraron: revisá las marcadas en rojo.` : "Revisá y guardá cuando quieras." }); }}
        className="max-h-[70dvh] overflow-auto rounded-[1.5rem] bg-surface text-[14px] shadow-[var(--shadow-card)] ring-1 ring-ink/[0.06] focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20">
        <div role="row" className="sticky top-0 z-20 flex w-max min-w-full border-b border-line bg-accent/70 backdrop-blur">
          {SHEET_COLUMNS.map((col, c) => (
            <div key={col} role="columnheader" aria-sort={sort?.col === col ? (sort.dir === "asc" ? "ascending" : "descending") : undefined} className={cn("flex-1 border-r border-line/70 px-2 py-2", WIDTH[col], c === 0 && "sticky left-0 z-10 bg-accent")}>
              <button type="button" onClick={() => toggleSort(col)} className="flex w-full items-center gap-1 text-[12px] font-bold uppercase tracking-[0.06em] text-muted hover:text-ink">
                {COLUMN_LABEL[col]}{sort?.col === col ? (sort.dir === "asc" ? <ArrowUp size={13} aria-hidden="true" /> : <ArrowDown size={13} aria-hidden="true" />) : <ArrowUpDown size={13} aria-hidden="true" className="opacity-40" />}
              </button>
            </div>
          ))}
        </div>
        {rows.map((row, r) => (
          <div key={row.key} role="row" aria-rowindex={r + 2} className="flex w-max min-w-full border-b border-line/60">
            {SHEET_COLUMNS.map((col, c) => {
              const active = g.focus.r === r && g.focus.c === c;
              const editing = g.editing && g.editing.pos.r === r && g.editing.pos.c === c ? g.editing : undefined;
              return (
                <div key={col} role="gridcell" aria-selected={g.inRange(r, c)} onMouseDown={(e) => { if (editing) return; e.preventDefault(); if (!g.commit()) return; if (active && !e.shiftKey) { g.startEdit({ r, c }); return; } g.select({ r, c }, e.shiftKey); document.getElementById("sheet-grid")?.focus(); }}
                  onDoubleClick={() => g.startEdit({ r, c })} className={cn("flex-1 cursor-cell border-r border-line/50", WIDTH[col], c === 0 && "sticky left-0 z-10 bg-surface font-semibold")}>
                  <SheetCell col={col} value={g.value(row, col)} categories={data.categories} active={active} selected={g.inRange(r, c)} dirty={g.isDirty(row, col)}
                    error={g.errors[cellKey(row.key, col)]} editing={editing} onEditText={(text) => g.setEditing((x) => (x ? { ...x, text, error: undefined } : x))}
                    onEditKey={onEditKey} onEditBlur={() => g.commit()} />
                </div>
              );
            })}
          </div>
        ))}
        {rows.length === 0 && <p className="p-8 text-center text-muted">Nada coincide con la búsqueda.</p>}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-muted">Flechas para moverte · Enter, escribir o tocar de nuevo para editar · Shift + flechas para elegir varias · Ctrl+C / Ctrl+V con Excel · Ctrl+Z deshacer</p>
        <p className="flex gap-5"><span className="text-muted">{rows.length} filas</span><span className="text-muted">Unidades: <strong className="tabular-nums text-ink">{totals.units.toLocaleString("es-AR")}</strong></span><span className="text-muted">Valor: <strong className="tabular-nums text-ink">{formatARS(totals.value)}</strong></span></p>
      </div>
    </>
  );
}
