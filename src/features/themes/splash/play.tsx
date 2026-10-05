"use client";
import { motion } from "motion/react";
import { Decor } from "@/components/illustrations/seasonal/Decor";
import { Burst, EASE, Layer, rand } from "./kit";

/** Día del Animal: huellas que cruzan la pantalla paso a paso y terminan en un corazón; huesitos flotan. */
export function AnimalScene() {
  const steps = 13;
  return (
    <>
      <Layer>
        {Array.from({ length: steps }, (_, i) => {
          const t = i / (steps - 1);
          const left = 4 + t * 88;
          const top = 78 - Math.sin(t * Math.PI) * 52 + (i % 2 ? 4 : -4);
          return (
            <motion.span key={i} className="absolute h-[6vmin] w-[6vmin]" style={{ left: `${left}%`, top: `${top}%`, rotate: `${70 + (i % 2 ? 14 : -14) - t * 140}deg` }}
              initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: [0, 1, 0.55], scale: [0.4, 1.15, 1] }} transition={{ duration: 0.5, delay: 0.25 + i * 0.22 }}>
              <Decor kind="paw" className="h-full w-full" />
            </motion.span>
          );
        })}
      </Layer>
      <motion.span className="absolute right-[3%] top-[66%] h-[9vmin] w-[11vmin]" initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: 0.6, delay: 0.25 + steps * 0.22 }}>
        <Decor kind="heart" className="h-full w-full" />
      </motion.span>
      <Layer>
        {Array.from({ length: 8 }, (_, i) => (
          <motion.span key={i} className="absolute h-[6vmin] w-[6vmin]" style={{ left: `${rand(i + 3) * 100}%` }} initial={{ top: "105%", rotate: 0 }}
            animate={{ top: "-10%", rotate: 180 }} transition={{ duration: 4.5, delay: rand(i) * 1.5, ease: "linear" }}>
            <Decor kind="bone" className="h-full w-full opacity-60" />
          </motion.span>
        ))}
      </Layer>
    </>
  );
}

const STARS: [number, number][] = [[18, 30], [30, 18], [44, 26], [56, 14], [70, 24], [82, 16], [76, 38], [60, 36], [40, 40]];

/** Día del Padre: aparecen estrellas y se unen en una constelación dorada; cae una estrella fugaz y entra el sombrero. */
export function FathersScene() {
  const path = STARS.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  return (
    <>
      <Layer>
        {Array.from({ length: 40 }, (_, i) => (
          <motion.span key={i} className="absolute h-[0.35vmin] w-[0.35vmin] rounded-full bg-white" style={{ left: `${rand(i) * 100}%`, top: `${rand(i + 9) * 100}%` }}
            animate={{ opacity: [0.1, 0.9, 0.2] }} transition={{ duration: 1.5 + rand(i) * 2, repeat: Infinity, repeatType: "mirror" }} />
        ))}
      </Layer>
      <svg viewBox="0 0 100 56" className="absolute inset-x-0 top-[2%] w-full">
        <motion.path d={path} fill="none" stroke="#e9c27a" strokeWidth="0.25" strokeDasharray="0.8 0.6" initial={{ pathLength: 0, opacity: 0.8 }} animate={{ pathLength: 1 }} transition={{ duration: 2.2, delay: 0.8, ease: "easeInOut" }} />
        {STARS.map(([x, y], i) => (
          <motion.circle key={i} cx={x} cy={y} r="0.9" fill="#fff4d6" style={{ filter: "drop-shadow(0 0 1.5px #e9c27a)" }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }} />
        ))}
      </svg>
      <motion.span className="absolute h-[0.4vmin] w-[22vmin] rounded-full bg-[linear-gradient(90deg,transparent,#fff)]" style={{ rotate: "-24deg" }}
        initial={{ left: "70%", top: "4%", opacity: 0 }} animate={{ left: "20%", top: "34%", opacity: [0, 1, 0] }} transition={{ duration: 0.9, delay: 2.4, ease: "easeIn" }} />
      <motion.span className="absolute bottom-[8%] left-1/2 h-[20vmin] w-[24vmin] -translate-x-1/2" initial={{ y: -60, opacity: 0, rotate: -20 }} animate={{ y: 0, opacity: 1, rotate: [-20, 6, 0] }} transition={{ duration: 0.9, delay: 1.6, ease: EASE }}>
        <Decor kind="fedora" className="h-full w-full" />
      </motion.span>
    </>
  );
}

