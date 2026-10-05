import type { ReactNode } from "react";
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

/** `topper`: adorno que se apoya sobre la marca (el sombrero de la temática vigente). */
export function Logo({ className, tone = "dark", topper }: { className?: string; tone?: "dark" | "light"; topper?: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative">
        <LogoMark className={tone === "light" ? "text-brass" : undefined} />
        {topper && <span className="animate-pop pointer-events-none absolute -right-2.5 -top-4 h-6 w-6 rotate-[14deg] drop-shadow-[0_2px_2px_rgb(0_0_0/0.25)]">{topper}</span>}
      </span>
      <span className={cn("font-display text-[1.6rem] leading-none", tone === "light" ? "text-[#f6f1e8]" : "text-ink")}>{brand.name}</span>
    </span>
  );
}
