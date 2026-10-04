import "@fontsource-variable/nunito";
import "@fontsource/caveat/600.css";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import type { CSSProperties, ReactNode } from "react";
import { brand, brandCssVariables } from "@/config/brand";
import { site } from "@/config/site";
import { SITE_URL } from "@/lib/base-path";
import { ClientShell } from "@/components/organisms/ClientShell";
import { Splash, splashScript } from "@/components/organisms/Splash";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: site.title, template: `%s · ${brand.name} (demo)` },
  description: site.description,
  robots: site.indexable ? undefined : { index: false, follow: false },
  openGraph: {
    type: "website", locale: "es_AR", siteName: brand.name, title: site.title, description: site.description,
    images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: `${brand.name}, tienda online (demo)` }],
  },
};

export const viewport: Viewport = { themeColor: brand.colors.primary, width: "device-width", initialScale: 1 };

/** Datos estructurados solo con campos confirmados (nombre, ciudad, Instagram). */
const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: brand.name,
  address: { "@type": "PostalAddress", addressLocality: brand.city, addressCountry: "AR" },
  sameAs: brand.instagram ? [`https://instagram.com/${brand.instagram}`] : [],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-AR" suppressHydrationWarning style={brandCssVariables() as CSSProperties}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: splashScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />
      </head>
      <body className="min-h-dvh antialiased">
        <Splash />
        <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary">
          Saltar al contenido
        </a>
        {children}
        <ClientShell />
      </body>
    </html>
  );
}
