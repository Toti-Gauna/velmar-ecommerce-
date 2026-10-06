"use client";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { useFavorites } from "@/stores/favorites";
import { useHydrated } from "@/stores/hydration";
import { useToasts } from "@/stores/toast";

/** Corazón de favoritos (se guardan en este navegador; se ven en la pantalla Favoritos). */
export function FavoriteButton({ slug, name, className }: { slug: string; name: string; className?: string }) {
  const hydrated = useHydrated();
  const on = useFavorites((s) => hydrated && s.slugs.includes(slug));
  const toggle = useFavorites((s) => s.toggle);
  const toast = useToasts((s) => s.push);
  return (
    <button type="button" aria-pressed={on} aria-label={on ? `Quitar ${name} de favoritos` : `Guardar ${name} en favoritos`}
      onClick={() => { const added = toggle(slug); toast({ tone: "success", title: added ? "Guardado en favoritos" : "Quitado de favoritos", description: name, ...(added && { action: { label: "Ver favoritos", href: "/favoritos/" } }) }); }}
      className={cn("grid shrink-0 place-items-center rounded-full border transition-colors", on ? "border-clay/30 bg-[#fbe9e3] text-clay" : "border-ink/15 bg-surface text-ink hover:border-ink/30", className)}>
      <motion.span key={String(on)} initial={{ scale: on ? 0.6 : 1 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>
        <Heart size={20} aria-hidden="true" fill={on ? "currentColor" : "none"} />
      </motion.span>
    </button>
  );
}
