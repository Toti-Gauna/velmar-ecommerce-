/** Pasos de la guía del panel. `target` es un `data-tour`; sin target, la tarjeta va centrada. */
export interface TourStep {
  target?: string;
  title: string;
  text: string;
}

export const ADMIN_TOUR: TourStep[] = [
  { title: "Bienvenido al panel de Velmar", text: "Es una demo con datos ficticios: podés tocar todo sin miedo. Te muestro en 1 minuto dónde está cada cosa." },
  { target: "nav", title: "Todas las secciones", text: "Pedidos, pagos, productos, cupones, misiones y más. Los números marcan lo que necesita tu atención." },
  { target: "kpis", title: "Cómo viene la semana", text: "Ventas de los últimos 7 días contra la semana anterior, ticket promedio y comprobantes por verificar." },
  { target: "pipeline", title: "Pedidos por estado", text: "Cada etapa abre la lista filtrada. Así ves de un vistazo qué hay que producir, embalar o enviar." },
  { target: "proofs", title: "Comprobantes por revisar", text: "Transferencias y QR esperan tu aprobación. Nada pasa a “Pagado” sin que lo confirmes vos." },
  { target: "reset", title: "Volver a empezar", text: "“Reiniciar demo” devuelve tienda y panel a los datos de muestra. Los cambios viven solo en este navegador." },
  { target: "help", title: "¡Listo!", text: "Podés volver a ver esta guía cuando quieras desde este botón." },
];

const KEY = "velmar-tour:admin";

export function tourSeen(): boolean {
  try { return window.localStorage.getItem(KEY) === "done"; } catch { return true; }
}

export function markTourSeen(): void {
  try { window.localStorage.setItem(KEY, "done"); } catch { /* modo privado: se vuelve a mostrar, no pasa nada */ }
}
