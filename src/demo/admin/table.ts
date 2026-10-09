import { normalize } from "../engine/search";

/** Reglas puras de las tablas del panel: orden, búsqueda y paginado. Sin React. */
export type SortDir = "asc" | "desc";
export type SortValue = string | number | boolean | null | undefined;

const collator = new Intl.Collator("es-AR", { numeric: true, sensitivity: "base" });

/** Compara valores mezclados: vacíos siempre al final, números como números y texto en español. */
export function compareValues(a: SortValue, b: SortValue): number {
  const emptyA = a === null || a === undefined || a === "";
  const emptyB = b === null || b === undefined || b === "";
  if (emptyA || emptyB) return emptyA === emptyB ? 0 : emptyA ? 1 : -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "boolean" && typeof b === "boolean") return Number(b) - Number(a);
  return collator.compare(String(a), String(b));
}

/** Orden estable; los vacíos quedan al final en ambos sentidos. */
export function sortRows<T>(rows: T[], get: (row: T) => SortValue, dir: SortDir): T[] {
  return rows
    .map((row, i) => ({ row, i, v: get(row) }))
    .sort((x, y) => {
      const emptyX = x.v === null || x.v === undefined || x.v === "";
      const emptyY = y.v === null || y.v === undefined || y.v === "";
      if (emptyX !== emptyY) return emptyX ? 1 : -1;
      const c = compareValues(x.v, y.v);
      return (dir === "asc" ? c : -c) || x.i - y.i;
    })
    .map((x) => x.row);
}

/** Búsqueda sin tildes ni mayúsculas: todas las palabras tienen que aparecer en alguno de los textos. */
export function matchesQuery(query: string, ...texts: (string | undefined | null)[]): boolean {
  const words = normalize(query).split(" ").filter(Boolean);
  if (!words.length) return true;
  const haystack = normalize(texts.filter(Boolean).join(" "));
  return words.every((w) => haystack.includes(w));
}

export interface Page<T> {
  items: T[];
  page: number;
  pages: number;
  total: number;
  from: number;
  to: number;
}

export function paginate<T>(rows: T[], page: number, size: number): Page<T> {
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const current = Math.min(Math.max(1, page), pages);
  return {
    items: rows.slice((current - 1) * size, current * size),
    page: current,
    pages,
    total: rows.length,
    from: rows.length ? (current - 1) * size + 1 : 0,
    to: Math.min(rows.length, current * size),
  };
}

/** Nombre de archivo de exportación: "velmar-pedidos-2026-10-09.xlsx". */
export function exportFileName(entity: string, now = new Date()): string {
  const day = new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
  return `velmar-${normalize(entity).replace(/\s+/g, "-")}-${day}.xlsx`;
}
