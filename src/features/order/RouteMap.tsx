"use client";
import { motion } from "motion/react";
import { Home, Store } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const PATH = "M40 150 C 120 40, 210 190, 300 100 S 470 30, 560 90";

/** Ruta ilustrada del taller a tu casa: la línea avanza según la etapa (0 a 1). Sin mapas externos. */
export function RouteMap({ progress }: { progress: number }) {
  const ref = useRef<SVGPathElement>(null);
  const [dot, setDot] = useState({ x: 40, y: 150 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const p = el.getPointAtLength(el.getTotalLength() * progress);
    setDot({ x: p.x, y: p.y });
  }, [progress]);
  return (
    <div className="relative overflow-hidden rounded-3xl bg-night-2" role="img" aria-label={`Recorrido del pedido: ${Math.round(progress * 100)}% del camino entre el taller y tu casa (ilustrativo)`}>
      <svg viewBox="0 0 600 190" className="block w-full" aria-hidden="true">
        <defs><pattern id="route-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#fff" strokeOpacity=".05" /></pattern></defs>
        <rect width="600" height="190" fill="url(#route-grid)" />
        <path d={PATH} fill="none" stroke="#fff" strokeOpacity=".18" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
        <motion.path ref={ref} d={PATH} fill="none" stroke="#d2ad69" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }} />
        <motion.circle r="9" fill="#d2ad69" initial={false} animate={{ cx: dot.x, cy: dot.y }} transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }} />
        <motion.circle r="9" fill="none" stroke="#d2ad69" initial={{ r: 9, opacity: 0.8 }} animate={{ cx: dot.x, cy: dot.y, r: 22, opacity: 0 }} transition={{ duration: 1.6, delay: 1.2 }} />
      </svg>
      <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-[#f6f1e8]"><Store size={14} aria-hidden="true" /> Taller Velmar · MdP</span>
      <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-[#f6f1e8]"><Home size={14} aria-hidden="true" /> Tu casa</span>
    </div>
  );
}
