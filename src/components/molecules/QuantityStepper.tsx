"use client";
import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
}

export function QuantityStepper({ value, min = 1, max, onChange, label }: QuantityStepperProps) {
  const btn = "grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 disabled:opacity-30";
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-full border border-ink/15 bg-surface p-0.5">
      <button type="button" aria-label="Restar uno" disabled={value <= min} onClick={() => onChange(value - 1)} className={btn}><Minus size={16} aria-hidden="true" /></button>
      <output aria-live="polite" className="w-8 text-center text-[15px] font-extrabold tabular-nums">{value}</output>
      <button type="button" aria-label="Sumar uno" disabled={value >= max} onClick={() => onChange(value + 1)} className={btn}><Plus size={16} aria-hidden="true" /></button>
    </div>
  );
}
