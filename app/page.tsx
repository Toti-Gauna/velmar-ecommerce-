import { Camera, CreditCard, Search, Truck } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/atoms/Button";
import { CategoryTile } from "@/components/molecules/CategoryTile";
import { ProductGrid } from "@/components/molecules/ProductCard";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { Carousel } from "@/components/organisms/Carousel";
import { bestSellers, featuredCategories, newArrivals } from "@/demo/engine/catalog";
import { slides } from "@/demo/fixtures/commerce";
import { HomeMissions } from "@/features/catalog/HomeMissions";
import { toCard } from "@/features/catalog/mappers";

const TRUST = [
  { icon: Camera, title: "Vista previa antes de pagar", text: "Aprobás tu pieza y llega igual al taller." },
  { icon: CreditCard, title: "Tarjeta, Mercado Pago, QR o transferencia", text: "Elegís cómo pagar." },
  { icon: Truck, title: "Envío o retiro", text: "Cadete en Mar del Plata y envíos al país." },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      <Carousel slides={slides} />
      <section aria-labelledby="destacadas">
        <h2 id="destacadas" className="sr-only">Categorías destacadas</h2>
        <div className="grid grid-cols-4 gap-3 sm:gap-6 md:mx-auto md:max-w-2xl">
          {featuredCategories().map((c) => <CategoryTile key={c.slug} slug={c.slug} name={c.name} art={c.art} />)}
          <Link href="/categorias/" className="group flex flex-col items-center gap-2 text-center">
            <span className="grid aspect-square w-full place-items-center rounded-full border-4 border-surface bg-primary text-on-primary shadow-[var(--shadow-card)] transition-transform group-hover:-translate-y-0.5">
              <Search size={28} aria-hidden="true" />
            </span>
            <span className="text-sm font-bold leading-tight">Buscar más cosas</span>
          </Link>
        </div>
      </section>
      <section className="flex flex-col items-start gap-4 rounded-[var(--radius-card)] bg-primary p-6 text-on-primary sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 className="text-2xl font-extrabold">Crear mi producto personalizado</h2>
          <p className="mt-1 opacity-90">Texto, foto o foto de referencia. Mirá cómo queda y aprobalo antes de pagar.</p>
        </div>
        <ButtonLink href="/crear/" variant="secondary" size="lg" className="shrink-0 border-white">Empezar</ButtonLink>
      </section>
      <section aria-labelledby="mas-vendidos">
        <SectionHeader id="mas-vendidos" title="Más vendidos" href="/categorias/" />
        <ProductGrid products={bestSellers(4).map(toCard)} />
      </section>
      <section aria-labelledby="novedades">
        <SectionHeader id="novedades" title="Novedades">Recién salidos del taller.</SectionHeader>
        <ProductGrid products={newArrivals(4).map(toCard)} />
      </section>
      <HomeMissions />
      <ul className="grid gap-3 sm:grid-cols-3">
        {TRUST.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-3 rounded-2xl bg-surface p-4">
            <Icon className="shrink-0 text-primary" aria-hidden="true" />
            <div><p className="font-bold">{title}</p><p className="text-sm text-muted">{text}</p></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
