"use client";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { Copy, Gift, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Button } from "@/components/atoms/Button";
import { LogoMark } from "@/components/atoms/Logo";
import { Celebration } from "@/components/molecules/Celebration";
import { pickSegment, prizeCoupon } from "@/demo/engine/wheel";
import { formatDate } from "@/lib/date";
import { playSound } from "@/lib/sound";
import { useAccount } from "@/stores/account";
import { useAdmin, useDemoData } from "@/stores/admin";
import { useCart } from "@/stores/cart";
import { useToasts } from "@/stores/toast";
import { WheelDisc } from "./WheelDisc";

/** Ruleta de cupones. Demo: un giro por navegador; en producción el sorteo y el límite van en el servidor. */
interface Props {
  /** Dentro del flujo de pago: los botones continúan al checkout. */
  checkout?: boolean;
  onApplied?: () => void;
  onSaved?: () => void;
  onSkip?: () => void;
}

const BULBS = 24;
const mod360 = (a: number) => ((a % 360) + 360) % 360;

/** Gajo que queda bajo el puntero de arriba para una rotación dada (sentido horario). */
export function segmentAt(rotation: number, count: number): number {
  return Math.floor(mod360(360 - mod360(rotation)) / (360 / count)) % count;
}

export function WheelSpinner({ checkout, onApplied, onSaved, onSkip }: Props) {
  const wheel = useDemoData((d) => d.wheel);
  const coupons = useDemoData((d) => d.coupons);
  const addPrizeCoupon = useAdmin((s) => s.addPrizeCoupon);
  const { wheelPrize, setWheelPrize } = useAccount();
  const setCoupon = useCart((s) => s.setCoupon);
  const toast = useToasts((s) => s.push);
  const reduce = useReducedMotion();
  const rotate = useMotionValue(0);
  const kick = useMotionValue(0);
  const [spinning, setSpinning] = useState(false);
  const [justWon, setJustWon] = useState(false);
  const disc = useRef<HTMLDivElement>(null);
  const drag = useRef<{ last: number; acc: number; start: number; at: number; samples: { t: number; r: number }[] } | null>(null);
  const spinningRef = useRef(false);
  const prize = wheelPrize ? coupons.find((c) => c.code === wheelPrize.code) : undefined;
  const count = wheel.segments.length;
  const canSpin = wheel.active && !wheelPrize && !spinning;

  // Clic de cada casilla y golpecito del puntero cuando pasa un gajo (también al arrastrar con el dedo).
  useEffect(() => {
    let last = segmentAt(rotate.get(), count);
    let lastSound = 0;
    return rotate.on("change", (v) => {
      const idx = segmentAt(v, count);
      if (idx === last) return;
      last = idx;
      const now = performance.now();
      if (now - lastSound > 32) { playSound("tick"); lastSound = now; }
      if (!reduce) void animate(kick, [-16, 0], { duration: 0.18, ease: "easeOut" });
    });
  }, [rotate, kick, count, reduce]);

  /** Gira hacia `dir` con la fuerza del gesto; el premio lo decide el sorteo ponderado y el frenado lo lleva ahí. */
  const spin = async (dir: 1 | -1 = 1, speed = 1) => {
    if (spinningRef.current || wheelPrize || !wheel.active) return;
    const pick = pickSegment(wheel);
    if (!pick) return;
    spinningRef.current = true;
    setSpinning(true);
    playSound("spin");
    const slice = 360 / count;
    const desired = mod360(360 - (pick.index * slice + slice / 2) + (Math.random() - 0.5) * slice * 0.6);
    const turns = Math.min(8, Math.max(3, Math.round(2 + speed * 2.4)));
    const current = rotate.get();
    const base = current + dir * turns * 360;
    const target = dir > 0 ? base + mod360(desired - mod360(base)) : base - mod360(mod360(base) - desired);
    await animate(rotate, target, { duration: reduce ? 0 : Math.min(6.2, 3.2 + turns * 0.35), ease: [0.1, 0.72, 0.16, 1] });
    const coupon = prizeCoupon(pick.segment, Math.random().toString(36).slice(2, 7), new Date(), wheel.validDays);
    addPrizeCoupon(coupon);
    setWheelPrize({ code: coupon.code, label: pick.segment.label, at: new Date().toISOString() });
    spinningRef.current = false;
    setSpinning(false);
    setJustWon(true);
    playSound("win");
  };

  const angleOf = (e: PointerEvent<HTMLDivElement>) => {
    const r = disc.current!.getBoundingClientRect();
    return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI;
  };
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!canSpin) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const a = angleOf(e);
    drag.current = { last: a, acc: 0, start: rotate.get(), at: performance.now(), samples: [{ t: performance.now(), r: rotate.get() }] };
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const a = angleOf(e);
    let delta = a - d.last;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    d.last = a;
    d.acc += delta;
    rotate.set(d.start + d.acc);
    const now = performance.now();
    d.samples = [...d.samples.filter((s) => now - s.t < 90), { t: now, r: d.start + d.acc }];
  };
  const onUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const first = d.samples[0]!, last = d.samples.at(-1)!;
    const velocity = last.t > first.t ? (last.r - first.r) / (last.t - first.t) : 0; // grados por ms
    // Un toque (casi sin arrastre) gira con la fuerza normal; un empujón gira hacia donde se tiró.
    if (Math.abs(d.acc) < 8) void spin(1, 1);
    else void spin(velocity < 0 ? -1 : 1, Math.max(0.6, Math.abs(velocity) * 1.6));
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative aspect-square w-full max-w-[340px]">
        <div aria-hidden="true" className="absolute -inset-3 rounded-full bg-[conic-gradient(from_0deg,#d2ad69,#8a6a2e,#d2ad69,#f6e7c4,#d2ad69)] p-[3px] shadow-[0_30px_60px_-30px_rgb(28_32_22/0.7)]">
          <div className="h-full w-full rounded-full bg-night" />
        </div>
        <svg aria-hidden="true" viewBox="0 0 100 100" className="pointer-events-none absolute -inset-3 z-[1] h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)]">
          {Array.from({ length: BULBS }, (_, i) => {
            const a = (i / BULBS) * Math.PI * 2;
            return <circle key={i} cx={50 + 48.6 * Math.cos(a)} cy={50 + 48.6 * Math.sin(a)} r="1.15" fill="#fff4d6"
              className={justWon ? "bulb-win" : spinning ? "bulb-chase" : undefined} style={spinning ? { animationDelay: `${(i % 6) * -0.083}s` } : undefined} opacity={spinning || justWon ? 1 : i % 2 ? 0.45 : 0.85} />;
          })}
        </svg>
        <motion.div ref={disc} style={{ rotate, touchAction: "none" }} role="button" tabIndex={canSpin ? 0 : -1}
          aria-label={canSpin ? "Ruleta: tocala o arrastrala para girar" : "Ruleta"} aria-disabled={!canSpin}
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={() => { drag.current = null; }}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); void spin(); } }}
          className={`absolute inset-0 rounded-full focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-primary ${canSpin ? "cursor-grab active:cursor-grabbing" : ""}`}>
          <WheelDisc segments={wheel.segments} />
        </motion.div>
        <motion.svg aria-hidden="true" viewBox="0 0 40 52" style={{ rotate: kick, transformOrigin: "50% 30%" }} className="pointer-events-none absolute left-1/2 top-[-22px] z-10 w-9 -translate-x-1/2 drop-shadow-[0_6px_8px_rgb(0_0_0/0.35)]">
          <defs><linearGradient id="pin-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f6e2b0" /><stop offset=".5" stopColor="#d2ad69" /><stop offset="1" stopColor="#8a6a2e" /></linearGradient></defs>
          <path d="M20 50 4.5 22A16 16 0 1 1 35.5 22Z" fill="url(#pin-gold)" stroke="#1c2016" strokeWidth="1.5" />
          <circle cx="20" cy="17" r="6" fill="#1c2016" />
        </motion.svg>
        <div aria-hidden="true" className="pointer-events-none absolute inset-[38%] grid place-items-center rounded-full border-4 border-brass bg-night">
          <LogoMark className="h-1/2 w-1/2 text-brass" />
        </div>
      </div>
      <div aria-live="polite" className="relative w-full max-w-sm text-center">
        {wheelPrize ? (
          <div className="rounded-3xl bg-surface p-5 shadow-[var(--shadow-card)]">
            {justWon && <Celebration />}
            <p className="eyebrow text-brass-ink">{justWon ? "¡Ganaste!" : "Tu premio"}</p>
            <p className="font-display mt-1 text-3xl">{wheelPrize.label}</p>
            <p className="mt-1 text-sm text-muted">{prize?.description}{prize?.endsAt ? ` · vence ${formatDate(prize.endsAt)}` : ""} · 1 uso</p>
            <button type="button" onClick={() => { void navigator.clipboard?.writeText(wheelPrize.code); toast({ tone: "success", title: "Código copiado", description: wheelPrize.code }); }}
              className="mx-auto mt-3 flex items-center gap-2 rounded-full border border-dashed border-brass-ink px-4 py-2 font-mono text-lg font-extrabold tracking-wider" aria-label={`Copiar código ${wheelPrize.code}`}>
              {wheelPrize.code} <Copy size={16} aria-hidden="true" />
            </button>
            <Button className="mt-4 w-full" onClick={() => { setCoupon(wheelPrize.code); toast({ tone: "success", title: "Cupón aplicado a tu carrito", description: wheelPrize.code }); onApplied?.(); }}>
              <ShoppingBag size={18} aria-hidden="true" /> {checkout ? "Aplicar y continuar al pago" : "Aplicar a mi carrito"}
            </Button>
            <Button variant="ghost" className="mt-2 w-full" onClick={() => { toast({ tone: "info", title: "Guardado en Mis cupones", description: wheelPrize.code, action: { label: "Ver cupones", href: "/cupones/" } }); onSaved?.(); }}>
              Guardar para más tarde
            </Button>
          </div>
        ) : (
          <>
            <Button size="lg" onClick={() => void spin()} disabled={spinning || !wheel.active} className="w-full">
              <Gift size={18} aria-hidden="true" /> {spinning ? "Girando…" : wheel.active ? "Girar la ruleta" : "Ruleta pausada"}
            </Button>
            {onSkip && <Button variant="ghost" className="mt-2 w-full" onClick={onSkip} disabled={spinning}>Continuar sin girar</Button>}
            <p className="mt-3 text-sm font-semibold text-muted">Tocá la ruleta o arrastrala con el dedo para girarla.</p>
            <p className="mt-1 text-xs text-muted">Demo: un giro por navegador (se reinicia con “Reiniciar demo”). En producción, un giro por cuenta y sorteo en el servidor.</p>
          </>
        )}
      </div>
    </div>
  );
}
