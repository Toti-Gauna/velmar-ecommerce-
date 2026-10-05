"use client";
import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

/** Herramientas comunes de las escenas de la pantalla de carga (motion graphics de ~4,3 s). */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** Pseudoaleatorio determinístico (mismas posiciones en cada visita). */
export function rand(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Capa a pantalla completa. */
export function Layer({ children, className = "", style }: { children?: ReactNode; className?: string; style?: CSSProperties }) {
  return <div className={`pointer-events-none absolute inset-0 ${className}`} style={style}>{children}</div>;
}

/** Explosión de partículas desde un punto (fuegos, corazones, chispas). */
export function Burst({ x, y, delay, colors, count = 18, radius = 22, size = 0.9, shape = "dot" }: {
  x: string; y: string; delay: number; colors: string[]; count?: number; radius?: number; size?: number; shape?: "dot" | "streak";
}) {
  return (
    <div className="absolute" style={{ left: x, top: y }}>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2 + rand(i + count) * 0.3;
        const r = radius * (0.75 + rand(i * 3 + delay) * 0.35);
        const c = colors[i % colors.length]!;
        return (
          <motion.span key={i} className="absolute rounded-full"
            style={{ width: `${size}vmin`, height: shape === "streak" ? `${size * 3.2}vmin` : `${size}vmin`, background: c, boxShadow: `0 0 1.6vmin ${c}`, rotate: `${(a * 180) / Math.PI + 90}deg` }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
            animate={{ x: `${Math.cos(a) * r}vmin`, y: [`0vmin`, `${Math.sin(a) * r}vmin`, `${Math.sin(a) * r + 6}vmin`], opacity: [0, 1, 1, 0], scale: [0.4, 1, 0.8] }}
            transition={{ duration: 1.5, delay, ease: "easeOut", times: [0, 0.15, 0.7, 1] }} />
        );
      })}
      <motion.span className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ width: "10vmin", height: "10vmin", background: `radial-gradient(closest-side, ${colors[0]}, transparent)` }}
        initial={{ opacity: 0, scale: 0.2 }} animate={{ opacity: [0, 0.9, 0], scale: [0.2, 1.6, 2] }} transition={{ duration: 0.9, delay }} />
    </div>
  );
}

/** Cohete que sube y explota. */
export function Firework({ x, y, delay, colors }: { x: string; y: string; delay: number; colors: string[] }) {
  return (
    <>
      <motion.span className="absolute h-[2.4vmin] w-[0.5vmin] rounded-full" style={{ left: x, background: `linear-gradient(${colors[0]}, transparent)` }}
        initial={{ top: "100%", opacity: 0 }} animate={{ top: y, opacity: [0, 1, 1, 0] }} transition={{ duration: 0.7, delay: delay - 0.7, ease: [0.3, 0.6, 0.4, 1] }} />
      <Burst x={x} y={y} delay={delay} colors={colors} count={22} radius={18} />
    </>
  );
}

/** Texto que entra letra por letra. */
export function Letters({ text, delay, className, style }: { text: string; delay: number; className?: string; style?: CSSProperties }) {
  return (
    <span className={className} style={style} aria-hidden="true">
      {[...text].map((ch, i) => (
        <motion.span key={i} className="inline-block whitespace-pre" initial={{ opacity: 0, y: "0.6em", filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.6, delay: delay + i * 0.05, ease: EASE }}>{ch}</motion.span>
      ))}
    </span>
  );
}
