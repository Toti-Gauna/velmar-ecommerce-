"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useHydrated } from "@/stores/hydration";
import { Sheet } from "@/components/motion/Sheet";
import { AdminGate } from "./AdminGate";
import { AdminSidebar, SidebarContent } from "./AdminSidebar";
import { AdminTabBar } from "./AdminTabBar";
import { AdminTopbar } from "./AdminTopbar";
import { AdminTour } from "./tour/AdminTour";
import { tourSeen } from "./tour/steps";

/** Estructura del panel: barra lateral fija (escritorio), barra superior y pestañas inferiores + menú (celular). */
export function AdminShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tour, setTour] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useHydrated();
  const onDashboard = pathname.replace(/\/$/, "") === "/admin-demo";
  // Primera sesión: la guía arranca sola en el inicio del panel (una vez por navegador).
  useEffect(() => {
    if (!hydrated || !onDashboard || tourSeen()) return;
    const t = window.setTimeout(() => setTour(true), 700);
    return () => window.clearTimeout(t);
  }, [hydrated, onDashboard]);
  const openTour = () => {
    setMenuOpen(false);
    if (!onDashboard) router.push("/admin-demo/");
    window.setTimeout(() => setTour(true), onDashboard ? 0 : 900);
  };
  return (
    <div className="flex min-h-dvh">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar onMenu={() => setMenuOpen(true)} onHelp={openTour} />
        <main id="contenido" className="mx-auto w-full min-w-0 max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-16 lg:pt-8">
          <AdminGate>{children}</AdminGate>
        </main>
      </div>
      <AdminTabBar onMore={() => setMenuOpen(true)} moreOpen={menuOpen} />
      {tour && <AdminTour onClose={() => setTour(false)} />}
      <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} title="Menú del panel" side="left" className="max-w-[min(88vw,320px)] bg-night">
        <SidebarContent layoutKey="mobile" onNavigate={() => setMenuOpen(false)} />
      </Sheet>
    </div>
  );
}
