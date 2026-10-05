"use client";
import { useState, type ReactNode } from "react";
import { Sheet } from "@/components/motion/Sheet";
import { AdminGate } from "./AdminGate";
import { AdminSidebar, SidebarContent } from "./AdminSidebar";
import { AdminTabBar } from "./AdminTabBar";
import { AdminTopbar } from "./AdminTopbar";

/** Estructura del panel: barra lateral fija (escritorio), barra superior y pestañas inferiores + menú (celular). */
export function AdminShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="flex min-h-dvh">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar onMenu={() => setMenuOpen(true)} />
        <main id="contenido" className="mx-auto w-full min-w-0 max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-16 lg:pt-8">
          <AdminGate>{children}</AdminGate>
        </main>
      </div>
      <AdminTabBar onMore={() => setMenuOpen(true)} moreOpen={menuOpen} />
      <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} title="Menú del panel" side="left" className="max-w-[min(88vw,320px)] bg-night">
        <SidebarContent layoutKey="mobile" onNavigate={() => setMenuOpen(false)} />
      </Sheet>
    </div>
  );
}
