"use client";
import { useState, type Dispatch } from "react";
import { cellKey, expandEdit, parseCellInput, parseTsv, pruneDraft, SHEET_COLUMNS, toTsv, type Draft, type SheetAction, type SheetColumn, type SheetHistory, type SheetValue } from "@/demo/admin/sheet";
import type { StockRow } from "@/demo/admin/stock";
import type { Category } from "@/demo/types";

export interface Pos { r: number; c: number }

/** Texto que muestra (y copia) una celda. */
export function cellText(col: SheetColumn, value: SheetValue, categories: Category[]): string {
  if (col === "categorySlug") return categories.find((c) => c.slug === value)?.name ?? String(value);
  if (col === "stock") return Number(value) < 0 ? "a pedido" : String(value);
  if (col === "active") return value ? "sí" : "no";
  return String(value);
}

/**
 * Estado de la planilla: borrador con historial, celda activa, rango seleccionado y edición.
 * `rows` llega ya filtrado y ordenado; los cambios se guardan por clave de fila, no por posición.
 */
export function useSheetGrid(rows: StockRow[], allRows: StockRow[], categories: Category[], history: SheetHistory, dispatch: Dispatch<SheetAction>) {
  const [anchor, setAnchor] = useState<Pos>({ r: 0, c: 0 });
  const [focus, setFocus] = useState<Pos>({ r: 0, c: 0 });
  const [editing, setEditing] = useState<{ pos: Pos; text: string; error?: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const maxR = Math.max(0, rows.length - 1);
  const maxC = SHEET_COLUMNS.length - 1;
  const clamp = (p: Pos): Pos => ({ r: Math.min(maxR, Math.max(0, p.r)), c: Math.min(maxC, Math.max(0, p.c)) });
  const value = (row: StockRow, col: SheetColumn): SheetValue => history.draft[cellKey(row.key, col)] ?? row[col];
  const dirty = pruneDraft(allRows, history.draft);
  const isDirty = (row: StockRow, col: SheetColumn) => cellKey(row.key, col) in dirty;

  const select = (p: Pos, extend = false) => { const q = clamp(p); setFocus(q); if (!extend) setAnchor(q); };
  const range = { r1: Math.min(anchor.r, focus.r), r2: Math.max(anchor.r, focus.r), c1: Math.min(anchor.c, focus.c), c2: Math.max(anchor.c, focus.c) };
  const inRange = (r: number, c: number) => r >= range.r1 && r <= range.r2 && c >= range.c1 && c <= range.c2;

  /** Guarda celdas ya validadas (expande las de producto a todas sus variantes). */
  const setCells = (cells: { row: StockRow; col: SheetColumn; value: SheetValue }[]) => {
    const next: Draft = {};
    for (const x of cells) Object.assign(next, expandEdit(allRows, x.row.key, x.col, x.value));
    if (Object.keys(next).length) dispatch({ type: "set", cells: next });
  };

  const startEdit = (p: Pos, initial?: string) => {
    const row = rows[p.r];
    const col = SHEET_COLUMNS[p.c]!;
    if (!row) return;
    if (col === "active") return setCells([{ row, col, value: !value(row, col) }]);
    if (col === "categorySlug") initial = undefined;
    setEditing({ pos: p, text: initial ?? (col === "price" ? String(value(row, col)) : cellText(col, value(row, col), categories)) });
  };
  /** Valida y guarda la edición. Devuelve false si el texto no es válido (la celda sigue abierta con el error). */
  const commit = (move?: Pos): boolean => {
    if (!editing) return true;
    const row = rows[editing.pos.r];
    const col = SHEET_COLUMNS[editing.pos.c]!;
    const parsed = parseCellInput(col, editing.text, categories);
    if (!parsed.ok) { setEditing({ ...editing, error: parsed.error }); return false; }
    if (row) setCells([{ row, col, value: parsed.value }]);
    setErrors((e) => { const n = { ...e }; if (row) delete n[cellKey(row.key, col)]; return n; });
    setEditing(null);
    if (move) select({ r: editing.pos.r + move.r, c: editing.pos.c + move.c });
    return true;
  };

  const copyText = () => toTsv(rows.slice(range.r1, range.r2 + 1).map((row) => SHEET_COLUMNS.slice(range.c1, range.c2 + 1).map((col) => (col === "price" ? String(value(row, col)) : cellText(col, value(row, col), categories)))));

  /** Pega texto de Excel desde la celda activa. Devuelve cuántas celdas entraron y cuántas tenían error. */
  const paste = (text: string) => {
    const grid = parseTsv(text);
    const ok: { row: StockRow; col: SheetColumn; value: SheetValue }[] = [];
    const bad: Record<string, string> = {};
    grid.forEach((line, dr) => line.forEach((raw, dc) => {
      const row = rows[range.r1 + dr];
      const col = SHEET_COLUMNS[range.c1 + dc];
      if (!row || !col) return;
      const parsed = parseCellInput(col, raw, categories);
      if (parsed.ok) ok.push({ row, col, value: parsed.value }); else bad[cellKey(row.key, col)] = parsed.error;
    }));
    setCells(ok);
    setErrors((e) => ({ ...e, ...bad }));
    select({ r: range.r1, c: range.c1 });
    select({ r: Math.min(maxR, range.r1 + grid.length - 1), c: Math.min(maxC, range.c1 + (grid[0]?.length ?? 1) - 1) }, true);
    return { pasted: ok.length, failed: Object.keys(bad).length };
  };

  return {
    history, dispatch, dirty, isDirty, value, focus, select, inRange, editing, setEditing, startEdit, commit, copyText, paste, errors,
    clearErrors: () => setErrors({}), maxR, maxC,
  };
}
