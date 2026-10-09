"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { LogoMark } from "@/components/atoms/Logo";
import { cn } from "@/lib/cn";
import { ADMIN_GROUPS, ADMIN_NAV, BADGE_TEXT, isActive } from "./nav";
import { useNavCounts } from "./useNavCounts";

/**
 * Contenido de la barra lateral del panel: marca, secciones agrupadas con contadores y la "cuenta" demo.
 * Se usa fija a la izquierda en escritorio y dentro del menú hamburguesa en el celular.
 */
export function SidebarContent({ onNavigate, layoutKey }: { onNavigate?: () => void; layoutKey: string }) {
  const tour = layoutKey === "desktop" ? "nav" : undefined;
  const pathname = usePathname();
  const counts = useNavCounts();
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 pb-6 pt-6">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#f3dca6,#d2ad69_55%,#a17a3a)] shadow-[inset_0_1px_0_rgb(255_255_255/0.5),0_8px_20px_-10px_rgb(210_173_105/0.8)]">
          <LogoMark className="h-6 w-6 text-night" />
        </span>
        <span className="min-w-0">
          <span className="font-display block text-[1.45rem] leading-none text-[#f6f1e8]">Velmar</span>
          <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.16em] text-brass">Admin · demo</span>
        </span>
      </div>
      <nav aria-label="Secciones del panel demo" data-tour={tour} className="no-scrollbar flex-1 overflow-y-auto px-3 pb-4">
        {ADMIN_GROUPS.map((g) => (
          <div key={g} className="mb-5">
            <p className="mb-1.5 px-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#8f8878]">{g}</p>
            <ul className="flex flex-col gap-0.5">
              {ADMIN_NAV.filter((n) => n.group === g).map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;
                const count = item.badge ? counts[item.badge] : 0;
                return (
                  <li key={item.href}>
                    <Link href={item.href} onClick={onNavigate} aria-current={active ? "page" : undefined}
                      className={cn("group relative flex h-10 items-center gap-3 rounded-xl px-3 text-[14px] font-semibold transition-colors",
                        active ? "text-white" : "text-[#cfc6b3] hover:bg-white/[0.04] hover:text-white")}>
                      {active && <span aria-hidden="true" className="animate-fade-in absolute inset-0 rounded-xl bg-white/[0.08] ring-1 ring-white/[0.06]" />}
                      {active && <span aria-hidden="true" className="absolute -left-3 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-brass" />}
                      <Icon size={18} aria-hidden="true" className={cn("relative shrink-0 transition-colors", active ? "text-brass" : "text-[#9d9583] group-hover:text-[#e9e2d3]")} />
                      <span className="relative min-w-0 flex-1 truncate">{item.label}</span>
                      {count > 0 && (
                        <span className={cn("relative grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-extrabold tabular-nums",
                          item.badge === "payments" ? "bg-brass text-night" : item.badge === "stock" || item.badge === "materials" ? "bg-warning/80 text-night" : item.badge === "late" ? "bg-danger text-white" : "bg-white/10 text-[#e9e2d3]")}>
                          {count}<span className="sr-only"> {BADGE_TEXT[item.badge!]}</span>
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="m-3 mt-0 rounded-2xl bg-white/[0.05] p-3 ring-1 ring-white/[0.06]">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="font-display grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f6f1e8] text-lg text-night">V</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold text-[#f6f1e8]">Velmar (demo)</span>
            <span className="block truncate text-xs text-[#9d9583]">Datos ficticios · sin login</span>
          </span>
        </div>
        <Link href="/" onClick={onNavigate} className="mt-3 flex h-9 items-center justify-center gap-1.5 rounded-xl bg-white/[0.07] text-[13px] font-bold text-[#f6f1e8] transition-colors hover:bg-white/[0.12]">
          Ir a la tienda <ArrowUpRight size={15} aria-hidden="true" className="text-brass" />
        </Link>
      </div>
    </div>
  );
}

/** Barra lateral fija de escritorio, a todo el alto de la pantalla. */
export function AdminSidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-[272px] shrink-0 border-r border-white/[0.06] bg-night lg:block">
      <SidebarContent layoutKey="desktop" />
    </aside>
  );
}
