"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/** Franja horizontal que se desplaza solo mientras el usuario hace scroll (no es una animación permanente). */
export function ScrollStrip({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["4%", "-28%"]);
  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <motion.div style={{ x }} className="flex w-max items-center gap-10 whitespace-nowrap">{children}</motion.div>
    </div>
  );
}
