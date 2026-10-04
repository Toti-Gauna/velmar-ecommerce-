"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";

const STEPS = [
  { n: "01", title: "Elegí tu pieza", text: "Comederos, collares, veladores, llaveros NFC y más, hechos en el taller." },
  { n: "02", title: "Personalizala", text: "Nombre, tipografía y color, o tu foto con encuadre y zoom." },
  { n: "03", title: "Aprobá la vista previa", text: "Ves exactamente lo que se fabrica. Recién ahí pagás." },
  { n: "04", title: "Seguí tu pedido", text: "Del taller a tu casa, con cada etapa en tu link de seguimiento." },
];

/** Cuatro pasos unidos por una línea que se dibuja con el scroll. */
export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <section aria-labelledby="como" className="py-6">
      <Reveal>
        <p className="eyebrow text-brass-ink">Cómo funciona</p>
        <h2 id="como" className="font-display mt-3 max-w-2xl text-4xl leading-tight sm:text-5xl">Lo ves antes de pagar. <span className="italic text-primary">Así de simple.</span></h2>
      </Reveal>
      <div ref={ref} className="relative mt-12">
        <div aria-hidden="true" className="absolute left-0 right-0 top-6 hidden h-px bg-line lg:block">
          <motion.div style={{ scaleX }} className="h-full origin-left bg-primary" />
        </div>
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 0.08} className="relative">
              <span className="font-display relative z-10 grid h-12 w-12 place-items-center rounded-full border border-line bg-bg text-lg text-primary">{s.n}</span>
              <h3 className="mt-5 text-lg font-extrabold">{s.title}</h3>
              <p className="mt-1.5 text-muted">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
