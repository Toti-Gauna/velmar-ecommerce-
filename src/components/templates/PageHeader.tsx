import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  href: string;
  label: string;
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Ruta de navegación" className="mb-2">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
        <li><Link href="/" className="hover:underline">Inicio</Link></li>
        {crumbs.map((c) => (
          <li key={c.href} className="flex items-center gap-1">
            <ChevronRight size={14} aria-hidden="true" />
            <Link href={c.href} className="hover:underline">{c.label}</Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({ title, crumbs = [], children }: { title: string; crumbs?: Crumb[]; children?: ReactNode }) {
  return (
    <div className="mb-6">
      {crumbs.length > 0 && <Breadcrumbs crumbs={crumbs} />}
      <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">{title}</h1>
      {children && <div className="mt-2 max-w-2xl text-muted">{children}</div>}
    </div>
  );
}
