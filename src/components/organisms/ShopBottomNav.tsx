"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Home, LayoutGrid, TicketPercent, UserRound } from "lucide-react";
import { cn } from "@/lib/cn";
import { bottomBarFor } from "./bottomBars";

const TABS = [
  { href: "/", label: "Inicio", icon: Home, match: (p: string) => p === "/" },
  { href: "/categorias/", label: "Categorías", icon: LayoutGrid, match: (p: string) => p.startsWith("/categorias") || p.startsWith("/c/") },
  { href: "/cupones/", label: "Cupones", icon: TicketPercent, match: (p: string) => p.startsWith("/cupones") },
  { href: "/cuenta/", label: "Mi cuenta", icon: UserRound, match: (p: string) => p.startsWith("/cuenta") },
];

/** Barra inferior de la tienda en el celular. No aparece donde hay una barra de compra propia. */
export function ShopBottomNav() {
  const pathname = usePathname();
  if (bottomBarFor(pathname) !== "nav") return null;
  return (
    <nav aria-label="Navegación inferior" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_30px_-20px_rgb(28_32_22/0.35)] lg:hidden">
      <ul className="mx-auto flex h-16 max-w-lg px-2">
        {TABS.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href} className="flex flex-1">
              <Link href={href} aria-current={active ? "page" : undefined}
                className={cn("relative flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-bold transition-colors", active ? "text-primary" : "text-muted")}>
                {active && <motion.span layoutId="shop-tab" aria-hidden="true" className="absolute top-0 h-[3px] w-8 rounded-b-full bg-primary" />}
                <Icon size={21} aria-hidden="true" strokeWidth={active ? 2.4 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
