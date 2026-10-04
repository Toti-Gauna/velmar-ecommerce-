import { brand } from "@/config/brand";
import { cn } from "@/lib/cn";

/** Marca provisional: dos chevrones verde oliva + nombre. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 44" aria-hidden="true" className={cn("h-8 w-8 text-primary", className)}>
      <path d="M8 22 24 8l16 14" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 36 24 22l16 14" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      <span className="text-xl font-extrabold tracking-tight text-primary">{brand.name}</span>
    </span>
  );
}
