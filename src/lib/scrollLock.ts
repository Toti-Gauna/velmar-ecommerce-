/**
 * Bloqueo del scroll de fondo mientras hay un modal abierto (8.4.11).
 *
 * `overflow: hidden` en <html> alcanza en escritorio y Android, pero Safari de iPhone y iPad lo ignora al arrastrar
 * con el dedo: la página de atrás se seguía moviendo. Por eso, además, se cancela cada `touchmove` que no caiga en
 * algo que todavía pueda desplazarse en esa dirección dentro del modal de arriba de todo (así tampoco "arrastra" la
 * página cuando la lista del modal llega a su final). No se usa `position: fixed` en <body>: movería el header y la
 * galería fijos que se ven detrás del velo.
 *
 * Lleva una pila: con una confirmación encima de un panel, el scroll vuelve recién al cerrar el último.
 */
type Layer = () => Element | null | undefined;

const layers: Layer[] = [];
let last = { x: 0, y: 0 };
/** Controles que manejan su propio arrastre adentro de un modal. */
const FREE = "input[type=range], [data-touch-free]";

function canScroll(el: Element, dx: number, dy: number) {
  const s = getComputedStyle(el);
  if (Math.abs(dy) >= Math.abs(dx)) {
    if (!/auto|scroll/.test(s.overflowY) || el.scrollHeight <= el.clientHeight + 1) return false;
    return dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0;
  }
  if (!/auto|scroll/.test(s.overflowX) || el.scrollWidth <= el.clientWidth + 1) return false;
  return dx > 0 ? el.scrollLeft + el.clientWidth < el.scrollWidth - 1 : el.scrollLeft > 0;
}

function onStart(e: TouchEvent) {
  const t = e.touches[0];
  if (t) last = { x: t.clientX, y: t.clientY };
}

function onMove(e: TouchEvent) {
  const t = e.touches[0];
  // Dos dedos: zoom de la página, que no se bloquea.
  if (!t || e.touches.length > 1) return;
  const dx = last.x - t.clientX, dy = last.y - t.clientY;
  last = { x: t.clientX, y: t.clientY };
  const top = layers.at(-1)?.();
  const target = e.target instanceof Element ? e.target : null;
  if (top && target && top.contains(target)) {
    if (target.closest(FREE)) return;
    for (let el: Element | null = target; el && el !== top.parentElement; el = el.parentElement) if (canScroll(el, dx, dy)) return;
  }
  if (e.cancelable) e.preventDefault();
}

/** Bloquea el scroll de la página; `layer` devuelve el elemento del modal (adentro se puede desplazar). */
export function lockScroll(layer: Layer): () => void {
  const html = document.documentElement;
  layers.push(layer);
  if (layers.length === 1) {
    html.style.overflow = "hidden";
    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchmove", onMove, { passive: false });
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    const i = layers.lastIndexOf(layer);
    if (i >= 0) layers.splice(i, 1);
    if (layers.length > 0) return;
    html.style.overflow = "";
    document.removeEventListener("touchstart", onStart);
    document.removeEventListener("touchmove", onMove);
  };
}
