"use client";
import { Input } from "@/components/atoms/Field";

/** Campo numérico entero (montos en pesos enteros, unidades, días). */
export function NumberField({ id, label, value, onChange, min = 0, suffix, hint }: { id: string; label: string; value: number | undefined; onChange: (v: number) => void; min?: number; suffix?: string; hint?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-bold">{label}{suffix && <span className="font-normal text-muted"> ({suffix})</span>}</label>
      <Input id={id} type="number" inputMode="numeric" step={1} min={min} value={value ?? ""} aria-describedby={hint ? `${id}-h` : undefined}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Math.max(min, Math.round(Number(e.target.value))))} />
      {hint && <p id={`${id}-h`} className="text-xs text-muted">{hint}</p>}
    </div>
  );
}
