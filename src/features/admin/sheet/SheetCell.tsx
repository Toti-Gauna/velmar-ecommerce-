"use client";
import { Check } from "lucide-react";
import type { SheetColumn, SheetValue } from "@/demo/admin/sheet";
import type { Category } from "@/demo/types";
import { cn } from "@/lib/cn";
import { formatARS } from "@/lib/money";
import { cellText } from "./useSheetGrid";

interface Props {
  col: SheetColumn;
  value: SheetValue;
  categories: Category[];
  active: boolean;
  selected: boolean;
  dirty: boolean;
  error?: string;
  editing?: { text: string; error?: string };
  onEditText: (text: string) => void;
  onEditKey: (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onEditBlur: () => void;
}

/** Una celda de la planilla: muestra el valor con formato y, al editar, un campo con validación. */
export function SheetCell({ col, value, categories, active, selected, dirty, error, editing, onEditText, onEditKey, onEditBlur }: Props) {
  const numeric = col === "price" || col === "stock";
  const display = col === "price" ? formatARS(Number(value)) : col === "active" ? null : cellText(col, value, categories);
  const field = "absolute inset-0 z-20 h-full w-full rounded-none border-2 border-primary bg-surface px-2 text-[14px] font-semibold shadow-[var(--shadow-lift)] focus:outline-none";
  return (
    <div className={cn("relative h-10 px-2 leading-10", numeric && "text-right tabular-nums", dirty && "bg-warning-soft/60", error && "bg-danger-soft/60",
      selected && !active && "bg-primary/[0.08]", active && "outline outline-2 -outline-offset-2 outline-primary")}>
      {editing ? (
        col === "categorySlug" ? (
          <select autoFocus value={categories.find((c) => c.name === editing.text || c.slug === editing.text)?.slug ?? ""} onChange={(e) => onEditText(e.target.value)} onKeyDown={onEditKey} onBlur={onEditBlur} className={field} aria-label="Categoría">
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        ) : (
          <input autoFocus value={editing.text} onChange={(e) => onEditText(e.target.value)} onKeyDown={onEditKey} onBlur={onEditBlur} aria-invalid={!!editing.error}
            aria-label="Editar celda" className={cn(field, numeric && "text-right", editing.error && "border-danger")} inputMode={numeric ? "numeric" : undefined} />
        )
      ) : col === "active" ? (
        <span className={cn("inline-grid h-5 w-5 place-items-center rounded-md border align-middle", value ? "border-primary bg-primary text-on-primary" : "border-ink/25 bg-surface")}>
          {value ? <Check size={13} aria-hidden="true" /> : null}<span className="sr-only">{value ? "Visible" : "Pausado"}</span>
        </span>
      ) : <span className="block truncate">{display}</span>}
      {dirty && !editing && <span aria-hidden="true" className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-warning" />}
      {(editing?.error || (active && error)) && (
        <span role="alert" className="absolute left-0 top-full z-30 mt-1 w-max max-w-64 rounded-xl bg-danger px-3 py-1.5 text-left text-xs font-bold leading-snug text-white shadow-[var(--shadow-lift)]">{editing?.error ?? error}</span>
      )}
    </div>
  );
}
