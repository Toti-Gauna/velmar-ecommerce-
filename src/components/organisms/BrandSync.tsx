"use client";
import { useEffect } from "react";
import { shade } from "@/lib/color";
import { useDemoData } from "@/stores/admin";

/** Aplica los colores de marca editados en el panel demo como variables CSS (en producción vienen de Setting). */
export function BrandSync() {
  const colors = useDemoData((d) => d.settings.brandColors);
  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--brand-primary", colors.primary);
    root.setProperty("--brand-primary-hover", shade(colors.primary, -0.25));
    root.setProperty("--brand-accent", colors.accent);
    root.setProperty("--brand-background", colors.background);
  }, [colors]);
  return null;
}
