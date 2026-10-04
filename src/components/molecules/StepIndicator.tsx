import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center gap-1.5" aria-label="Pasos">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={step} className="flex flex-1 flex-col gap-1.5" aria-current={active ? "step" : undefined}>
            <span className={cn("h-1.5 rounded-full transition-colors duration-300", done || active ? "bg-primary" : "bg-line")} />
            <span className={cn("flex items-center gap-1 text-[11px] font-bold sm:text-xs", active ? "text-primary" : "text-muted")}>
              {done && <Check size={12} aria-hidden="true" />}
              <span className={cn(!active && "max-sm:sr-only")}>{step}</span>
              {done && <span className="sr-only">(completo)</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
