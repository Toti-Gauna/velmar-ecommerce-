"use client";
import { bestSellers, newArrivals } from "@/demo/engine/catalog";
import { recommendForCart } from "@/demo/engine/recommend";
import { useDemoVersion } from "@/stores/admin";
import { useCart } from "@/stores/cart";
import { useHydrated } from "@/stores/hydration";
import { BenefitsBar } from "../home/BenefitsBar";
import { CategoryCircles } from "../home/CategoryCircles";
import { ClubBand } from "../home/ClubBand";
import { HeroCarousel } from "../home/HeroCarousel";
import { LiveCustomizer } from "../home/LiveCustomizer";
import { ProductRail } from "../home/ProductRail";
import { ProductStories } from "../home/ProductStories";
import { Values } from "../home/Values";
import { toCard } from "./mappers";

/** Inicio de tienda: carrusel, beneficios, categorías, recomendados, más vendidos, historias y novedades. */
export function HomeSections() {
  const data = useDemoVersion();
  const hydrated = useHydrated();
  const lines = useCart((s) => s.lines);
  const slides = data.content.slides.filter((s) => s.active !== false);
  const best = bestSellers(8);
  // Recomendados: si hay carrito, complementos; si no, lo destacado que no está en "más vendidos".
  const recommended = recommendForCart(hydrated ? lines : [], 8);
  return (
    <div className="flex flex-col gap-12 sm:gap-20">
      <div className="flex flex-col gap-6">
        <HeroCarousel slides={slides} />
        <BenefitsBar />
      </div>
      <CategoryCircles />
      <ProductRail id="recomendados" eyebrow="Elegidos para vos" title="Recomendados" products={recommended.map(toCard)} href="/categorias/" />
      <LiveCustomizer eyebrow={data.content.homeCta.title} />
      <ProductRail id="mas-vendidos" eyebrow="Los favoritos" title="Más vendidos" accent="del taller" products={best.map(toCard)} href="/categorias/" />
      <ProductStories />
      <ProductRail id="novedades" eyebrow="Recién salidos" title="Novedades" products={newArrivals(8).map(toCard)} />
      <ClubBand />
      <Values />
    </div>
  );
}
