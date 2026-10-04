"use client";
import { ButtonLink } from "@/components/atoms/Button";
import { Carousel } from "@/components/organisms/Carousel";
import { bestSellers, newArrivals } from "@/demo/engine/catalog";
import { useDemoVersion } from "@/stores/admin";
import { CategoryBento } from "../home/CategoryBento";
import { ClubBand } from "../home/ClubBand";
import { Hero } from "../home/Hero";
import { HowItWorks } from "../home/HowItWorks";
import { LiveCustomizer } from "../home/LiveCustomizer";
import { ProductRail } from "../home/ProductRail";
import { Values } from "../home/Values";
import { WordStrip } from "../home/WordStrip";
import { toCard } from "./mappers";

/** Inicio editorial. Todo sale de los datos editables (carrusel, destacadas, textos, misiones). */
export function HomeSections() {
  const data = useDemoVersion();
  const slides = data.content.slides.filter((s) => s.active !== false);
  return (
    <div className="flex flex-col gap-20 sm:gap-28">
      <Hero />
      <WordStrip />
      <ProductRail id="mas-vendidos" eyebrow="Los favoritos" title="Más vendidos" accent="del taller" products={bestSellers(4).map(toCard)} href="/categorias/" />
      <CategoryBento />
      <HowItWorks />
      <LiveCustomizer />
      {slides.length > 0 && <Carousel slides={slides} />}
      <ClubBand />
      <ProductRail id="novedades" eyebrow="Recién salidos" title="Novedades" accent="de temporada" products={newArrivals(4).map(toCard)} />
      <section aria-labelledby="cta-crear" className="text-center">
        <p className="eyebrow text-brass-ink">{data.content.homeCta.title}</p>
        <h2 id="cta-crear" className="font-display mx-auto mt-4 max-w-3xl text-4xl leading-tight sm:text-6xl">{data.content.homeCta.text}</h2>
        <ButtonLink href="/crear/" size="lg" className="mt-8">Crear mi producto</ButtonLink>
      </section>
      <Values />
    </div>
  );
}
