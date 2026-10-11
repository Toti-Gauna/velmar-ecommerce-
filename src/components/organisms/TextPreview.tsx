import { useId } from "react";
import type { ArtKey } from "@/demo/types";
import { TEXT_FINISH, type TextFinish, type TextZone } from "@/demo/fixtures/templates";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { shade } from "@/lib/color";
import { cn } from "@/lib/cn";

interface TextPreviewProps {
  art: ArtKey;
  tint?: string;
  text: string;
  fontFamily: string;
  color: string;
  zone: TextZone;
  label: string;
  className?: string;
}

/**
 * Vista previa SVG del texto sobre la pieza; se actualiza en cada tecla. 8.4.1: el nombre se dibuja como parte del
 * producto (grabado hundido en la madera o letras impresas en relieve, siguiendo la curva del frente), igual de
 * cuidado que las letras del collar; ya no va sobre un cartel blanco. Las piezas sin acabado propio (las que sume el
 * panel) siguen con su zona y, si la tiene, su color de fondo.
 */
export function TextPreview({ art, tint, text, fontFamily, color, zone, label, className }: TextPreviewProps) {
  const id = useId().replace(/:/g, "");
  const look = TEXT_FINISH[art];
  const chars = Math.max(1, [...text].length);
  const fontSize = Math.min(zone.h * 0.86, (zone.w / chars) * 1.6);
  const cover = look ? undefined : zone.cover === "tint" ? tint : zone.cover;
  const ground = cover ?? tint;
  return (
    <div className={cn("relative", className)}>
      <ProductArt art={art} tint={tint} label={label} blank={Boolean(look)} className="aspect-square" />
      <svg viewBox="0 0 400 400" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full">
        {cover && <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} rx="8" fill={cover} />}
        <NameMark id={id} text={text} zone={zone} fontFamily={fontFamily} fontSize={fontSize} color={color} ground={ground} finish={look?.finish ?? "raised"} curve={look?.curve ?? 0} />
      </svg>
    </div>
  );
}

interface MarkProps { id: string; text: string; zone: TextZone; fontFamily: string; fontSize: number; color: string; ground?: string; finish: TextFinish; curve: number }

/** El texto en sí: sobre una línea recta o sobre el arco del frente de la pieza. */
function NameMark({ id, text, zone, fontFamily, fontSize, color, ground, finish, curve }: MarkProps) {
  const cx = zone.x + zone.w / 2, cy = zone.y + zone.h / 2;
  // Arco que baja `curve` en el centro (el frente redondo de un cuenco visto apenas desde arriba).
  const path = `M${zone.x - 12} ${cy} Q${cx} ${cy + curve * 2} ${zone.x + zone.w + 12} ${cy}`;
  const glyph = (extra: { fill: string; dy?: number; opacity?: number; filter?: string; stroke?: string; strokeWidth?: number }) => {
    const common = { fontFamily, fontSize, fontWeight: finish === "engraved" ? 700 : 800, fill: extra.fill, opacity: extra.opacity, filter: extra.filter, stroke: extra.stroke ?? "none", strokeWidth: extra.strokeWidth ?? 0, paintOrder: "stroke" as const, letterSpacing: finish === "engraved" ? fontSize * 0.02 : 0 };
    return curve ? (
      <text {...common} transform={extra.dy ? `translate(0 ${extra.dy})` : undefined} dominantBaseline="central">
        <textPath href={`#${id}-arc`} startOffset="50%" textAnchor="middle">{text}</textPath>
      </text>
    ) : (
      <text {...common} x={cx} y={cy + (extra.dy ?? 0)} textAnchor="middle" dominantBaseline="central">{text}</text>
    );
  };
  if (finish === "engraved") {
    // Láser sobre madera o cera: un surco quemado. Arriba, el borde del corte en sombra; abajo, el labio que toma luz.
    const burn = shade(color, -0.15);
    return (
      <g data-finish="engraved">
        <defs>
          <path id={`${id}-arc`} d={path} />
          <filter id={`${id}-soft`} x="-10%" y="-40%" width="120%" height="180%"><feGaussianBlur stdDeviation="0.45" /></filter>
        </defs>
        {glyph({ fill: "#fff6e6", dy: 1.3, opacity: 0.42 })}
        {glyph({ fill: shade(burn, -0.35), dy: -0.7, opacity: 0.7, filter: `url(#${id}-soft)` })}
        {glyph({ fill: burn, opacity: 0.92 })}
      </g>
    );
  }
  // Impreso en 3D: la letra se levanta de la pieza (canto más oscuro debajo), con brillo arriba y sombra suave.
  const edge = shade(color, -0.38);
  const lowContrast = ground ? Math.abs(lum(color) - lum(ground)) < 0.18 : false;
  return (
    <g data-finish="raised">
      <defs>
        <path id={`${id}-arc`} d={path} />
        <linearGradient id={`${id}-gloss`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" /><stop offset=".5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-drop`} x="-10%" y="-40%" width="120%" height="180%"><feGaussianBlur stdDeviation="1.6" /></filter>
      </defs>
      {glyph({ fill: "#1c2016", dy: 4, opacity: 0.28, filter: `url(#${id}-drop)` })}
      {[2.6, 1.8, 1].map((dy) => <g key={dy}>{glyph({ fill: edge, dy })}</g>)}
      {glyph({ fill: color, stroke: lowContrast ? edge : undefined, strokeWidth: lowContrast ? Math.max(1, fontSize * 0.05) : 0 })}
      {glyph({ fill: `url(#${id}-gloss)` })}
    </g>
  );
}

function lum(hex: string): number {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return 0.5;
  const n = parseInt(hex.slice(1), 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
}
