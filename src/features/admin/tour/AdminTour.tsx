"use client";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { ADMIN_TOUR, markTourSeen } from "./steps";

type Rect = { top: number; left: number; width: number; height: number };
const PAD = 8;
const CARD_W = 340;

/** Primer elemento visible con ese `data-tour` (el sidebar en escritorio, las pestañas en el celular). */
function findTarget(name?: string): HTMLElement | null {
  if (!name) return null;
  return [...document.querySelectorAll<HTMLElement>(`[data-tour="${name}"]`)].find((el) => el.getClientRects().length > 0 && el.offsetParent !== null) ?? null;
}

/** Guía paso a paso: resalta cada zona con un recorte, una flecha y una tarjeta con Anterior / Siguiente. */
export function AdminTour({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const card = useRef<HTMLDivElement>(null);
  const current = ADMIN_TOUR[step]!;
  const last = step === ADMIN_TOUR.length - 1;

  const measure = useCallback(() => {
    const el = findTarget(current.target);
    if (!el) return setRect(null);
    const r = el.getBoundingClientRect();
    setRect({ top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 });
  }, [current.target]);

  useLayoutEffect(() => {
    const el = findTarget(current.target);
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
    const t = window.setTimeout(measure, el ? 380 : 0);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => { window.clearTimeout(t); window.removeEventListener("resize", measure); window.removeEventListener("scroll", measure, true); };
  }, [current.target, measure]);

  const finish = useCallback(() => { markTourSeen(); onClose(); }, [onClose]);
  useEffect(() => {
    card.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
      if (e.key === "ArrowRight") setStep((s) => Math.min(ADMIN_TOUR.length - 1, s + 1));
      if (e.key === "ArrowLeft") setStep((s) => Math.max(0, s - 1));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [finish, step]);

  const vw = typeof window === "undefined" ? 400 : window.innerWidth;
  const vh = typeof window === "undefined" ? 800 : window.innerHeight;
  const w = Math.min(CARD_W, vw - 32);
  const below = rect ? rect.top + rect.height + 190 < vh || rect.top < 220 : true;
  const cardLeft = rect ? Math.min(Math.max(16, rect.left + rect.width / 2 - w / 2), vw - w - 16) : (vw - w) / 2;
  const cardStyle = rect
    ? below ? { left: cardLeft, top: Math.min(rect.top + rect.height + 18, vh - 220) } : { left: cardLeft, bottom: vh - rect.top + 18 }
    : { left: cardLeft, top: vh / 2 - 120 };
  const arrowLeft = rect ? Math.min(Math.max(20, rect.left + rect.width / 2 - cardLeft - 9), w - 38) : 0;

  return createPortal(
    <div className="fixed inset-0 z-[80]">
      {rect ? (
        <motion.div aria-hidden="true" className="pointer-events-none absolute rounded-2xl ring-2 ring-brass shadow-[0_0_0_9999px_rgb(20_23_15/0.62)]"
          initial={false} animate={rect} transition={{ type: "spring", stiffness: 260, damping: 30 }} />
      ) : <div aria-hidden="true" className="absolute inset-0 bg-[rgb(20_23_15/0.62)]" />}
      <AnimatePresence mode="wait">
        <motion.div key={step} ref={card} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-text"
          initial={{ opacity: 0, y: below ? 10 : -10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          style={{ ...cardStyle, width: w }} className="absolute rounded-3xl bg-surface p-5 shadow-[var(--shadow-lift)] outline-none">
          {rect && <span aria-hidden="true" style={{ left: arrowLeft }} className={cn("absolute h-[18px] w-[18px] rotate-45 bg-surface", below ? "-top-2" : "-bottom-2")} />}
          <div className="flex items-start justify-between gap-3">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brass-ink">Guía del panel · {step + 1} de {ADMIN_TOUR.length}</p>
            <button type="button" onClick={finish} aria-label="Cerrar la guía" className="-mr-2 -mt-2 grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-accent"><X size={16} aria-hidden="true" /></button>
          </div>
          <h2 id="tour-title" className="font-display mt-1 text-2xl leading-tight">{current.title}</h2>
          <p id="tour-text" className="mt-2 text-sm text-muted">{current.text}</p>
          <div className="mt-4 flex items-center gap-1.5" aria-hidden="true">
            {ADMIN_TOUR.map((_, i) => <span key={i} className={cn("h-1.5 rounded-full transition-all", i === step ? "w-6 bg-primary" : "w-1.5 bg-ink/15")} />)}
          </div>
          <div className="mt-4 flex items-center justify-between gap-2">
            {step > 0 ? (
              <button type="button" onClick={() => setStep(step - 1)} className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-bold text-primary hover:bg-accent/60"><ArrowLeft size={16} aria-hidden="true" />Anterior</button>
            ) : <button type="button" onClick={finish} className="h-10 rounded-full px-3 text-sm font-bold text-muted hover:bg-accent/60">Saltar guía</button>}
            <button type="button" onClick={() => (last ? finish() : setStep(step + 1))} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-night px-5 text-sm font-bold text-[#f6f1e8] hover:bg-night-2">
              {last ? "Empezar" : "Siguiente"}{!last && <ArrowRight size={16} aria-hidden="true" className="text-brass" />}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body,
  );
}
