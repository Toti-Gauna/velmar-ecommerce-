"use client";
import { useEffect } from "react";
import { playSound, type SoundName } from "./sound";

/**
 * Sonido para todo lo que se toca (8.4.29, pedido de Ignacio: "que toda la página tenga sonidos, que se sienta una re
 * app"). Un solo listener en la ventana decide por el tipo de control, así cada botón, link, interruptor, opción o campo
 * suena sin tocar cada componente. Un elemento puede pedir otro sonido con `data-sound="…"` o ninguno con
 * `data-sound="none"`. Los momentos clave (agregar al carrito, comprar, error) los tocan sus propias acciones y tapan a
 * estos (ver la prioridad en sound-kit).
 */

/** Lo que importa del elemento tocado, leído del DOM (separado para poder probar la regla sin navegador). */
export interface TapTarget {
  tag: string;
  role: string | null;
  type: string | null;
  /** `data-sound` del control o de un contenedor. */
  sound: string | null;
  /** aria-checked antes del toque (interruptores con role="switch" o "checkbox"). */
  wasChecked: boolean;
  /** Estado de una casilla nativa después del toque. */
  checked: boolean;
  disabled: boolean;
  href: string | null;
  /** El link sale del sitio, abre otra pestaña o descarga. */
  external: boolean;
}

const CHOICE_ROLES = new Set(["radio", "tab", "option", "menuitemradio", "menuitem"]);
const SOUNDS = new Set<string>(["add", "favorite", "unfavorite", "coupon", "success", "remove", "product", "nav", "tap", "select", "toggleOn", "toggleOff", "type", "modalOpen", "modalClose", "step", "back", "up", "down", "info", "error"]);

export function soundForTap(t: TapTarget): SoundName | null {
  if (t.disabled) return null;
  if (t.sound) return t.sound !== "none" && SOUNDS.has(t.sound) ? (t.sound as SoundName) : null;
  // Una etiqueta le pasa el toque a su control, que es el que suena.
  if (t.tag === "label") return null;
  if (t.role === "switch" || t.role === "checkbox") return t.wasChecked ? "toggleOff" : "toggleOn";
  if (t.tag === "input") {
    if (t.type === "checkbox") return t.checked ? "toggleOn" : "toggleOff";
    if (t.type === "radio") return "select";
    if (t.type === "submit" || t.type === "button" || t.type === "reset") return "tap";
    return null;
  }
  if (t.role && CHOICE_ROLES.has(t.role)) return "select";
  if (t.tag === "a" && t.href !== null) return t.external || t.href.startsWith("#") ? "tap" : "nav";
  if (t.tag === "button" || t.tag === "summary" || t.role === "button") return "tap";
  return null;
}

const TYPING = new Set(["text", "search", "email", "tel", "url", "number", "date", "month", "time"]);

/** Campo donde se escribe (cada tecla suena muy suave). Contraseñas y casillas, no. */
export function isTypingField(tag: string, type: string | null, editable: boolean): boolean {
  if (editable) return true;
  if (tag === "textarea") return true;
  return tag === "input" && TYPING.has(type ?? "text");
}

const INTERACTIVE = "[data-sound], button, a[href], summary, input, select, textarea, label, [role=button], [role=switch], [role=checkbox], [role=radio], [role=tab], [role=option], [role=menuitem], [role=menuitemradio]";

function describe(target: Element): TapTarget | null {
  const el = target.closest(INTERACTIVE);
  if (!el) return null;
  const tag = el.tagName.toLowerCase();
  const a = el instanceof HTMLAnchorElement ? el : null;
  let external = false;
  if (a) {
    try { external = a.target === "_blank" || a.hasAttribute("download") || new URL(a.href, location.href).origin !== location.origin; } catch { external = true; }
  }
  return {
    tag, role: el.getAttribute("role"), type: el.getAttribute("type"),
    sound: el.closest("[data-sound]")?.getAttribute("data-sound") ?? null,
    wasChecked: el.getAttribute("aria-checked") === "true",
    checked: el instanceof HTMLInputElement && el.checked,
    disabled: el.matches(":disabled") || el.getAttribute("aria-disabled") === "true",
    href: a ? a.getAttribute("href") : null, external,
  };
}

/** Instala los listeners una vez para toda la app (tienda y panel). */
export function useUiSounds(): void {
  useEffect(() => {
    // El estado de un interruptor se lee antes de que React lo cambie (fase de captura) y suena después (burbuja), así
    // el sonido de una acción propia (ej. "agregar") ya pasó y tiene prioridad sobre el clic.
    let pending: SoundName | null = null;
    const capture = (e: MouseEvent) => {
      const t = e.target instanceof Element ? describe(e.target) : null;
      pending = t ? soundForTap(t) : null;
    };
    const bubble = () => { if (pending) playSound(pending); pending = null; };
    let lastKey = 0;
    // "input" cubre las teclas y también elegir en un desplegable (las casillas suenan por el clic).
    const input = (e: Event) => {
      const el = e.target;
      if (!(el instanceof HTMLElement)) return;
      if (el instanceof HTMLSelectElement) { playSound("select"); return; }
      if (!isTypingField(el.tagName.toLowerCase(), el.getAttribute("type"), el.isContentEditable)) return;
      const now = performance.now();
      if (now - lastKey > 45) { lastKey = now; playSound("type"); }
    };
    window.addEventListener("click", capture, true);
    window.addEventListener("click", bubble);
    window.addEventListener("input", input, true);
    return () => {
      window.removeEventListener("click", capture, true);
      window.removeEventListener("click", bubble);
      window.removeEventListener("input", input, true);
    };
  }, []);
}
