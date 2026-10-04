"use client";
import { useState } from "react";
import type { ArtKey, ArtView } from "@/demo/types";
import { ProductArt } from "@/components/illustrations/ProductArt";
import { cn } from "@/lib/cn";

const VIEW_LABEL: Record<ArtView, string> = { front: "Frente", detail: "Detalle", context: "En casa" };

export function ProductGallery({ art, views, tint, name }: { art: ArtKey; views: ArtView[]; tint?: string; name: string }) {
  const [active, setActive] = useState(0);
  const view = views[active] ?? "front";
  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
        <ProductArt key={`${view}-${tint}`} art={art} view={view} tint={tint} label={`${name}, vista ${VIEW_LABEL[view].toLowerCase()}`} className="animate-fade-in aspect-square" />
      </div>
      {views.length > 1 && (
        <div role="group" aria-label="Fotos del producto" className="flex gap-2">
          {views.map((v, i) => (
            <button key={v} type="button" onClick={() => setActive(i)} aria-pressed={i === active} aria-label={`Ver ${VIEW_LABEL[v].toLowerCase()}`}
              className={cn("w-20 overflow-hidden rounded-xl border-2 transition-all duration-200", i === active ? "border-primary" : "border-transparent opacity-75 hover:opacity-100")}>
              <ProductArt art={art} view={v} tint={tint} label="" showBadge={false} className="aspect-square" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
