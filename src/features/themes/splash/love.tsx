"use client";
import { motion } from "motion/react";
import { Decor } from "@/components/illustrations/seasonal/Decor";
import { Burst, EASE, Layer, rand } from "./kit";

const HEART = "M50 88C22 68 6 50 6 32 6 18 17 8 30 8c8 0 15 4 20 11 5-7 12-11 20-11 13 0 24 10 24 24 0 18-16 36-44 56z";

/** San Valentín: un corazón enorme se dibuja detrás del logo, late dos veces y estalla en corazoncitos. */
export function ValentineScene() {
  return (
    <>
      <motion.svg viewBox="0 0 100 100" className="absolute left-1/2 top-1/2 h-[78vmin] w-[78vmin] -translate-x-1/2 -translate-y-[54%] overflow-visible"
        animate={{ scale: [1, 1, 1.07, 1, 1.07, 1] }} transition={{ duration: 3.2, times: [0, 0.45, 0.55, 0.65, 0.75, 0.85] }}>
        <defs><radialGradient id="vg" cx="50%" cy="40%" r="65%"><stop offset="0" stopColor="#ff6f93" stopOpacity=".55" /><stop offset="1" stopColor="#a8274a" stopOpacity=".15" /></radialGradient></defs>
        <motion.path d={HEART} fill="url(#vg)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.2 }} />
        <motion.path d={HEART} fill="none" stroke="#ffd1dc" strokeWidth="0.8" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.1, ease: EASE }}
          style={{ filter: "drop-shadow(0 0 6px #ff9bb3)" }} />
      </motion.svg>
      <Burst x="50%" y="46%" delay={2.6} colors={["#ff9bb3", "#ffd1dc", "#e4577a"]} count={20} radius={38} size={1.2} />
      <Layer>
        {Array.from({ length: 16 }, (_, i) => (
          <motion.span key={i} className="absolute" style={{ left: `${rand(i) * 100}%`, width: `${3 + rand(i + 2) * 4}vmin`, height: `${3 + rand(i + 2) * 4}vmin` }}
            initial={{ top: "105%", opacity: 0 }} animate={{ top: "-10%", opacity: [0, 0.8, 0.8, 0], x: [0, (rand(i) - 0.5) * 60, 0] }}
            transition={{ duration: 3.5 + rand(i + 1) * 1.5, delay: rand(i + 6) * 1.2, ease: "easeOut" }}>
            <Decor kind="heart" className="h-full w-full" />
          </motion.span>
        ))}
      </Layer>
    </>
  );
}

/** Día de la Madre: una flor se abre pétalo por pétalo detrás del logo, nacen tulipanes y caen pétalos. */
export function MothersScene() {
  return (
    <>
      <motion.div className="absolute left-1/2 top-[46%] h-0 w-0" initial={{ rotate: -40 }} animate={{ rotate: 20 }} transition={{ duration: 4.4, ease: "easeOut" }}>
        {Array.from({ length: 10 }, (_, i) => (
          <motion.span key={i} className="absolute left-0 top-0 h-[34vmin] w-[15vmin] origin-[50%_0%] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-[linear-gradient(180deg,rgb(255_190_215/0.05),rgb(245_168_198/0.55))]"
            style={{ rotate: `${i * 36}deg`, x: "-50%" }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.1, delay: 0.15 + i * 0.09, ease: EASE }} />
        ))}
        <motion.span className="absolute h-[9vmin] w-[9vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(#ffe0a8,#f3b35a)]" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.6, delay: 1.2 }} />
      </motion.div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-around">
        {[0.9, 1.25, 1, 1.4, 1.05, 1.2, 0.85].map((s, i) => (
          <motion.span key={i} className="block origin-bottom" style={{ width: `${s * 11}vmin`, height: `${s * 13}vmin` }} initial={{ scaleY: 0 }} animate={{ scaleY: 1, rotate: [0, (i % 2 ? 4 : -4), 0] }}
            transition={{ scaleY: { duration: 1, delay: 0.6 + i * 0.1, ease: EASE }, rotate: { duration: 2.4, delay: 1.6, repeat: Infinity, repeatType: "mirror" } }}>
            <Decor kind="tulip" className="h-full w-full" />
          </motion.span>
        ))}
      </div>
      <Layer>
        {Array.from({ length: 24 }, (_, i) => (
          <motion.span key={i} className="absolute h-[1.8vmin] w-[1.2vmin] rounded-[60%_10%]" style={{ left: `${rand(i) * 100}%`, background: ["#f5a8c6", "#ffd1dc", "#e4577a"][i % 3] }}
            initial={{ top: "-5%", rotate: 0 }} animate={{ top: "105%", rotate: 540, x: [0, (rand(i) - 0.5) * 80, 0] }} transition={{ duration: 3.4 + rand(i + 3) * 1.4, delay: rand(i + 7) * 1.5, ease: "linear" }} />
        ))}
      </Layer>
    </>
  );
}

