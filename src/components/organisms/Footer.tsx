import Link from "next/link";
import { brand } from "@/config/brand";
import { Logo } from "@/components/atoms/Logo";
import { ResetDemoButton } from "./ResetDemoButton";

const LINKS = [
  { href: "/preguntas/", label: "Preguntas frecuentes" },
  { href: "/terminos/", label: "Términos y condiciones" },
  { href: "/privacidad/", label: "Política de privacidad" },
  { href: "/pedido/demo-velmar/", label: "Seguir mi pedido (demo)" },
  { href: "/cuenta/", label: "Mi cuenta (demo)" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="chevron-pattern">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-28 pt-10 md:grid-cols-3">
          <div className="flex flex-col gap-3">
            <Logo />
            <p className="text-sm text-muted">{brand.tagline}. Hecho en {brand.city}.</p>
            {brand.instagram && (
              <a href={`https://instagram.com/${brand.instagram}`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-primary underline-offset-4 hover:underline">
                Instagram @{brand.instagram}
              </a>
            )}
          </div>
          <nav aria-label="Legales y ayuda">
            <ul className="flex flex-col gap-2 text-sm">
              {LINKS.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-ink underline-offset-4 hover:underline">{l.label}</Link></li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-3">
            <Link href="/arrepentimiento/" className="inline-flex w-fit items-center rounded-full border-2 border-ink px-4 py-2 text-sm font-extrabold text-ink hover:bg-accent">
              Botón de arrepentimiento
            </Link>
            <p className="text-xs text-muted">
              Vendedor: {brand.legalName ?? "razón social a confirmar"} · CUIT {brand.cuit ?? "a confirmar"}.
            </p>
            <p className="text-xs text-muted">
              Demo de venta preparada por Eclipse. Paleta y textos provisionales. <ResetDemoButton className="font-bold text-primary underline" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
