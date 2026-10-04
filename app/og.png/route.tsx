import { ImageResponse } from "next/og";
import { brand } from "@/config/brand";

export const dynamic = "force-static";
const size = { width: 1200, height: 630 };

/** Imagen Open Graph generada en build a partir de la config de marca → out/og.png */
export function GET() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: brand.colors.background, color: brand.colors.text }}>
        <svg width="140" height="128" viewBox="0 0 48 44">
          <path d="M8 22 24 8l16 14M8 36 24 22l16 14" fill="none" stroke={brand.colors.primary} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ fontSize: 96, fontWeight: 800, color: brand.colors.primary, marginTop: 24 }}>{brand.name}</div>
        <div style={{ fontSize: 40, marginTop: 12 }}>{brand.tagline}</div>
        <div style={{ fontSize: 28, marginTop: 28, color: brand.colors.muted }}>{`${brand.city} · Demo de tienda online`}</div>
      </div>
    ),
    size,
  );
}
