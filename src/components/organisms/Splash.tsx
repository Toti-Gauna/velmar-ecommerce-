import type { CSSProperties } from "react";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { brand } from "@/config/brand";
import type { ArtKey } from "@/demo/types";

/** Piezas que orbitan el logo (ángulo en grados alrededor del centro). */
const PIECES: { art: ArtKey; angle: number; tint?: string }[] = [
  { art: "lamp-photo", angle: -90 },
  { art: "bowl-dog", angle: -18, tint: "#e88aa0" },
  { art: "nfc-tag", angle: 54 },
  { art: "candle-poodle", angle: 126 },
  { art: "collar", angle: 198 },
];

/**
 * Pantalla de carga de marca en cada recarga (HTML + CSS; se ve aunque no haya JS). En 5 s: los chevrones
 * se trazan, aparece "Velmar", las piezas del taller entran en órbita una a una, una línea dorada marca el
 * avance y un telón la retira. Con "reducir movimiento" no se muestra.
 */
export function Splash() {
  return (
    <div id="velmar-splash" role="presentation">
      <div aria-hidden="true" className="splash-glow" />
      <div aria-hidden="true" className="splash-orbit">
        {PIECES.map((p, i) => (
          <span key={p.art} className="splash-piece" style={{ "--a": `${p.angle}deg`, "--i": i } as CSSProperties}>
            <span className="splash-card"><ProductArt art={p.art} tint={p.tint} label="" showBadge={false} className="h-full w-full [&>svg]:h-full" /></span>
          </span>
        ))}
      </div>
      <div aria-hidden="true" className="relative z-10 flex flex-col items-center">
        <svg viewBox="0 0 48 44" className="h-14 w-14 text-brass sm:h-16 sm:w-16">
          <path className="chev" d="M8 22 24 8l16 14" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path className="chev chev-2" d="M8 36 24 22l16 14" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="word font-display mt-4 text-5xl text-[#f6f1e8] sm:text-7xl">{brand.name}</span>
      </div>
      <div aria-hidden="true" className="splash-progress"><span /></div>
      <p aria-hidden="true" className="splash-city eyebrow">Objetos con alma · {brand.city}</p>
    </div>
  );
}

/** Cierra la pantalla de carga con "Saltar" o Escape (si no hay JS, igual se va sola a los 5 s). */
export const splashScript = `(function(){function hide(){document.documentElement.classList.add("splash-done")}document.addEventListener("click",function(e){if(e.target&&e.target.closest&&e.target.closest("#velmar-splash-skip"))hide()});document.addEventListener("keydown",function(e){if(e.key==="Escape")hide()});setTimeout(hide,5200)})();`;
