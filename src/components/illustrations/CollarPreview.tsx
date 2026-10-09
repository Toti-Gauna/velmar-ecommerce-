import type { CollarCharm, CollarConfig } from "@/demo/fixtures/collar";
import { collarPieces } from "@/demo/engine/collar";
import { cn } from "@/lib/cn";

/**
 * Vista previa en vivo del collar (ilustrativa): cordón según el material y el color, el nombre en letras sueltas
 * que cuelgan, de corrido en una pieza o en una chapita hueso, dije y hebilla. Las letras se balancean (sin
 * movimiento si el sistema pide reducirlo: la regla global de motion apaga las animaciones).
 */

// Curva del cordón (bezier cúbica): de la hebilla izquierda a la derecha, con caída al centro.
const P = [[42, 58], [60, 246], [340, 246], [358, 58]] as const;

function at(t: number): [number, number] {
  const u = 1 - t;
  const x = u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0];
  const y = u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1];
  return [x, y];
}

/** Tabla de longitud de arco para repartir las letras a la misma distancia sobre la curva. */
const TABLE = (() => {
  const out: { t: number; len: number }[] = [{ t: 0, len: 0 }];
  let [px, py] = at(0);
  for (let i = 1; i <= 200; i++) {
    const t = i / 200;
    const [x, y] = at(t);
    out.push({ t, len: out[i - 1]!.len + Math.hypot(x - px, y - py) });
    px = x; py = y;
  }
  return out;
})();
const TOTAL = TABLE.at(-1)!.len;

function tAtLength(len: number): number {
  const target = Math.min(Math.max(len, 0), TOTAL);
  const i = TABLE.findIndex((p) => p.len >= target);
  if (i <= 0) return 0;
  const a = TABLE[i - 1]!, b = TABLE[i]!;
  return a.t + ((target - a.len) / (b.len - a.len)) * (b.t - a.t);
}

const PATH = `M${P[0].join(" ")} C${P[1].join(" ")} ${P[2].join(" ")} ${P[3].join(" ")}`;

function shade(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const ch = (s: number) => Math.max(0, Math.min(255, Math.round(((n >> s) & 255) * (1 + amount))));
  return `#${[16, 8, 0].map((s) => ch(s).toString(16).padStart(2, "0")).join("")}`;
}

