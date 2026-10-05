"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useCart } from "@/stores/cart";
import { useHydrated } from "@/stores/hydration";
import { useUi } from "@/stores/ui";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";
import { ThemeLogo } from "@/features/themes/ThemeLogo";
import { MobileMenu } from "./MobileMenu";
import { ShopMenu } from "./ShopMenu";

export const NAV = [
  { href: "/categorias/", label: "Tienda" },
  { href: "/crear/", label: "Crear el tuyo" },
  { href: "/club/", label: "Club Velmar" },
  { href: "/preguntas/", label: "Ayuda" },
];

export function Header() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const units = useCart((s) => s.lines.reduce((sum, l) => sum + l.quantity, 0));
  const { openCart, setMenu, setSearch } = useUi();
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const count = hydrated ? units : 0;
  const icon = "grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5";
  return (
    <header data-shop-header className={cn("sticky top-[env(safe-area-inset-top)] z-40 bg-surface lg:glass border-b transition-[border-color,box-shadow] duration-300", compact ? "border-line shadow-[0_8px_30px_-20px_rgb(28_32_22/0.35)]" : "border-transparent")}>
      <div className={cn("mx-auto flex max-w-7xl items-center gap-2 px-4 transition-[height] duration-300 sm:px-6", compact ? "h-16" : "h-[4.5rem] lg:h-20")}>
        <button type="button" onClick={() => setMenu(true)} aria-label="Abrir menú" className={cn(icon, "-ml-2 lg:hidden")}><Menu size={22} aria-hidden="true" /></button>
        <Link href="/" aria-label="Velmar, ir al inicio" className="shrink-0"><ThemeLogo /></Link>
        <nav aria-label="Principal" className="ml-8 hidden items-center gap-1 lg:flex">
          {NAV.map((n) => n.href === "/categorias/" ? <ShopMenu key={n.href} active={pathname.startsWith("/c") || pathname.startsWith("/p")} /> : (
            <Link key={n.href} href={n.href} aria-current={pathname.startsWith(n.href) ? "page" : undefined}
              className={cn("relative rounded-full px-4 py-2 text-[15px] font-semibold transition-colors hover:text-primary", pathname.startsWith(n.href) ? "text-primary" : "text-ink/80")}>
              {n.label}
              {pathname.startsWith(n.href) && <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-brass" />}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-0.5">
          <ThemeToggle className={cn(icon, "max-sm:hidden")} />
          <button type="button" onClick={() => setSearch(true)} aria-label="Buscar" className={icon}><Search size={21} aria-hidden="true" /></button>
          <Link href="/cuenta/" aria-label="Mi cuenta (demo)" className={cn(icon, "max-sm:hidden")}><UserRound size={21} aria-hidden="true" /></Link>
          <button type="button" onClick={() => openCart()} aria-label={`Carrito, ${count} ${count === 1 ? "producto" : "productos"}`} className={cn(icon, "relative")}>
            <ShoppingBag size={21} aria-hidden="true" />
            {count > 0 && <span key={count} className="animate-pop absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-extrabold text-on-primary">{count}</span>}
          </button>
        </div>
      </div>
      <MobileMenu />
    </header>
  );
}
