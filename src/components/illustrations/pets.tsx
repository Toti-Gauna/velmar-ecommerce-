import { shade } from "@/lib/color";

/** Ilustraciones vectoriales propias (placeholders). viewBox 0 0 400 400. */
/** Un globo del perro: forma con volumen (sombra abajo y brillo arriba), así se lee como globo inflado y brillante. */
function Balloon({ cx, cy, rx, ry, rot = 0, tint, back }: { cx: number; cy: number; rx: number; ry: number; rot?: number; tint: string; back?: boolean }) {
  return (
    <g transform={`rotate(${rot} ${cx} ${cy})`}>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={back ? shade(tint, -0.16) : tint} />
      <ellipse cx={cx + rx * 0.12} cy={cy + ry * 0.3} rx={rx * 0.82} ry={ry * 0.6} fill="#1c2016" opacity=".1" />
      <ellipse cx={cx - rx * 0.32} cy={cy - ry * 0.46} rx={rx * 0.42} ry={Math.max(3, ry * 0.2)} fill="#fff" opacity=".42" />
      <ellipse cx={cx - rx * 0.46} cy={cy - ry * 0.5} rx={Math.max(2, rx * 0.1)} ry={Math.max(1.6, ry * 0.08)} fill="#fff" opacity=".9" />
    </g>
  );
}

/**
 * Comedero perro globo (8.4.23): el perro de globos impreso en 3D, brillante, parado en sus cuatro patas, con el plato
 * en el lomo. El frente del cuerpo queda libre para el nombre en relieve (zona "bowl-dog").
 */
export function BowlDog({ tint = "#e88aa0" }: { tint?: string }) {
  const knot = shade(tint, -0.32);
  return (
    <g>
      {/* Patas de atrás (más oscuras: quedan del otro lado) y de adelante */}
      <Balloon cx={276} cy={292} rx={14} ry={32} rot={4} tint={tint} back />
      <Balloon cx={146} cy={290} rx={14} ry={32} rot={-4} tint={tint} back />
      <Balloon cx={298} cy={296} rx={15} ry={33} rot={-3} tint={tint} />
      <Balloon cx={170} cy={296} rx={15} ry={33} rot={3} tint={tint} />
      {/* Cola */}
      <Balloon cx={330} cy={188} rx={12} ry={28} rot={24} tint={tint} />
      <circle cx={341} cy={161} r={9} fill={tint} /><circle cx={338} cy={158} r={3} fill="#fff" opacity=".7" />
      {/* Cuerpo con el plato en el lomo */}
      <Balloon cx={226} cy={242} rx={104} ry={44} tint={tint} />
      <ellipse cx={232} cy={212} rx={72} ry={17} fill={shade(tint, -0.22)} />
      <ellipse cx={232} cy={214} rx={62} ry={12} fill="#8a5a35" />
      {[[210, 212, 5], [236, 216, 4.5], [256, 210, 4], [222, 218, 3.5]].map(([x, y, r]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#6b4425" />)}
      <path d="M162 214c20-6 44-8 70-8" stroke="#fff" strokeOpacity=".35" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Cuello, cabeza, hocico y orejas */}
      <Balloon cx={134} cy={196} rx={15} ry={32} rot={-24} tint={tint} />
      <Balloon cx={152} cy={110} rx={12} ry={26} rot={16} tint={tint} back />
      <Balloon cx={126} cy={108} rx={12} ry={27} rot={-14} tint={tint} />
      <circle cx={124} cy={150} r={25} fill={tint} />
      <ellipse cx={116} cy={140} rx={10} ry={5} fill="#fff" opacity=".42" />
      <Balloon cx={82} cy={160} rx={34} ry={17} rot={-12} tint={tint} />
      <circle cx={50} cy={167} r={5} fill={knot} />
      {/* Nudos de los globos */}
      {[[147, 222], [124, 172], [318, 210], [172, 266], [296, 266]].map(([x, y]) => <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={5} ry={3.5} fill={knot} />)}
    </g>
  );
}

export function BowlWood({ tint = "#d8b98c", blank }: { tint?: string; blank?: boolean }) {
  const dark = shade(tint, -0.25);
  return (
    <g>
      {[[74, 186], [74, 228], [326, 186], [326, 228]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="24" fill={tint} />)}
      <rect x="70" y="190" width="260" height="46" rx="12" fill={tint} />
      <rect x="86" y="236" width="22" height="80" rx="6" fill={dark} /><rect x="292" y="236" width="22" height="80" rx="6" fill={dark} />
      <path d="M100 198h200" stroke={shade(tint, -0.1)} strokeWidth="4" />
      {[140, 260].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy="190" rx="50" ry="16" fill="#b8bec4" />
          <ellipse cx={cx} cy="190" rx="40" ry="11" fill="#e4e8eb" />
        </g>
      ))}
      {!blank && <text x="200" y="224" textAnchor="middle" fontSize="18" fontWeight="700" fill={dark} fontFamily="Georgia, serif">TOBY</text>}
    </g>
  );
}

export function Collar({ tint = "#3d4a2a" }: { tint?: string }) {
  return (
    <g>
      <ellipse cx="200" cy="200" rx="130" ry="96" fill="none" stroke="#f2c94c" strokeWidth="22" />
      <ellipse cx="200" cy="200" rx="130" ry="96" fill="none" stroke="#6fb7e0" strokeWidth="22" strokeDasharray="9 9" />
      <ellipse cx="200" cy="200" rx="130" ry="96" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="3" strokeDasharray="4 14" />
      <rect x="114" y="270" width="172" height="44" rx="14" fill="#fff" stroke="#e4dccb" strokeWidth="3" />
      <text x="200" y="302" textAnchor="middle" fontSize="28" fontWeight="800" fill={tint} fontFamily="ui-rounded, system-ui">LOLA</text>
      {[88, 312].map((x) => (
        <g key={x} transform={`translate(${x} 258)`} fill={tint}>
          <ellipse cx="0" cy="8" rx="11" ry="9" /><circle cx="-10" cy="-6" r="5" /><circle cx="0" cy="-10" r="5" /><circle cx="10" cy="-6" r="5" />
        </g>
      ))}
    </g>
  );
}

export function LeashHanger({ tint = "#d8b98c" }: { tint?: string }) {
  return (
    <g>
      <rect x="60" y="150" width="280" height="70" rx="10" fill={tint} />
      {[90, 130, 170, 210, 250, 290].map((x) => <path key={x} d={`M${x} 156v58`} stroke={shade(tint, -0.15)} strokeWidth="3" />)}
      <path d="M150 150c0-30 10-46 30-52l10-20 10 18c22 2 34 16 40 34l18 4-6 16Z" fill={shade(tint, -0.45)} />
      {[120, 200, 280].map((x) => <path key={x} d={`M${x} 220v26a14 14 0 0 0 28 0`} stroke="#555" strokeWidth="7" fill="none" strokeLinecap="round" />)}
      <path d="M228 262c-6 40-30 70-60 80" stroke="#c0503f" strokeWidth="10" fill="none" strokeLinecap="round" />
    </g>
  );
}
