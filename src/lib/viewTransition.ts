/**
 * La imagen de la tarjeta tocada "vuela" hasta la galería de la ficha (View Transitions). El nombre se pone solo
 * en esa tarjeta y en el momento del toque: un producto repetido en dos rieles no duplica el nombre (si se
 * duplicara, el navegador cancela la transición). La galería de la ficha actual se desmarca para lo mismo.
 */
export function markProductHero(card: Element | null | undefined): void {
  if (typeof document === "undefined" || !("startViewTransition" in document)) return;
  const visual = card?.querySelector<HTMLElement>("[data-card-visual]");
  if (!visual) return;
  document.querySelectorAll<HTMLElement>("[data-vt-hero]").forEach((el) => { el.style.viewTransitionName = "none"; });
  visual.style.viewTransitionName = "product-hero";
  window.setTimeout(() => { visual.style.viewTransitionName = ""; }, 1200);
}
