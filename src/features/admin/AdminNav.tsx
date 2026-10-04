"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { ADMIN_NAV } from "./nav";

function isActive(pathname: string, href: string): boolean {
  return href === "/admin-demo/" ? pathname === "/admin-demo/" || pathname === "/admin-demo" : pathname.startsWith(href);
}

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Secciones del panel demo" className="min-w-0 lg:sticky lg:top-16 lg:self-start lg:rounded-[2rem] lg:bg-night lg:p-3 lg:shadow-[var(--shadow-lift)]">
      <ul className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
        {ADMIN_NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href} className="shrink-0">
              <Link href={href} aria-current={active ? "page" : undefined}
                className={cn("flex min-h-11 items-center gap-2.5 rounded-full border px-3 text-sm font-bold transition-colors lg:rounded-2xl lg:border-transparent lg:px-4",
                  active ? "border-night bg-night text-[#f6f1e8] lg:bg-white/10 lg:text-brass" : "border-line bg-surface hover:bg-accent lg:bg-transparent lg:text-[#d8cfbd] lg:hover:bg-white/5 lg:hover:text-white")}>
                <Icon size={18} aria-hidden="true" /> {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
