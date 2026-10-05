"use client";
import { useEffect } from "react";
import { AMBIENT } from "./ambient";
import { AmbientField } from "./AmbientField";
import { skinOf } from "./skins";
import { useCurrentTheme } from "./useCurrentTheme";

/**
 * Aplica la temática a toda la tienda: `data-season` en <html> (paleta y splash, ver palettes.ts y seasons.css)
 * y el fondo animado detrás del contenido. Al salir de la tienda (al panel) se quita.
 */
export function ThemeStage() {
  const { theme, ready } = useCurrentTheme();
  const id = theme?.id ?? null;
  useEffect(() => {
    if (!ready) return;
    const html = document.documentElement;
    if (id) {
      const skin = skinOf(id);
      html.setAttribute("data-season", id);
      html.style.setProperty("--sp-from", skin.from);
      html.style.setProperty("--sp-to", skin.to);
      html.style.setProperty("--sp-accent", skin.accent);
    } else html.removeAttribute("data-season");
  }, [id, ready]);
  useEffect(() => () => document.documentElement.removeAttribute("data-season"), []);
  if (!theme) return null;
  const skin = skinOf(theme.id);
  return (
    <div aria-hidden="true" className="season-backdrop" style={{ background: `radial-gradient(80% 50% at 50% -8%, color-mix(in srgb, ${skin.to} 26%, transparent), transparent 72%), radial-gradient(60% 40% at 100% 100%, color-mix(in srgb, ${skin.accent} 14%, transparent), transparent 70%)` }}>
      <AmbientField layers={AMBIENT[theme.id]} density={0.9} className="absolute inset-0" />
    </div>
  );
}
