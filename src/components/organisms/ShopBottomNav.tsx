"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, LayoutGrid, TicketPercent, UserRound } from "lucide-react";
import { cn } from "@/lib/cn";
import { bottomBarFor } from "./bottomBars";

const TABS = [
  { href: "/", label: "Inicio", icon: Home, match: (p: string) => p === "/" },
  { href: "/categorias/", label: "Categorías", icon: LayoutGrid, match: (p: string) => p.startsWith("/categorias") || p.startsWith("/c/") },
  { href: "/favoritos/", label: "Favoritos", icon: Heart, match: (p: string) => p.startsWith("/favoritos") },
  { href: "/cupones/", label: "Cupones", icon: TicketPercent, match: (p: string) => p.startsWith("/cupones") },
  { href: "/cuenta/", label: "Mi cuenta", icon: UserRound, match: (p: string) => p.startsWith("/cuenta") },
];

/** Barra inferior de la tienda en el celular: cápsula flotante de vidrio (pedido de Ignacio). No aparece donde hay una barra de compra propia. */
export function ShopBottomNav() {
  const pathname = usePathname();
  if (bottomBarFor(pathname) !== "nav") return null;
  const current = TABS.findIndex((t) => t.match(pathname));
  return (
    <nav aria-label="Navegación inferior" data-shop-bottomnav
      className="fixed inset-x-3 bottom-[calc(0.625rem+env(safe-area-inset-bottom))] z-40 mx-auto max-w-md rounded-[1.75rem] border border-white/25 bg-surface/70 shadow-[0_18px_40px_-14px_rgb(28_32_22/0.45),inset_0_1px_0_rgb(255_255_255/0.45)] ring-1 ring-ink/[0.06] backdrop-blur-xl backdrop-saturate-150 lg:hidden">
      {/* 8.4.28: la pastilla del tab activo se desliza con una transición CSS (en el compositor). Con layoutId de motion,
          cada cambio de sección medía toda la página y animaba con JS justo mientras se montaba la nueva. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-1.5 inset-y-1.5">
        <span className={cn("block h-full w-1/5 px-0.5 transition-[transform,opacity] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none", current < 0 && "opacity-0")}
          style={{ transform: `translateX(${Math.max(current, 0) * 100}%)` }}>
          <span className="block h-full rounded-[1.25rem] bg-primary/[0.12]" />
        </span>
      </span>
      <ul className="relative flex h-16 px-1.5">
        {TABS.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href} className="flex flex-1">
              <Link href={href} aria-current={active ? "page" : undefined}
                className={cn("relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-[1.4rem] text-[11px] font-bold transition-colors", active ? "text-primary" : "text-muted")}>
                <Icon size={21} aria-hidden="true" strokeWidth={active ? 2.4 : 2} className={cn("relative", active && "animate-pop")} />
                <span className="relative">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
