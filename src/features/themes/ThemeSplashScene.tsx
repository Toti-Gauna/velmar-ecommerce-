"use client";
import type { CSSProperties } from "react";
import { useSyncExternalStore } from "react";
import { Decor } from "@/components/illustrations/seasonal/Decor";
import { Moon, SantaSleigh, WitchOnBroom } from "@/components/illustrations/seasonal/scenes";
import { seasonalThemes } from "@/demo/fixtures/themes";
import type { SeasonId } from "@/demo/types";
import { AMBIENT } from "./ambient";
import { AmbientField } from "./AmbientField";
import { SKINS } from "./skins";

const noop = () => () => {};
const readSeason = () => (document.documentElement.dataset.season as SeasonId | undefined) ?? null;

/**
 * Escena de temporada dentro de la pantalla de carga. El script del <head> ya marcó `data-season` (colores del
 * fondo sin parpadeo); esto suma la animación: Papá Noel cruzando la luna, la bruja en Halloween, fuegos en Año Nuevo…
 */
export function ThemeSplashScene() {
  const id = useSyncExternalStore(noop, readSeason, () => null);
  if (!id || !SKINS[id]) return null;
  const skin = SKINS[id];
  const name = seasonalThemes.find((t) => t.id === id)?.name ?? "";
  return (
    <div aria-hidden="true" className="season-scene">
      <AmbientField layers={AMBIENT[id]} density={1.5} className="absolute inset-0" />
      {id === "navidad" ? <Christmas /> : id === "halloween" ? <Halloween /> : id === "ano-nuevo" ? <NewYear /> : (
        <div className="splash-orbit">
          {skin.decor.map((kind, i) => (
            <span key={`${kind}-${i}`} className="splash-piece" style={{ "--a": `${-90 + i * 72}deg`, "--i": i } as CSSProperties}>
              <span className="scene-pop block h-full w-full" style={{ animationDelay: `${900 + i * 220}ms, ${1700 + i * 220}ms` }}>
                <Decor kind={kind} className="h-full w-full drop-shadow-[0_18px_24px_rgb(0_0_0/0.45)]" />
              </span>
            </span>
          ))}
        </div>
      )}
      <p className="season-tag eyebrow left-1/2 -translate-x-1/2 whitespace-nowrap">Especial {name}</p>
    </div>
  );
}

function Christmas() {
  return (
    <>
      <span className="scene-moon right-[8%] top-[10%] h-[30vmin] w-[30vmin]"><Moon className="h-full w-full" tint="#f3efd9" /></span>
      <span className="scene-cross left-0 top-[16%] w-[min(60vmin,420px)]"><SantaSleigh className="w-full" color="#0a1912" /></span>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-[4%]">
        {[0.9, 1.3, 0.8, 1.1, 0.7, 1.2].map((s, i) => (
          <span key={i} className="scene-pop" style={{ position: "relative", width: `${s * 11}vmin`, height: `${s * 11}vmin`, animationDelay: `${400 + i * 120}ms, ${1500 + i * 120}ms` }}>
            <Decor kind="tree" className="h-full w-full opacity-90" />
          </span>
        ))}
      </div>
    </>
  );
}

function Halloween() {
  return (
    <>
      <span className="scene-moon left-1/2 top-[15%] h-[36vmin] w-[38vmin] -translate-x-1/2 [filter:drop-shadow(0_0_40px_rgb(255_170_70/0.55))]"><Moon className="h-full w-full" tint="#ffb04d" /></span>
      <span className="scene-cross left-0 top-[14%] w-[min(44vmin,300px)]"><WitchOnBroom className="w-full" /></span>
      <div className="scene-fog" />
      <span className="scene-pop bottom-[5%] left-[6%] h-[16vmin] w-[16vmin]" style={{ animationDelay: "700ms, 1600ms" }}><Decor kind="pumpkin" className="scene-glow h-full w-full" /></span>
      <span className="scene-pop bottom-[4%] right-[7%] h-[20vmin] w-[20vmin]" style={{ animationDelay: "900ms, 1800ms" }}><Decor kind="pumpkin" className="scene-glow h-full w-full" /></span>
      <span className="scene-pop bottom-[8%] right-[30%] h-[10vmin] w-[10vmin]" style={{ animationDelay: "1100ms, 2000ms" }}><Decor kind="ghost" className="h-full w-full opacity-80" /></span>
    </>
  );
}

function NewYear() {
  const bursts = [["14%", "12%", 26, 500], ["70%", "8%", 32, 1100], ["30%", "56%", 22, 1700], ["78%", "52%", 28, 2300], ["50%", "18%", 20, 2900]] as const;
  return (
    <>
      {bursts.map(([left, top, size, delay]) => (
        <span key={`${left}${top}`} className="scene-burst" style={{ left, top, width: `${size}vmin`, height: `${size}vmin`, animationDelay: `${delay}ms` }}>
          <Decor kind="firework" className="h-full w-full" />
        </span>
      ))}
      <span className="scene-pop bottom-[6%] h-[18vmin] w-[18vmin]" style={{ left: "calc(50% - 9vmin)", animationDelay: "800ms, 1700ms" }}><Decor kind="champagne" className="h-full w-full" /></span>
    </>
  );
}
