import type { WheelSegment } from "@/demo/fixtures/wheel";

const FILLS = ["#1c2016", "#3a4527", "#ece2cf", "#b98b5c", "#262c1d", "#5d6b45", "#f6f1e8", "#d2ad69"];
const INK = ["#f6f1e8", "#f6f1e8", "#1c2016", "#1c2016", "#f6f1e8", "#f6f1e8", "#1c2016", "#1c2016"];

/** Disco de la ruleta (SVG puro). El giro lo aplica el contenedor. */
export function WheelDisc({ segments }: { segments: WheelSegment[] }) {
  const n = segments.length;
  const slice = 360 / n;
  const r = 200;
  const pt = (deg: number, radius: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [200 + radius * Math.cos(rad), 200 + radius * Math.sin(rad)] as const;
  };
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="wheel-shine" cx=".35" cy=".25" r=".8"><stop offset="0" stopColor="#fff" stopOpacity=".22" /><stop offset=".6" stopColor="#fff" stopOpacity="0" /></radialGradient>
      </defs>
      {segments.map((s, i) => {
        const [x1, y1] = pt(i * slice, r);
        const [x2, y2] = pt((i + 1) * slice, r);
        const mid = i * slice + slice / 2;
        const [tx, ty] = pt(mid, r * 0.6);
        const words = s.label.split(" ");
        const lines = words.length > 1 ? [words.slice(0, Math.ceil(words.length / 2)).join(" "), words.slice(Math.ceil(words.length / 2)).join(" ")] : [s.label];
        return (
          <g key={s.id} opacity={s.active ? 1 : 0.35}>
            <path d={`M200 200 L${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2} Z`} fill={FILLS[i % FILLS.length]} stroke="#d2ad69" strokeWidth="1.5" />
            <text x={tx} y={ty} fill={INK[i % INK.length]} fontSize="15" fontWeight="800" textAnchor="middle" dominantBaseline="central"
              transform={`rotate(${mid - 90} ${tx} ${ty})`} style={{ fontFamily: "var(--font-sans)" }}>
              {lines.map((line, k) => <tspan key={k} x={tx} dy={k === 0 ? (lines.length > 1 ? "-0.55em" : "0") : "1.1em"}>{line}</tspan>)}
            </text>
          </g>
        );
      })}
      <circle cx="200" cy="200" r="198" fill="url(#wheel-shine)" />
      {Array.from({ length: n * 2 }, (_, i) => { const [x, y] = pt(i * (slice / 2), 191); return <circle key={i} cx={x} cy={y} r="3.4" fill="#f6e7c4" />; })}
    </svg>
  );
}
