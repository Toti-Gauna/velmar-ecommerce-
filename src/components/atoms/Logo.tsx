import { brand } from "@/config/brand";
import { cn } from "@/lib/cn";

/** Marca provisional: dos chevrones + nombre en Fraunces. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 44" aria-hidden="true" className={cn("h-8 w-8 text-primary", className)}>
      <path d="M8 22 24 8l16 14" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 36 24 22l16 14" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className={tone === "light" ? "text-brass" : undefined} />
      <span className={cn("font-display text-[1.6rem] leading-none", tone === "light" ? "text-[#f6f1e8]" : "text-ink")}>{brand.name}</span>
    </span>
  );
}
