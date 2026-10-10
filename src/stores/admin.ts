"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createCatalogActions, type CatalogActions } from "@/demo/admin/catalog-slice";
import { createDataActions, type DataActions } from "@/demo/admin/data-slice";
import { auditEntry, defaultAdminData, type AdminData } from "@/demo/admin/defaults";
import { createOrdersActions, type OrdersActions } from "@/demo/admin/orders-slice";
import { withCurrentCollarSpec } from "@/demo/admin/templates";
import type { AdminClaim } from "@/demo/admin/types";
import { createWorkshopActions, type WorkshopActions } from "@/demo/admin/workshop-slice";
import { createEmailActions, type EmailActions } from "@/demo/admin/emails-slice";
import { setDemoData, type DemoData } from "@/demo/engine/source";
import { ADMIN_STORE_VERSION, demoStorage, STORAGE_PREFIX } from "./storage";

export type AdminState = AdminData & OrdersActions & DataActions & CatalogActions & WorkshopActions & EmailActions & {
  addClaim: (claim: Omit<AdminClaim, "id" | "status" | "createdAt">) => void;
  resetAdmin: () => void;
};

/**
 * Estado del PANEL DEMO: solo en este navegador. No hay login, API ni base de datos.
 * La tienda lee `data` (catálogo, cupones, misiones, ajustes, contenido) para reflejar los cambios.
 */
export const useAdmin = create<AdminState>()(
  persist(
    (set, get) => ({
      ...defaultAdminData(),
      ...createOrdersActions(set, get),
      ...createDataActions(set),
      ...createCatalogActions(set),
      ...createWorkshopActions(set),
      ...createEmailActions(set, get),
      addClaim: (claim) =>
        set((s) => ({
          claims: [{ ...claim, id: `c-${Date.now().toString(36)}`, status: "OPEN", createdAt: new Date().toISOString(), fromShop: true }, ...s.claims],
          audit: [auditEntry("Arrepentimiento recibido desde la tienda", claim.code), ...s.audit],
        })),
      resetAdmin: () => set(defaultAdminData()),
    }),
    {
      name: `${STORAGE_PREFIX}admin`,
      // v4: taller (fechas comprometidas, etapas, insumos, recetas y fichas). v5: configurador del collar (producto nuevo).
      // v6: temáticas de la Fase 5 (Orgullo en lugar de San Patricio y fechas patrias, con sus cupones).
      // Al cambiar de versión la demo vuelve a los datos de muestra.
      version: ADMIN_STORE_VERSION,
      storage: demoStorage,
      skipHydration: true,
      // Versiones viejas de la demo: se descartan y vuelven a los fixtures.
      migrate: () => defaultAdminData(),
      // Campos nuevos de `data` toman el valor por defecto si el estado guardado no los tiene; la configuración del
      // collar siempre es la del código.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AdminData>;
        return { ...current, ...p, data: withCurrentCollarSpec({ ...current.data, ...(p.data ?? {}) }), workshop: { ...current.workshop, ...(p.workshop ?? {}) }, emails: { ...current.emails, ...(p.emails ?? {}) } };
      },
      partialize: (s) => ({ data: s.data, orders: s.orders, users: s.users, claims: s.claims, audit: s.audit, lastImport: s.lastImport, workshop: s.workshop, emails: s.emails }),
    },
  ),
);

// El engine (sin React) lee siempre la versión vigente.
setDemoData(useAdmin.getState().data);
useAdmin.subscribe((s) => setDemoData(s.data));

/** Lectura reactiva de los datos editables desde componentes de la tienda o del panel. */
export function useDemoData<T>(selector: (d: DemoData) => T): T {
  return useAdmin((s) => selector(s.data));
}

/** Re-render cuando cambia cualquier dato editable; el engine ya lee la versión nueva. */
export function useDemoVersion(): DemoData {
  return useAdmin((s) => s.data);
}
