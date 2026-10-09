"use client";
import { Columns3, Download, Rows3, Rows4, Search, X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Column, Density } from "./types";

interface Props<T> {
  searchLabel: string;
  searchPlaceholder?: string;
  query: string;
  onQuery: (q: string) => void;
  filters?: ReactNode;
  end?: ReactNode;
  columns: Column<T>[];
  hidden: Set<string>;
  onToggleColumn: (id: string) => void;
  density: Density;
  onDensity: (d: Density) => void;
  onExport?: () => void;
  exportLabel: string;
}

const toolBase = "h-11 shrink-0 items-center gap-2 rounded-2xl border border-ink/12 bg-surface px-3.5 text-sm font-bold transition-colors hover:border-ink/25";
const tool = `inline-flex ${toolBase}`;

/** Barra de la tabla: buscador, filtros de la pantalla, columnas visibles, densidad y exportar a Excel. */
export function DataTableToolbar<T>(p: Props<T>) {
  const hideable = p.columns.filter((c) => !c.pinned);
  return (
    <div className="flex flex-col gap-3 border-b border-line p-3 sm:p-4">
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex min-w-[min(100%,15rem)] flex-1 flex-col gap-1 text-sm font-bold">
          {p.searchLabel}
          <span className="relative">
            <Search size={17} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input type="search" value={p.query} onChange={(e) => p.onQuery(e.target.value)} placeholder={p.searchPlaceholder}
              className="h-11 w-full rounded-2xl border border-ink/12 bg-bg pl-10 pr-10 text-[15px] font-medium placeholder:text-muted/60 focus:border-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/12" />
            {p.query && (
              <button type="button" onClick={() => p.onQuery("")} aria-label="Borrar búsqueda" className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-accent">
                <X size={15} aria-hidden="true" />
              </button>
            )}
          </span>
        </label>
        {p.filters}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {p.end}
          {hideable.length > 0 && (
            <details className="relative hidden md:block">
              <summary className={cn(tool, "cursor-pointer list-none [&::-webkit-details-marker]:hidden")}><Columns3 size={16} aria-hidden="true" />Columnas</summary>
              <fieldset className="absolute right-0 z-30 mt-2 flex w-56 flex-col gap-1 rounded-2xl border border-line bg-surface p-2 shadow-[var(--shadow-lift)]">
                <legend className="sr-only">Columnas visibles</legend>
                {hideable.map((c) => (
                  <label key={c.id} className="flex min-h-10 items-center gap-3 rounded-xl px-2 text-sm font-semibold hover:bg-accent/60">
                    <input type="checkbox" checked={!p.hidden.has(c.id)} onChange={() => p.onToggleColumn(c.id)} className="h-4 w-4 accent-primary" />{c.header}
                  </label>
                ))}
              </fieldset>
            </details>
          )}
          <button type="button" onClick={() => p.onDensity(p.density === "compact" ? "comfortable" : "compact")} aria-pressed={p.density === "compact"}
            className={cn(toolBase, "hidden md:inline-flex")} title="Densidad de filas">
            {p.density === "compact" ? <Rows4 size={16} aria-hidden="true" /> : <Rows3 size={16} aria-hidden="true" />}
            <span>{p.density === "compact" ? "Compacta" : "Cómoda"}</span>
          </button>
          {p.onExport && <button type="button" onClick={p.onExport} className={tool}><Download size={16} aria-hidden="true" />{p.exportLabel}</button>}
        </div>
      </div>
    </div>
  );
}
