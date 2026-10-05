"use client";
import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface Props { value: number; max: number; note: string; onChange: (n: number) => void }

/** Cantidad al estilo de las grandes tiendas: "Cantidad: 1 unidad ⌄ (7 disponibles)" con lista desplegable. */
export function QuantityPicker({ value, max, note, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const options = Array.from({ length: Math.max(1, Math.min(max, 10)) }, (_, i) => i + 1);
  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    box.current?.querySelector<HTMLElement>("[aria-selected='true']")?.focus();
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", esc); };
  }, [open]);
  const unit = (n: number) => `${n} ${n === 1 ? "unidad" : "unidades"}`;
  return (
    <div ref={box} className="relative">
      <button type="button" aria-haspopup="listbox" aria-expanded={open} aria-label={`Cantidad: ${unit(value)}`} onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 rounded-2xl bg-bg px-4 py-3 text-left text-[15px] transition-colors hover:bg-accent/50">
        <span>Cantidad: <strong>{unit(value)}</strong></span>
        <ChevronDown size={18} aria-hidden="true" className={cn("text-primary transition-transform", open && "rotate-180")} />
        <span className="ml-auto text-sm text-muted">{note}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul role="listbox" aria-label="Elegí la cantidad" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}
            className="absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-line bg-surface p-1.5 shadow-[var(--shadow-lift)]">
            {options.map((n) => (
              <li key={n}>
                <button type="button" role="option" aria-selected={n === value} onClick={() => { onChange(n); setOpen(false); }}
                  className={cn("flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[15px] transition-colors", n === value ? "bg-accent/70 font-bold text-primary" : "hover:bg-accent/40")}>
                  {unit(n)}{n === value && <Check size={16} aria-hidden="true" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