const RAINBOW = ["#e5544a", "#f39a3c", "#f6c84c", "#4fb36a", "#4fa3e0", "#8a6fd6"];

/** San Patricio: un arcoíris se dibuja banda por banda hasta la olla de oro, que lanza monedas; tréboles flotan. */
export function PatrickScene() {
  return (
    <>
      <svg viewBox="0 0 200 110" className="absolute inset-x-[4%] top-[8%] w-[92%] overflow-visible">
        {RAINBOW.map((c, i) => (
          <motion.path key={c} d={`M${10 + i * 5} 105 A${90 - i * 5} ${90 - i * 5} 0 0 1 ${190 - i * 5} 105`} fill="none" stroke={c} strokeWidth="4.6" strokeLinecap="round" opacity=".85"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, delay: 0.1 + i * 0.12, ease: EASE }} />
        ))}
      </svg>
      <motion.span className="absolute bottom-[6%] right-[8%] h-[20vmin] w-[20vmin]" initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 1.3, ease: EASE }}>
        <Decor kind="pot-of-gold" className="h-full w-full" />
      </motion.span>
      <div className="absolute bottom-[20%] right-[17%]">
        {Array.from({ length: 10 }, (_, i) => (
          <motion.span key={i} className="absolute h-[3.4vmin] w-[3.4vmin] rounded-full border border-[#c99a1e] bg-[radial-gradient(#ffe49a,#f6c84c)]"
            initial={{ x: 0, y: 0, opacity: 0 }} animate={{ x: `${-10 - rand(i) * 40}vmin`, y: [`0vmin`, `${-20 - rand(i + 1) * 20}vmin`, `${10 + rand(i) * 10}vmin`], opacity: [0, 1, 1, 0], rotate: 360 }}
            transition={{ duration: 1.6, delay: 1.9 + i * 0.1, ease: "easeOut" }} />
        ))}
      </div>
      <Layer>
        {Array.from({ length: 12 }, (_, i) => (
          <motion.span key={i} className="absolute" style={{ left: `${rand(i + 2) * 100}%`, width: `${4 + rand(i) * 4}vmin`, height: `${4 + rand(i) * 4}vmin` }}
            initial={{ top: "-10%" }} animate={{ top: "105%", rotate: rand(i) * 360 }} transition={{ duration: 4 + rand(i + 1) * 2, delay: rand(i + 4), ease: "linear" }}>
            <Decor kind="shamrock" className="h-full w-full opacity-80" />
          </motion.span>
        ))}
      </Layer>
    </>
  );
}

/** Pascuas: un huevo gigante tiembla, se rompe en dos y salen orejitas de conejo entre chispas pastel. */
export function EasterScene() {
  return (
    <>
      <div className="absolute bottom-[7%] left-1/2 h-[26vmin] w-[22vmin] -translate-x-1/2">
        <motion.span className="absolute inset-x-[10%] bottom-[30%] h-[60%]" initial={{ y: "60%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 2.5, ease: EASE }}>
          <Decor kind="bunny-ears" className="h-full w-full" />
        </motion.span>
        {[0, 1].map((half) => (
          <motion.span key={half} className="absolute inset-0 overflow-hidden" style={{ clipPath: half ? "polygon(0 0,100% 0,100% 48%,80% 56%,60% 46%,40% 56%,20% 46%,0 54%)" : "polygon(0 54%,20% 46%,40% 56%,60% 46%,80% 56%,100% 48%,100% 100%,0 100%)" }}
            animate={{ rotate: [0, -6, 6, -8, 8, 0, half ? -28 : 0], y: [0, 0, 0, 0, 0, 0, half ? "-40%" : "8%"], x: [0, 0, 0, 0, 0, 0, half ? "-30%" : 0], opacity: [1, 1, 1, 1, 1, 1, half ? 0 : 1] }}
            transition={{ duration: 2.8, times: [0, 0.2, 0.35, 0.5, 0.65, 0.78, 1], ease: "easeInOut" }}>
            <Decor kind="easter-egg" className="h-full w-full" />
          </motion.span>
        ))}
      </div>
      <Burst x="50%" y="80%" delay={2.4} colors={["#f7b6c8", "#ffe28a", "#b9e3f5", "#cdb3f5"]} count={24} radius={30} size={1.1} />
      {[["10%", "60%", 0.4], ["82%", "56%", 0.7], ["22%", "26%", 1], ["74%", "20%", 1.2]].map(([left, top, d], i) => (
        <motion.span key={i} className="absolute h-[10vmin] w-[8vmin]" style={{ left: left as string, top: top as string }} initial={{ scale: 0 }}
          animate={{ scale: 1, y: [0, -14, 0] }} transition={{ scale: { duration: 0.6, delay: d as number }, y: { duration: 1.6, repeat: Infinity, delay: d as number } }}>
          <Decor kind="easter-egg" className="h-full w-full" />
        </motion.span>
      ))}
    </>
  );
}
