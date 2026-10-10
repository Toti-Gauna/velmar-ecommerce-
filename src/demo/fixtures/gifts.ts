import type { Gift } from "../engine/gifts";

/**
 * Regalo de muestra que espera sin abrir en la cuenta demo (Sofía), para mostrar la apertura sin comprar antes.
 * Personas y mensaje ficticios.
 */
export const demoGifts: Gift[] = [
  {
    code: "REGALO-P3XE-1KCP",
    from: "Lucía",
    to: "Sofía",
    toEmail: "sofia.demo@ejemplo.com",
    message: "¡Feliz día, ma! Para que Toto pasee con su nombre. Te quiero mucho.",
    occasion: "dia-de-la-madre",
    item: { slug: "collar-con-nombre", name: "Collar con nombre y dijes de patita", variant: "Talle M", detail: "Nombre: TOTO" },
    createdAt: "2026-10-02T15:30:00.000Z",
    eta: "2026-10-16",
  },
];
