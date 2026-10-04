import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminBanner } from "@/features/admin/AdminBanner";
import { AdminGate } from "@/features/admin/AdminGate";
import { AdminNav } from "@/features/admin/AdminNav";

export const metadata: Metadata = {
  title: { default: "Panel demo · datos ficticios", template: "%s · Panel demo (datos ficticios)" },
  robots: { index: false, follow: false },
};

/** Panel de DEMOSTRACIÓN: accesible sin login a propósito, datos ficticios, estado solo en este navegador. */
export default function AdminDemoLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminBanner />
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-4 px-4 pb-16 pt-4 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8 lg:pt-6">
        <AdminNav />
        <main id="contenido" className="min-w-0">
          <AdminGate>{children}</AdminGate>
        </main>
      </div>
    </>
  );
}
