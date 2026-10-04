import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export const inputClass =
  "w-full min-h-11 rounded-xl border border-line bg-surface px-3.5 text-base text-ink placeholder:text-muted/70 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 aria-[invalid=true]:border-danger";

interface FieldProps {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}

/** Etiqueta + control + ayuda + error accesible (aria-describedby lo arma el control con fieldIds). */
export function Field({ id, label, hint, error, children, className }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-bold text-ink">{label}</label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="text-xs text-muted">{hint}</p>}
      {error && <p id={`${id}-error`} role="alert" className="text-sm font-semibold text-danger">{error}</p>}
    </div>
  );
}

export function describedBy(id: string, error?: string, hint?: boolean): string | undefined {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

export function Input(props: ComponentProps<"input">) {
  return <input {...props} className={cn(inputClass, props.className)} />;
}

export function Textarea(props: ComponentProps<"textarea">) {
  return <textarea {...props} className={cn(inputClass, "min-h-28 py-2.5", props.className)} />;
}