/** Día del Amigo: dos anillos de colores se acercan desde los costados y se entrelazan; un mate humea. */
export function FriendsScene() {
  return (
    <>
      {[-1, 1].map((side, i) => (
        <motion.svg key={side} viewBox="0 0 100 100" className="absolute left-1/2 top-[46%] h-[56vmin] w-[56vmin] -translate-y-1/2 overflow-visible"
          initial={{ x: `${-50 + side * 160}%`, opacity: 0 }} animate={{ x: `${-50 + side * 12}%`, opacity: 1 }} transition={{ duration: 1.6, delay: 0.2, ease: EASE }}>
          <motion.circle cx="50" cy="50" r="46" fill="none" stroke={i ? "#f3dca6" : "#b7d68f"} strokeWidth="1.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1, rotate: side * 90 }} transition={{ duration: 1.8, delay: 0.3, ease: EASE }}
            style={{ filter: `drop-shadow(0 0 4px ${i ? "#f3dca6" : "#b7d68f"})` }} />
        </motion.svg>
      ))}
      <Burst x="50%" y="46%" delay={1.9} colors={["#f3dca6", "#b7d68f", "#ef9b6a"]} count={16} radius={34} />
      <div className="absolute bottom-[6%] left-1/2 h-[18vmin] w-[18vmin] -translate-x-1/2">
        <svg viewBox="0 0 40 40" className="absolute -top-[70%] left-[10%] h-[80%] w-[80%] overflow-visible">
          {[0, 1, 2].map((k) => (
            <motion.path key={k} d={`M${12 + k * 8} 38 C${6 + k * 8} 30 ${18 + k * 8} 24 ${12 + k * 8} 14 C${8 + k * 8} 8 ${16 + k * 8} 4 ${12 + k * 8} 0`} fill="none" stroke="#f6f1e8" strokeWidth="1.4" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: [0, 1, 1], opacity: [0, 0.7, 0], y: [0, -6] }} transition={{ duration: 1.8, delay: 0.8 + k * 0.3, repeat: Infinity }} />
          ))}
        </svg>
        <motion.span className="absolute inset-0" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.5, ease: EASE }}>
          <Decor kind="mate" className="h-full w-full" />
        </motion.span>
      </div>
    </>
  );
}

/** Día del Niño: globos de colores suben meciéndose, un barrilete cruza y llueven papelitos. */
export function KidsScene() {
  return (
    <>
      <Layer>
        {Array.from({ length: 11 }, (_, i) => (
          <motion.span key={i} className="absolute" style={{ left: `${4 + i * 9 + rand(i) * 4}%`, width: `${8 + rand(i + 2) * 6}vmin`, height: `${10 + rand(i + 2) * 8}vmin`, filter: `hue-rotate(${i * 47}deg) saturate(1.2)` }}
            initial={{ top: "110%" }} animate={{ top: `${-30 + rand(i + 5) * 20}%`, x: [0, 14, -10, 8] }} transition={{ duration: 4 + rand(i) * 1.5, delay: rand(i + 9) * 0.8, ease: "easeOut" }}>
            <Decor kind="balloon" className="h-full w-full" />
          </motion.span>
        ))}
      </Layer>
      <motion.span className="absolute top-[10%] h-[16vmin] w-[14vmin]" initial={{ left: "-20%", rotate: -10 }} animate={{ left: "110%", top: ["10%", "4%", "14%", "6%"], rotate: [-10, 8, -6, 10] }} transition={{ duration: 4.2, delay: 0.3, ease: "linear" }}>
        <Decor kind="kite" className="h-full w-full" />
      </motion.span>
      <Layer>
        {Array.from({ length: 34 }, (_, i) => (
          <motion.span key={i} className="absolute h-[1.4vmin] w-[0.8vmin] rounded-[1px]" style={{ left: `${rand(i + 1) * 100}%`, background: ["#ffd34d", "#4fb3e8", "#ef5b5b", "#7bd389"][i % 4] }}
            initial={{ top: "-5%" }} animate={{ top: "105%", rotate: 720 }} transition={{ duration: 2.6 + rand(i) * 1.6, delay: 0.8 + rand(i + 3) * 1.6, ease: "linear" }} />
        ))}
      </Layer>
    </>
  );
}
