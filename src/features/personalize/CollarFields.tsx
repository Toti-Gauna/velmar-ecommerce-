"use client";
import { Ruler } from "lucide-react";
import { useId, useState } from "react";
import { neckRange, sizeForNeck } from "@/demo/engine/collar";
import type { CollarConfig, CollarOption, CollarSpec } from "@/demo/fixtures/collar";
import type { Product } from "@/demo/types";
import { cn } from "@/lib/cn";
import { formatARS } from "@/lib/money";

function Choices<T extends string>({ legend, options, value, onChange }: { legend: string; options: CollarOption<T>[]; value: T; onChange: (v: T) => void }) {
  const name = useId();
  const current = options.find((o) => o.id === value);
  return (
    <fieldset>
      <legend className="mb-2 flex w-full items-baseline justify-between gap-2 text-sm"><span className="font-bold">{legend}</span><span className="text-right font-semibold text-muted">{current?.hint}</span></legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.id} className={cn("flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border px-4 text-sm font-bold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/50",
            value === o.id ? "border-ink bg-ink text-bg" : "border-ink/15 bg-surface hover:border-ink/35")}>
            <input type="radio" name={name} className="sr-only" checked={value === o.id} onChange={() => onChange(o.id)} />
            {o.name}{o.delta > 0 && <span className={value === o.id ? "text-bg/75" : "text-muted"}>+{formatARS(o.delta)}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

interface Props {
  spec: CollarSpec;
  product: Product;
  config: CollarConfig;
  onChange: (c: CollarConfig) => void;
  variantId: string;
  /** Elige el talle (variante) que corresponde al cuello medido. */
  onSize: (variantId: string) => void;
}

/** Opciones del collar: formato del nombre, color del cordón, material, dije y talle por centímetros de cuello. */
export function CollarFields({ spec, product, config, onChange, variantId, onSize }: Props) {
  // El texto del campo sigue a la configuración: si cambia desde afuera (combinación lista, talle elegido a mano) se actualiza.
  const [neck, setNeck] = useState(config.neckCm ? String(config.neckCm) : "");
  const [seen, setSeen] = useState(config.neckCm);
  if (config.neckCm !== seen) { setSeen(config.neckCm); setNeck(config.neckCm ? String(config.neckCm).replace(".", ",") : ""); }
  const cordName = useId();
  const cm = Number(neck.replace(",", "."));
  const fit = neck ? sizeForNeck(spec, product, cm) : null;
  const range = neckRange(spec, variantId);
  const set = (p: Partial<CollarConfig>) => onChange({ ...config, ...p });
  return (
    <div className="flex flex-col gap-5">
      <Choices legend="Cómo va el nombre" options={spec.formats} value={config.format} onChange={(format) => set({ format })} />
      <fieldset>
        <legend className="mb-2 text-sm font-bold">Color del cordón: <span className="font-semibold text-muted">{config.cordColorName}</span></legend>
        <div className="flex flex-wrap gap-2">
          {spec.cordColors.map((c) => (
            <label key={c.hex} title={c.name} className={cn("grid h-11 w-11 cursor-pointer place-items-center rounded-full border-2 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/50", config.cordColor === c.hex ? "border-ink" : "border-transparent")}>
              <input type="radio" name={cordName} className="sr-only" checked={config.cordColor === c.hex} onChange={() => set({ cordColor: c.hex, cordColorName: c.name })} />
              <span aria-hidden="true" className="h-8 w-8 rounded-full border border-black/15 bg-[repeating-linear-gradient(135deg,rgb(0_0_0/0.12)_0_3px,transparent_3px_6px)]" style={{ backgroundColor: c.hex }} />
              <span className="sr-only">{c.name}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <Choices legend="Material" options={spec.materials} value={config.material} onChange={(material) => set({ material })} />
      <Choices legend="Dije" options={spec.charms} value={config.charm} onChange={(charm) => set({ charm })} />
      <div className="rounded-2xl bg-bg p-3">
        <label htmlFor="p-neck" className="flex items-center gap-2 text-sm font-bold"><Ruler size={16} aria-hidden="true" className="text-primary" /> Contorno de cuello</label>
        <div className="mt-2 flex items-center gap-2">
          <input id="p-neck" type="text" inputMode="decimal" aria-invalid={Boolean(neck && !fit)} placeholder={range ? `${range.min}–${range.max}` : "38"} value={neck}
            aria-describedby="p-neck-hint"
            onChange={(e) => {
              setNeck(e.target.value);
              const raw = e.target.value.trim();
              const n = Number(raw.replace(",", "."));
              const neckCm = raw && Number.isFinite(n) ? Math.round(n * 2) / 2 : undefined;
              setSeen(neckCm);
              const v = neckCm !== undefined ? sizeForNeck(spec, product, neckCm) : null;
              if (v) onSize(v);
              set({ neckCm });
            }}
            className="h-11 w-24 rounded-xl border border-ink/12 bg-surface px-3 text-right font-bold tabular-nums" />
          <span className="text-sm text-muted">cm</span>
        </div>
        <p id="p-neck-hint" role="status" className={cn("mt-2 text-xs", neck && !fit ? "font-bold text-warning" : "text-muted")}>
          {neck && !fit ? "Ese contorno queda fuera de los talles: escribinos por WhatsApp y lo hacemos a medida."
            : fit ? `Te corresponde ${product.variants.find((v) => v.id === fit)?.label}. Medí con un centímetro y sumá dos dedos de holgura.`
            : "Medí con un centímetro y sumá dos dedos de holgura: elegimos el talle por vos."}
        </p>
      </div>
    </div>
  );
}
