"use client";
import { CalendarDays, Check } from "lucide-react";
import { Sheet } from "@/components/motion/Sheet";
import { Decor } from "@/components/illustrations/seasonal/Decor";
import { currentTheme, themeOffer } from "@/demo/engine/themes";
import type { SeasonId } from "@/demo/types";
import { cn } from "@/lib/cn";
import { formatDayRange } from "@/lib/date";
import { useDemoData } from "@/stores/admin";
import { useThemePreview } from "@/stores/themePreview";
import { useToasts } from "@/stores/toast";
import { skinOf } from "./skins";

/** Selector de "Probar temáticas": cambia solo la vista de este navegador; el panel define la real. */
export function ThemePicker({ open, onClose }: { open: boolean; onClose: () => void }) {
  const themes = useDemoData((d) => d.themes).filter((t) => t.active);
  const { previewId, setPreview } = useThemePreview();
  const toast = useToasts((s) => s.push);
  const byPanel = open ? currentTheme(new Date(), null) : null;
  const pick = (id: SeasonId | null, name: string) => {
    setPreview(id);
    onClose();
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast({ tone: "info", title: id ? `Probando: ${name}` : "Temática automática", description: id ? "Solo en este navegador. Salís desde la cinta de arriba." : `Ves la que corresponde hoy${byPanel ? `: ${byPanel.name}` : " (ninguna)"}.` });
  };
  return (
    <Sheet open={open} onClose={onClose} title="Probar temáticas">
      <div className="px-6 pb-3 pt-6">
        <p className="eyebrow text-brass-ink">Fechas especiales</p>
        <h2 className="font-display mt-1 text-3xl">Probar temáticas</h2>
        <p className="mt-2 text-sm text-muted">Mirá cómo se ve la tienda en cada fecha comercial, con sus ofertas y decoraciones. Solo cambia en este navegador.</p>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-8">
        <button type="button" onClick={() => pick(null, "")} aria-pressed={previewId === null}
          className={cn("mb-4 flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors", previewId === null ? "border-primary bg-accent/60" : "border-line bg-surface hover:bg-accent/40")}>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-primary"><CalendarDays size={20} aria-hidden="true" /></span>
          <span className="min-w-0 flex-1">
            <strong className="block text-[15px]">Automática (la del cliente)</strong>
            <span className="block text-xs text-muted">Hoy: {byPanel ? byPanel.name : "sin temática"}</span>
          </span>
          {previewId === null && <Check size={18} aria-hidden="true" className="text-primary" />}
        </button>
        <ul className="grid grid-cols-2 gap-3">
          {themes.map((t) => {
            const skin = skinOf(t.id);
            const on = previewId === t.id;
            const offer = themeOffer(t);
            return (
              <li key={t.id}>
                <button type="button" onClick={() => pick(t.id, t.name)} aria-pressed={on} aria-label={`Probar ${t.name}`}
                  className={cn("relative flex h-full w-full flex-col overflow-hidden rounded-2xl text-left text-white ring-offset-2 ring-offset-bg transition-transform hover:-translate-y-0.5", on && "ring-2 ring-primary")}
                  style={{ background: `linear-gradient(140deg, ${skin.from}, ${skin.to})` }}>
                  <Decor kind={skin.decor[0]!} className="absolute -right-2 -top-1 h-16 w-16 rotate-6 opacity-95" />
                  <span className="relative mt-12 px-3 text-[15px] font-bold leading-tight">{t.name}</span>
                  <span className="relative px-3 text-[11px] text-white/75">{formatDayRange(t.startsOn, t.endsOn)}</span>
                  <span className="relative mx-3 mb-3 mt-2 w-fit rounded-full px-2 py-0.5 text-[11px] font-extrabold" style={{ background: skin.accent, color: skin.accentInk }}>{offer?.label ?? "Sin oferta"}</span>
                  {on && <Check size={16} aria-hidden="true" className="absolute left-3 top-3" />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </Sheet>
  );
}
