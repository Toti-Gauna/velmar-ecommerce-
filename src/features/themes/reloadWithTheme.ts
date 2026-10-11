import { withBase } from "@/lib/base-path";
import { useThemePreview, type ThemePreview } from "@/stores/themePreview";

/**
 * Cambia la temática y recarga: la pantalla de carga de temporada sale de nuevo (carga forzada) y la paleta se
 * aplica desde el primer cuadro. `to` lleva a otra ruta (por ejemplo, del panel al inicio de la tienda).
 */
export function reloadWithTheme(id: ThemePreview, to?: string): void {
  useThemePreview.getState().setPreview(id);
  // La carga viene de adentro de la tienda: sin esta marca el splash no saldría (8.4.3, ver Splash.tsx).
  try { sessionStorage.setItem("velmar:splash", "1"); } catch { /* sin almacenamiento: entra sin splash */ }
  window.scrollTo(0, 0);
  if (to) window.location.assign(withBase(to));
  else window.location.reload();
}
