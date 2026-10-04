"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState, type PointerEvent } from "react";
import type { ArtKey, ArtView } from "@/demo/types";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { ProductVisual } from "@/components/illustrations/ProductVisual";
import { cn } from "@/lib/cn";

const VIEW_LABEL: Record<ArtView, string> = { front: "Frente", detail: "Detalle", context: "En casa" };

interface Props { art: ArtKey; views: ArtView[]; tint?: string; name: string; photoUrl?: string; alt?: string }

/** Galería: fundido entre vistas y zoom que sigue al cursor (solo mouse). */
export function ProductGallery({ art, views, tint, name, photoUrl, alt }: Props) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const view = views[active] ?? "front";
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };
  if (photoUrl) return <ProductVisual art={art} photoUrl={photoUrl} label={alt || name} className="aspect-square rounded-[2rem] shadow-[var(--shadow-card)]" />;
  return (
    <div className="flex flex-col gap-3 lg:flex-row-reverse">
      <div onPointerMove={onMove} onPointerLeave={() => setZoom(null)} className="relative aspect-square flex-1 overflow-hidden rounded-[2rem] bg-accent shadow-[var(--shadow-card)] lg:cursor-zoom-in">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div key={`${view}-${tint}`} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.55 }} className="absolute inset-0">
            <div className="h-full w-full transition-transform duration-300 ease-out" style={zoom ? { transform: "scale(1.7)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}>
              <ProductArt art={art} view={view} tint={tint} label={`${name}, vista ${VIEW_LABEL[view].toLowerCase()}`} className="h-full w-full [&>svg]:h-full" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      {views.length > 1 && (
        <div role="group" aria-label="Fotos del producto" className="flex gap-2 lg:flex-col">
          {views.map((v, i) => (
            <button key={v} type="button" onClick={() => setActive(i)} aria-pressed={i === active} aria-label={`Ver ${VIEW_LABEL[v].toLowerCase()}`}
              className={cn("relative w-20 overflow-hidden rounded-2xl transition-all duration-300 lg:w-24", i === active ? "ring-2 ring-primary ring-offset-2 ring-offset-bg" : "opacity-70 hover:opacity-100")}>
              <ProductArt art={art} view={v} tint={tint} label="" showBadge={false} className="aspect-square" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
