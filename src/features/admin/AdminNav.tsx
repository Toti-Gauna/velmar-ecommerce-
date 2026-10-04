"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import { LogoMark } from "@/components/atoms/Logo";
import { Sheet } from "@/components/motion/Sheet";
import { cn } from "@/lib/cn";
import { ADMIN_GROUPS, ADMIN_NAV } from "./nav";

function isActive(pathname: string, href: string): boolean {
  return href === "/admin-demo/" ? pathname === "/admin-demo/" || pathname === "/admin-demo" : pathname.startsWith(href);
}

/** Secciones agrupadas; se usa en la barra lateral (escritorio) y en el menú hamburguesa (celular). */
function NavGroups({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex flex-col gap-5">
      {ADMIN_GROUPS.map((g) => (
        <div key={g}>
          <p className="eyebrow mb-1.5 px-4 text-[10px] text-[#9d9583]">{g}</p>
          <ul className="flex flex-col gap-0.5">
            {ADMIN_NAV.filter((n) => n.group === g).map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <li key={href}>
                  <Link href={href} onClick={onNavigate} aria-current={active ? "page" : undefined}
                    className={cn("flex min-h-11 items-center gap-3 rounded-2xl px-4 text-sm font-bold transition-colors", active ? "bg-white/10 text-brass" : "text-[#d8cfbd] hover:bg-white/5 hover:text-white")}>
                    <Icon size={18} aria-hidden="true" /> {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = ADMIN_NAV.find((n) => isActive(pathname, n.href)) ?? ADMIN_NAV[0];
  const CurrentIcon = current.icon;
  return (
    <>
      <nav aria-label="Secciones del panel demo" className="hidden lg:sticky lg:top-16 lg:block lg:self-start lg:rounded-[2rem] lg:bg-night lg:p-3 lg:py-5 lg:shadow-[var(--shadow-lift)]">
        <NavGroups pathname={pathname} />
      </nav>
      <div className="flex items-center gap-3 lg:hidden">
        <button type="button" onClick={() => setOpen(true)} aria-label="Abrir menú del panel" aria-expanded={open}
          className="flex min-h-12 flex-1 items-center gap-3 rounded-2xl bg-night px-4 text-left text-[#f6f1e8] shadow-[var(--shadow-card)]">
          <Menu size={20} aria-hidden="true" className="text-brass" />
          <span className="flex min-w-0 flex-1 items-center gap-2 font-bold"><CurrentIcon size={17} aria-hidden="true" className="shrink-0 text-[#cfc6b3]" /><span className="truncate">{current.label}</span></span>
          <ChevronDown size={18} aria-hidden="true" className="text-[#cfc6b3]" />
        </button>
      </div>
      <Sheet open={open} onClose={() => setOpen(false)} title="Menú del panel" side="left" className="bg-night text-[#f6f1e8]">
        <nav aria-label="Secciones del panel demo (menú)" className="flex h-full flex-col overflow-y-auto px-3 pb-8 pt-6">
          <div className="mb-6 flex items-center gap-3 px-4">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f6f1e8]"><LogoMark className="h-6 w-6" /></span>
            <span><span className="font-display block text-xl leading-none">Velmar</span><span className="text-xs text-brass">Panel demo · datos ficticios</span></span>
          </div>
          <NavGroups pathname={pathname} onNavigate={() => setOpen(false)} />
          <Link href="/" onClick={() => setOpen(false)} className="mt-8 px-4 text-sm font-bold text-brass underline underline-offset-4">Ver la tienda</Link>
        </nav>
      </Sheet>
    </>
  );
}
