/**
 * Configuración de marca del cliente. En producción sale de la tabla `Setting`
 * y se aplica como variables CSS sin deploy. Acá vive la versión de demo.
 *
 * Paleta PROVISIONAL: derivada del logo (dos chevrones verde oliva sobre blanco)
 * y de las fotos de Instagram (madera clara). No es identidad final confirmada.
 */
export interface BrandConfig {
  name: string;
  tagline: string;
  city: string;
  instagram: string | null;
  /** Número en formato internacional sin "+". null = no confirmado: el CTA abre WhatsApp sin destinatario. */
  whatsappNumber: string | null;
  email: string | null;
  legalName: string | null;
  cuit: string | null;
  paletteStatus: "provisional" | "confirmada";
  colors: {
    primary: string;
    primaryHover: string;
    onPrimary: string;
    accent: string;
    wood: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
  };
  fontFamily: string;
}

export const brand: BrandConfig = {
  name: "Velmar",
  tagline: "Objetos hechos a pedido para tu casa y tu mascota",
  city: "Mar del Plata",
  instagram: "velmar_mdp",
  whatsappNumber: null,
  email: null,
  legalName: null,
  cuit: null,
  paletteStatus: "provisional",
  colors: {
    primary: "#3d4a2a",
    primaryHover: "#2c361e",
    onPrimary: "#ffffff",
    accent: "#ede0c6",
    wood: "#c9a77a",
    background: "#fbf8f2",
    surface: "#ffffff",
    text: "#23251d",
    muted: "#5b5e4f",
    border: "#e4dccb",
  },
  fontFamily: "'Nunito Variable', ui-rounded, system-ui, sans-serif",
};

/** Variables CSS que consumen los tokens de Tailwind (ver app/globals.css). */
export function brandCssVariables(config: BrandConfig = brand): Record<string, string> {
  const c = config.colors;
  return {
    "--brand-primary": c.primary,
    "--brand-primary-hover": c.primaryHover,
    "--brand-on-primary": c.onPrimary,
    "--brand-accent": c.accent,
    "--brand-wood": c.wood,
    "--brand-background": c.background,
    "--brand-surface": c.surface,
    "--brand-text": c.text,
    "--brand-muted": c.muted,
    "--brand-border": c.border,
    "--brand-font": config.fontFamily,
  };
}
