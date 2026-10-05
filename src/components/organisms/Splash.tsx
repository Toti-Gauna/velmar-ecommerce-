import type { CSSProperties } from "react";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { brand } from "@/config/brand";
import type { ArtKey } from "@/demo/types";
import { ThemeSplashScene } from "@/features/themes/ThemeSplashScene";

/** Piezas que orbitan el logo (ángulo en grados alrededor del centro). */
const PIECES: { art: ArtKey; angle: number; tint?: string }[] = [
  { art: "lamp-photo", angle: -90 },
  { art: "bowl-dog", angle: -18, tint: "#e88aa0" },
  { art: "nfc-tag", angle: 54 },
  { art: "candle-poodle", angle: 126 },
  { art: "collar", angle: 198 },
];

/** Polvo dorado: posición (%), retraso (ms) y tamaño (px), fijos para que el HTML sea siempre igual. */
const DUST: [number, number, number, number][] = Array.from({ length: 26 }, (_, i) => {
  const r = (k: number) => { const x = Math.sin((i + 1) * 12.9898 * k + 78.233) * 43758.5453; return x - Math.floor(x); };
  return [Math.round(r(1) * 100), Math.round(r(2) * 100), Math.round(400 + r(3) * 2600), Math.round(2 + r(4) * 3)];
});

/**
 * Pantalla de carga de marca en cada recarga (HTML + CSS; se ve aunque no haya JS). En 5 s: anillos dorados que se trazan, polvo de oro y rayos de luz; los chevrones
 * se trazan, aparece "Velmar", las piezas del taller entran en órbita una a una con brillo de vidrio, un destello recorre el nombre y
 * un telón la retira (sin barra de carga ni botón "Saltar", pedido de Ignacio). Durante una temática cambia de colores y suma su escena (ThemeSplashScene). Con "reducir movimiento" no se muestra.
 */
export function Splash() {
  return (
    <div id="velmar-splash" role="presentation">
      <div aria-hidden="true" className="splash-glow" />
      <div aria-hidden="true" className="splash-rays" />
      <svg aria-hidden="true" viewBox="0 0 200 200" className="splash-ring">
        <circle className="ring-a" cx="100" cy="100" r="92" />
        <circle className="ring-b" cx="100" cy="100" r="78" />
      </svg>
      <div aria-hidden="true" className="splash-dust">
        {DUST.map((d, i) => <span key={i} style={{ left: `${d[0]}%`, top: `${d[1]}%`, "--d": `${d[2]}ms`, "--s": `${d[3]}px` } as CSSProperties} />)}
      </div>
      <div aria-hidden="true" className="splash-orbit">
        {PIECES.map((p, i) => (
          <span key={p.art} className="splash-piece" style={{ "--a": `${p.angle}deg`, "--i": i } as CSSProperties}>
            <span className="splash-card"><span className="splash-gloss" /><ProductArt art={p.art} tint={p.tint} label="" showBadge={false} className="h-full w-full [&>svg]:h-full" /></span>
          </span>
        ))}
      </div>
      <ThemeSplashScene />
      <div aria-hidden="true" className="relative z-10 flex flex-col items-center">
        <svg viewBox="0 0 48 44" className="h-14 w-14 text-brass sm:h-16 sm:w-16">
          <path className="chev" d="M8 22 24 8l16 14" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path className="chev chev-2" d="M8 36 24 22l16 14" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="relative mt-4">
          <span className="word font-display block text-5xl text-[#f6f1e8] sm:text-7xl">{brand.name}</span>
          <span className="word-sheen font-display absolute inset-0 text-5xl sm:text-7xl">{brand.name}</span>
        </span>
      </div>
      <p aria-hidden="true" className="splash-city eyebrow">Objetos con alma · {brand.city}</p>
    </div>
  );
}

/** Cierra la pantalla de carga con Escape (si no hay JS, igual se va sola a los 5 s). */
export const splashScript = `(function(){function hide(){document.documentElement.classList.add("splash-done")}document.addEventListener("keydown",function(e){if(e.key==="Escape")hide()});setTimeout(hide,5200)})();`;
