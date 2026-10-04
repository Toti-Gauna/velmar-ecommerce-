"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, UserRound } from "lucide-react";
import { Logo } from "@/components/atoms/Logo";
import { cn } from "@/lib/cn";
import { useCart } from "@/stores/cart";
import { useHydrated } from "@/stores/hydration";
import { SearchForm } from "@/components/molecules/SearchForm";

const NAV = [
  { href: "/categorias/", label: "Categorías" },
  { href: "/crear/", label: "Crear el tuyo" },
  { href: "/preguntas/", label: "Ayuda" },
];

export function Header() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const units = useCart((s) => s.lines.reduce((sum, l) => sum + l.quantity, 0));
  const count = hydrated ? units : 0;
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link href="/" aria-label="Velmar, ir al inicio" className="shrink-0"><Logo /></Link>
        <nav aria-label="Principal" className="ml-4 hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={pathname.startsWith(n.href) ? "page" : undefined}
              className={cn("rounded-full px-3 py-2 text-sm font-bold hover:bg-accent", pathname.startsWith(n.href) ? "text-primary" : "text-ink")}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden w-72 lg:block"><SearchForm compact /></div>
        <div className="ml-auto flex items-center gap-1 lg:ml-2">
          <Link href="/buscar/" aria-label="Buscar" className="grid h-11 w-11 place-items-center rounded-full hover:bg-accent lg:hidden"><Search size={22} aria-hidden="true" /></Link>
          <Link href="/cuenta/" aria-label="Mi cuenta (demo)" className="grid h-11 w-11 place-items-center rounded-full hover:bg-accent"><UserRound size={22} aria-hidden="true" /></Link>
          <Link href="/carrito/" aria-label={`Carrito, ${count} ${count === 1 ? "producto" : "productos"}`} className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-accent">
            <ShoppingBag size={22} aria-hidden="true" />
            {count > 0 && (
              <span key={count} className="animate-pop absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-extrabold text-on-primary">{count}</span>
            )}
          </Link>
        </div>
      </div>
      <nav aria-label="Secciones" className="flex gap-1 overflow-x-auto px-3 pb-2 md:hidden">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className={cn("shrink-0 rounded-full border px-3 py-1.5 text-sm font-bold", pathname.startsWith(n.href) ? "border-primary bg-primary text-on-primary" : "border-line bg-surface")}>
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
