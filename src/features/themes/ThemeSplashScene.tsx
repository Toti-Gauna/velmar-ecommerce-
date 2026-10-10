"use client";
import { useReducedMotion } from "motion/react";
import type { ComponentType } from "react";
import { useState, useSyncExternalStore } from "react";
import { seasonalThemes, themeCoupons } from "@/demo/fixtures/themes";
import type { SeasonId } from "@/demo/types";
import { AMBIENT } from "./ambient";
import { AmbientField } from "./AmbientField";
import { SKINS } from "./skins";
import { BlackFridayScene, HotSaleScene, NewYearScene } from "./splash/celebration";
import { EasterScene, MothersScene, ValentineScene } from "./splash/love";
import { BanderaScene, IndependenciaScene, MayoScene } from "./splash/patrias";
import { SceneClock, splashElapsed } from "./splash/kit";
import { PrideScene } from "./splash/pride";
import { ChristmasScene, HalloweenScene } from "./splash/night";
import { FathersScene, FriendsScene } from "./splash/cast";
import { AnimalScene, KidsScene } from "./splash/play";

const noop = () => () => {};
const readSeason = () => (document.documentElement.dataset.season as SeasonId | undefined) ?? null;

/** ¿Ya cayó el telón? (fin de la animación, o `splash-done` que pone el script a los 5,2 s o con Escape). */
function subscribeCurtain(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  const splash = document.getElementById("velmar-splash");
  splash?.addEventListener("animationend", cb);
  return () => { mo.disconnect(); splash?.removeEventListener("animationend", cb); };
}
const readCurtain = () => document.documentElement.classList.contains("splash-done")
  || Boolean(document.getElementById("velmar-splash")?.getAnimations?.().some((a) => (a as CSSAnimation).animationName === "splash-curtain" && a.playState === "finished"));
const hotSalePct = themeCoupons.find((c) => c.themeId === "hot-sale")?.value ?? 30;

/** Una escena distinta por festividad (motion graphics). */
const SCENES: Record<SeasonId, ComponentType> = {
  navidad: ChristmasScene, halloween: HalloweenScene, "ano-nuevo": NewYearScene, "black-friday": BlackFridayScene,
  "hot-sale": () => <HotSaleScene discount={hotSalePct} />, "san-valentin": ValentineScene, "dia-de-la-madre": MothersScene,
  orgullo: PrideScene, "revolucion-de-mayo": MayoScene, "dia-de-la-bandera": BanderaScene, "dia-de-la-independencia": IndependenciaScene,
  pascuas: EasterScene, "dia-del-animal": AnimalScene, "dia-del-padre": FathersScene,
  "dia-del-amigo": FriendsScene, "dia-del-nino": KidsScene,
};

/**
 * Escena de temporada dentro de la pantalla de carga. El script del <head> ya marcó `data-season` (colores del
 * fondo sin parpadeo); esto suma la animación propia de cada fecha sobre las partículas de su fondo.
 */
export function ThemeSplashScene() {
  const id = useSyncExternalStore(noop, readSeason, () => null);
  // Se mide una sola vez, al montar la escena en el cliente (ver SceneClock).
  const [offset] = useState(splashElapsed);
  // Al caer el telón (o con "reducir movimiento") la escena se desmonta: sus animaciones en bucle no siguen
  // corriendo escondidas el resto de la visita.
  const done = useSyncExternalStore(subscribeCurtain, readCurtain, () => false);
  const reduce = useReducedMotion();
  if (!id || !SKINS[id] || done || reduce) return null;
  const Scene = SCENES[id];
  const name = seasonalThemes.find((t) => t.id === id)?.name ?? "";
  return (
    <SceneClock.Provider value={offset}>
      <div aria-hidden="true" className="season-scene">
        <AmbientField layers={AMBIENT[id]} density={1.2} className="absolute inset-0" />
        <Scene />
        <p className="season-tag eyebrow left-1/2 -translate-x-1/2 whitespace-nowrap">Especial {name}</p>
      </div>
    </SceneClock.Provider>
  );
}
