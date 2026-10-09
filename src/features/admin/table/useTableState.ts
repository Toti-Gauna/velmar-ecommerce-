"use client";
import { useState } from "react";
import type { Sort, TableState } from "@/components/organisms/data-table/types";
import { useTablePrefs } from "@/stores/tablePrefs";

/**
 * Estado de una tabla del panel. Orden, columnas ocultas y densidad se recuerdan en este navegador
 * (store persistido); la búsqueda, la página y la selección no.
 */
export function useTableState(id: string, defaults: { sort?: Sort | null; hidden?: string[]; query?: string } = {}): TableState {
  const [query, setQueryRaw] = useState(defaults.query ?? "");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const saved = useTablePrefs((s) => s.prefs[id]);
  const save = useTablePrefs((s) => s.set);
  const hidden = saved?.hidden ?? defaults.hidden ?? [];
  return {
    query,
    setQuery: (q) => { setQueryRaw(q); setPage(1); },
    sort: saved?.sort === undefined ? (defaults.sort ?? null) : saved.sort,
    setSort: (sort) => { save(id, { sort }); setPage(1); },
    page,
    setPage,
    selected,
    setSelected,
    hidden: new Set(hidden),
    toggleColumn: (col) => save(id, { hidden: hidden.includes(col) ? hidden.filter((c) => c !== col) : [...hidden, col] }),
    density: saved?.density ?? "comfortable",
    setDensity: (density) => save(id, { density }),
  };
}