function isLight(hex: string): boolean {
  const n = parseInt(hex.replace("#", ""), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 165;
}

function Charm({ kind, x, y, uid }: { kind: CollarCharm; x: number; y: number; uid: string }) {
  if (kind === "none") return null;
  const metal = `url(#${uid}-metal)`;
  return (
    <g className="collar-swing" style={{ transformOrigin: `${x}px ${y}px`, transformBox: "view-box", animationDelay: "-0.6s" }}>
      <line x1={x} y1={y + 4} x2={x} y2={y + 12} stroke="#b9b4a8" strokeWidth="2" />
      <circle cx={x} cy={y + 15} r="4" fill="none" stroke="#b9b4a8" strokeWidth="2" />
      <g transform={`translate(${x} ${y + 36})`}>
        {kind === "paw" && (
          <g fill={metal} stroke="#7a5a26" strokeWidth="1">
            <ellipse cx="0" cy="6" rx="10" ry="8.5" />
            <ellipse cx="-11" cy="-5" rx="4.2" ry="5.4" /><ellipse cx="-4" cy="-11" rx="4.2" ry="5.4" />
            <ellipse cx="4" cy="-11" rx="4.2" ry="5.4" /><ellipse cx="11" cy="-5" rx="4.2" ry="5.4" />
          </g>
        )}
        {kind === "bone" && <path d="M-14 -5a5 5 0 1 1 5-5h18a5 5 0 1 1 5 5v10a5 5 0 1 1-5 5h-18a5 5 0 1 1-5-5z" fill={metal} stroke="#7a5a26" strokeWidth="1" />}
        {kind === "heart" && <path d="M0 14C-16 3-15-10-7-11c4-.5 6 2 7 4 1-2 3-4.5 7-4 8 1 9 14-7 25z" fill={metal} stroke="#7a5a26" strokeWidth="1" />}
        {kind === "phone" && (
          <g>
            <circle r="15" fill={metal} stroke="#7a5a26" strokeWidth="1" />
            <path d="M-5 -6c0 8 3 11 11 11l2-3-3-2-2 1c-2-1-3-2-4-4l1-2-2-3z" fill="#4a3a1a" />
          </g>
        )}
      </g>
    </g>
  );
}

interface Props {
  text: string;
  font: string;
  letterColor: string;
  config: CollarConfig;
  className?: string;
  label?: string;
  /** Miniatura (carrito, galería): sin rótulo ni sombra grande. */
  compact?: boolean;
}

export function CollarPreview({ text, font, letterColor, config, className, label, compact = false }: Props) {
  const uid = `collar-${(config.format + config.material + config.charm + config.cordColor + text).replace(/[^a-z0-9]/gi, "").slice(0, 24) || "x"}`;
  const pieces = collarPieces(text || "Tu nombre", config);
  const cord = config.cordColor;
  const dark = shade(cord, -0.35);
  const light = shade(cord, 0.35);
  const ink = shade(letterColor, isLight(letterColor) ? -0.45 : -0.6);
  const mid = TOTAL / 2;

  // Letras sueltas repartidas sobre la curva, centradas en la caída del cordón.
  const spacing = Math.min(32, 220 / Math.max(pieces.length, 1));
  const letters = config.format === "letters" ? pieces.map((ch, i) => {
    const [x, y] = at(tAtLength(mid + (i - (pieces.length - 1) / 2) * spacing));
    return { ch, x, y };
  }) : [];
  const right = letters.length ? letters.at(-1)! : null;
  const [cx, cy] = at(0.5);
  const charmAt = config.format === "letters" && right ? at(tAtLength(mid + ((pieces.length - 1) / 2 + 1.1) * spacing)) : at(tAtLength(mid + 92));
  const name = (text || "Tu nombre").trim();
  const plateW = Math.min(250, Math.max(110, [...name].length * 22 + 36));

  return (
    <div className={cn("relative overflow-hidden", !compact && "rounded-[1.5rem] bg-[radial-gradient(120%_90%_at_50%_0%,#fffaf1,#efe6d4)]", className)}>
      <svg viewBox="0 18 400 290" role="img" aria-label={label ?? `Vista previa del collar ${name}`} className="h-full w-full">
        <defs>
          <linearGradient id={`${uid}-metal`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f6e2b0" /><stop offset=".5" stopColor="#d2ad69" /><stop offset="1" stopColor="#9a7434" /></linearGradient>
          <linearGradient id={`${uid}-buckle`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a4d50" /><stop offset="1" stopColor="#1e2022" /></linearGradient>
          <filter id={`${uid}-drop`} x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="2.4" floodColor="#1c2016" floodOpacity=".28" /></filter>
        </defs>
        {!compact && <ellipse cx="200" cy="292" rx="150" ry="9" fill="#1c2016" opacity=".07" />}

        {/* Cordón según el material */}
        <g filter={`url(#${uid}-drop)`}>
          <path d={PATH} fill="none" stroke={dark} strokeWidth={config.material === "nylon" ? 20 : 18} strokeLinecap="round" />
          <path d={PATH} fill="none" stroke={cord} strokeWidth={config.material === "nylon" ? 17 : 15} strokeLinecap="round" />
          {config.material === "paracord" && (
            <>
              <path d={PATH} fill="none" stroke={dark} strokeOpacity=".55" strokeWidth="13" strokeDasharray="3.2 4.2" />
              <path d={PATH} fill="none" stroke={light} strokeOpacity=".6" strokeWidth="5" strokeDasharray="3.2 4.2" strokeDashoffset="3.6" transform="translate(0 -3)" />
            </>
          )}
          {config.material === "biothane" && <path d={PATH} fill="none" stroke="#fff" strokeOpacity=".38" strokeWidth="3" transform="translate(0 -4)" />}
          {config.material === "nylon" && (
            <>
              <path d={PATH} fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.2" strokeDasharray="4 3" transform="translate(0 -6)" />
              <path d={PATH} fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.2" strokeDasharray="4 3" transform="translate(0 6)" />
            </>
          )}
        </g>
        {/* Hebilla de clic y argolla */}
        <g transform={`translate(${P[3][0] - 8} ${P[3][1] - 16})`}>
          <rect width="30" height="32" rx="7" fill={`url(#${uid}-buckle)`} />
          <rect x="6" y="9" width="18" height="14" rx="3" fill="#0f1011" opacity=".55" />
        </g>
        <rect x={P[0][0] - 12} y={P[0][1] - 14} width="22" height="28" rx="6" fill={`url(#${uid}-buckle)`} />

        {/* Nombre */}
        {letters.map(({ ch, x, y }, i) => (
          <g key={`${ch}-${i}`} className="collar-swing" style={{ transformOrigin: `${x}px ${y}px`, transformBox: "view-box", animationDelay: `${-i * 0.37}s` }}>
            <line x1={x} y1={y + 4} x2={x} y2={y + 12} stroke="#b9b4a8" strokeWidth="2" />
            <circle cx={x} cy={y + 15} r="3.6" fill="none" stroke="#b9b4a8" strokeWidth="2" />
            <text x={x} y={y + 50} textAnchor="middle" fontSize="32" fontWeight="800" fill={letterColor} stroke={ink} strokeWidth="2.6" paintOrder="stroke"
              style={{ fontFamily: font }} filter={`url(#${uid}-drop)`}>{ch}</text>
          </g>
        ))}
        {config.format === "joined" && (
          <g className="collar-swing" style={{ transformOrigin: `${cx}px ${cy}px`, transformBox: "view-box" }} filter={`url(#${uid}-drop)`}>
            <circle cx={cx - plateW / 2 + 22} cy={cy + 12} r="4" fill="none" stroke="#b9b4a8" strokeWidth="2" />
            <circle cx={cx + plateW / 2 - 22} cy={cy + 12} r="4" fill="none" stroke="#b9b4a8" strokeWidth="2" />
            <rect x={cx - plateW / 2} y={cy + 16} width={plateW} height="48" rx="24" fill={letterColor} stroke={ink} strokeWidth="2" />
            <text x={cx} y={cy + 50} textAnchor="middle" fontSize="27" fontWeight="800" fill={isLight(letterColor) ? "#1c2016" : "#fffaf0"} style={{ fontFamily: font }}>{name}</text>
          </g>
        )}
        {config.format === "tag" && (
          <g className="collar-swing" style={{ transformOrigin: `${cx}px ${cy}px`, transformBox: "view-box" }} filter={`url(#${uid}-drop)`}>
            <circle cx={cx} cy={cy + 14} r="5" fill="none" stroke="#b9b4a8" strokeWidth="2.2" />
            <path transform={`translate(${cx} ${cy + 56})`} d="M-62 -14a13 13 0 1 1 13-13h98a13 13 0 1 1 13 13v28a13 13 0 1 1-13 13h-98a13 13 0 1 1-13-13z" fill="#fbf6ea" stroke="#cdbf9f" strokeWidth="2" />
            <text x={cx} y={cy + 57} textAnchor="middle" fontSize="23" fontWeight="800" fill={isLight(letterColor) ? "#3d4a2a" : letterColor} style={{ fontFamily: font }}>{name}</text>
            <text x={cx} y={cy + 74} textAnchor="middle" fontSize="11" fontWeight="700" fill="#8a8170">Tel. 223 ··· ····</text>
          </g>
        )}
        <Charm kind={config.charm} x={charmAt[0]} y={charmAt[1]} uid={uid} />
      </svg>
      {!compact && <span className="absolute bottom-3 left-3 rounded-full bg-white/85 px-2.5 py-0.5 text-[11px] font-semibold text-[#4f5545]">Vista previa ilustrativa</span>}
    </div>
  );
}
