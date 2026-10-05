"use client";
import type { ComponentType } from "react";
import { useSyncExternalStore } from "react";
import { seasonalThemes, themeCoupons } from "@/demo/fixtures/themes";
import type { SeasonId } from "@/demo/types";
import { AMBIENT } from "./ambient";
import { AmbientField } from "./AmbientField";
import { SKINS } from "./skins";
import { BlackFridayScene, HotSaleScene, NewYearScene } from "./splash/celebration";
import { EasterScene, MothersScene, PatrickScene, ValentineScene } from "./splash/love";
import { ChristmasScene, HalloweenScene } from "./splash/night";
import { AnimalScene, FathersScene, FriendsScene, KidsScene } from "./splash/play";

const noop = () => () => {};
const readSeason = () => (document.documentElement.dataset.season as SeasonId | undefined) ?? null;
const hotSalePct = themeCoupons.find((c) => c.themeId === "hot-sale")?.value ?? 30;

/** Una escena distinta por festividad (motion graphics). */
const SCENES: Record<SeasonId, ComponentType> = {
  navidad: ChristmasScene, halloween: HalloweenScene, "ano-nuevo": NewYearScene, "black-friday": BlackFridayScene,
  "hot-sale": () => <HotSaleScene discount={hotSalePct} />, "san-valentin": ValentineScene, "dia-de-la-madre": MothersScene,
  "san-patricio": PatrickScene, pascuas: EasterScene, "dia-del-animal": AnimalScene, "dia-del-padre": FathersScene,
  "dia-del-amigo": FriendsScene, "dia-del-nino": KidsScene,
};

/**
 * Escena de temporada dentro de la pantalla de carga. El script del <head> ya marcó `data-season` (colores del
 * fondo sin parpadeo); esto suma la animación propia de cada fecha sobre las partículas de su fondo.
 */
export function ThemeSplashScene() {
  const id = useSyncExternalStore(noop, readSeason, () => null);
  if (!id || !SKINS[id]) return null;
  const Scene = SCENES[id];
  const name = seasonalThemes.find((t) => t.id === id)?.name ?? "";
  return (
    <div aria-hidden="true" className="season-scene">
      <AmbientField layers={AMBIENT[id]} density={1.2} className="absolute inset-0" />
      <Scene />
      <p className="season-tag eyebrow left-1/2 -translate-x-1/2 whitespace-nowrap">Especial {name}</p>
    </div>
  );
}
