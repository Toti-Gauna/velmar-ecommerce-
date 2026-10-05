import type { CSSProperties } from "react";
import { rand } from "../AmbientField";

/** Efectos de luz del fondo de cada temática (CSS puro, solo transform/opacity; ver seasons.css). */
const v = (o: Record<string, string | number>) => o as CSSProperties;

/** Luces desenfocadas que respiran (bokeh): luces de Navidad, globos, corazones. */
export function Bokeh({ colors, count = 12, size = [10, 26] }: { colors: string[]; count?: number; size?: [number, number] }) {
  return (
    <div className="fx-layer">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="fx-bokeh" style={v({ left: `${rand(i + 11) * 100}%`, top: `${rand(i + 23) * 100}%`, "--z": `${size[0] + rand(i) * (size[1] - size[0])}vmin`, "--c": colors[i % colors.length]!, animationDuration: `${6 + rand(i + 5) * 6}s`, animationDelay: `${-rand(i + 7) * 8}s` })} />
      ))}
    </div>
  );
}

/** Haces de luz diagonales que barren la página (Black Friday). */
export function LightSweeps({ color }: { color: string }) {
  return (
    <div className="fx-layer">
      {[0, 1, 2].map((i) => <span key={i} className="fx-sweep" style={v({ "--c": color, animationDelay: `${-i * 5}s`, top: `${-20 + i * 30}%` })} />)}
    </div>
  );
}

/** Bancos de niebla que se desplazan (Halloween). */
export function Fog({ color }: { color: string }) {
  return (
    <div className="fx-layer">
      {[0, 1, 2].map((i) => <span key={i} className="fx-fog" style={v({ "--c": color, top: `${20 + i * 28}%`, animationDuration: `${26 + i * 8}s`, animationDelay: `${-i * 7}s` })} />)}
    </div>
  );
}

/** Resplandor de calor que late desde abajo (Hot Sale). */
export function HeatGlow({ color }: { color: string }) {
  return <div className="fx-layer"><span className="fx-heat" style={v({ "--c": color })} /><span className="fx-heat fx-heat-2" style={v({ "--c": color })} /></div>;
}

/** Arcoíris enorme y translúcido que brilla (San Patricio). */
export function Rainbow() {
  const bands = ["#e5544a", "#f39a3c", "#f6c84c", "#4fb36a", "#4fa3e0", "#8a6fd6"];
  return (
    <div className="fx-layer">
      <svg viewBox="0 0 200 110" className="fx-rainbow" aria-hidden="true">
        {bands.map((c, i) => <path key={c} d={`M${10 + i * 5} 108 A${90 - i * 5} ${90 - i * 5} 0 0 1 ${190 - i * 5} 108`} fill="none" stroke={c} strokeWidth="4.6" strokeLinecap="round" />)}
      </svg>
    </div>
  );
}
