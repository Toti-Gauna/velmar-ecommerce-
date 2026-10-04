import { cn } from "@/lib/cn";

interface Option {
  value: string;
  label: string;
  hex?: string;
  disabled?: boolean;
}

export function VariantPicker({ legend, options, value, onChange, swatches }: { legend: string; options: Option[]; value?: string; onChange: (v: string) => void; swatches?: boolean }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-bold">
        {legend}: <span className="font-semibold text-muted">{value ?? "elegí una opción"}</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className={cn(
            "relative flex cursor-pointer items-center gap-2 rounded-full border-2 px-3 py-2 text-sm font-bold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/50",
            value === o.value ? "border-primary bg-accent/50" : "border-line bg-surface hover:border-wood",
            o.disabled && "text-muted line-through",
          )}>
            <input type="radio" className="sr-only" name={legend} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
            {swatches && o.hex && <span aria-hidden="true" className="h-5 w-5 rounded-full border border-black/10" style={{ background: o.hex }} />}
            {o.label}
            {o.disabled && <span className="sr-only">(sin stock)</span>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
