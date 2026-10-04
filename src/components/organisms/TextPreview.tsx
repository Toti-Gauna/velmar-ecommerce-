import type { ArtKey } from "@/demo/types";
import type { TextZone } from "@/demo/fixtures/templates";
import { ProductArt } from "@/components/illustrations/ProductArt";
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

/** Vista previa SVG del texto sobre la pieza. Se actualiza en cada tecla. */
export function TextPreview({ art, tint, text, fontFamily, color, zone, label, className }: TextPreviewProps) {
  const chars = Math.max(1, [...text].length);
  const fontSize = Math.min(zone.h * 0.82, (zone.w / chars) * 1.6);
  const cover = zone.cover === "tint" ? tint : zone.cover;
  return (
    <div className={cn("relative", className)}>
      <ProductArt art={art} tint={tint} label={label} className="aspect-square" />
      <svg viewBox="0 0 400 400" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full">
        {cover && <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} rx="8" fill={cover} />}
        <text
          x={zone.x + zone.w / 2}
          y={zone.y + zone.h / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={fontFamily}
          fontWeight={800}
          fontSize={fontSize}
          fill={color}
          stroke={color.toLowerCase() === "#ffffff" ? "#5b5e4f" : "none"}
          strokeWidth={color.toLowerCase() === "#ffffff" ? 0.8 : 0}
        >
          {text}
        </text>
      </svg>
    </div>
  );
}
