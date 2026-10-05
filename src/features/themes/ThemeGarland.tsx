"use client";
import { skinOf } from "./skins";
import { useCurrentTheme } from "./useCurrentTheme";
import type { SeasonId } from "@/demo/types";

/** Guirnalda que cuelga debajo del header: luces en las fiestas de fin de año, banderines en el resto. */
const LIGHTS: SeasonId[] = ["navidad", "ano-nuevo", "black-friday", "hot-sale", "halloween"];
const W = 1200, H = 34, N = 24;

export function ThemeGarland() {
  const { theme } = useCurrentTheme();
  if (!theme) return null;
  const skin = skinOf(theme.id);
  const colors = theme.id === "navidad" ? ["#e5544a", "#f3c84c", "#4fb36a", "#8fd3ff"] : theme.id === "halloween" ? ["#ff8a1f", "#a77be0", "#ffd34d"] : [skin.accent, skin.to, "#ffffff", skin.from];
  const lights = LIGHTS.includes(theme.id);
  const y = (x: number) => 6 + Math.sin((x / W) * Math.PI * 6 - Math.PI / 2) * -5 + 5;
  const wire = Array.from({ length: 121 }, (_, i) => `${i === 0 ? "M" : "L"}${(i / 120) * W} ${y((i / 120) * W).toFixed(2)}`).join("");
  return (
    <div aria-hidden="true" className="garland pointer-events-none absolute inset-x-0 z-30 h-[34px] overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMin slice" className="h-full w-full">
        <path d={wire} fill="none" stroke={theme.id === "navidad" ? "#1f5c3f" : skin.from} strokeWidth="1.6" opacity=".7" vectorEffect="non-scaling-stroke" />
        {Array.from({ length: N }, (_, i) => {
          const x = ((i + 0.5) / N) * W;
          const c = colors[i % colors.length]!;
          return lights ? (
            <g key={i} transform={`translate(${x} ${y(x)})`}>
              <rect x="-2" y="0" width="4" height="4" rx="1" fill="#3a3f47" />
              <ellipse cx="0" cy="10" rx="4" ry="6.5" fill={c} className="garland-bulb" style={{ color: c, animationDelay: `${(i % 6) * 0.35}s` }} />
            </g>
          ) : (
            <path key={i} d={`M${x - 14} ${y(x - 14)} L${x + 14} ${y(x + 14)} L${x} ${y(x) + 22} Z`} fill={c} opacity=".92" />
          );
        })}
      </svg>
    </div>
  );
}
