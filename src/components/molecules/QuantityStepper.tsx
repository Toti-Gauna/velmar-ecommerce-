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
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-full border border-line bg-surface">
      <button type="button" aria-label="Restar uno" disabled={value <= min} onClick={() => onChange(value - 1)} className="grid h-11 w-11 place-items-center rounded-full text-primary disabled:opacity-40">
        <Minus size={18} aria-hidden="true" />
      </button>
      <output aria-live="polite" className="w-8 text-center font-bold tabular-nums">{value}</output>
      <button type="button" aria-label="Sumar uno" disabled={value >= max} onClick={() => onChange(value + 1)} className="grid h-11 w-11 place-items-center rounded-full text-primary disabled:opacity-40">
        <Plus size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
