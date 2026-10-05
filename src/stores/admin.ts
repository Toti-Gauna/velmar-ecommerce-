"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createDataActions, type DataActions } from "@/demo/admin/data-slice";
import { auditEntry, defaultAdminData, type AdminData } from "@/demo/admin/defaults";
import { createOrdersActions, type OrdersActions } from "@/demo/admin/orders-slice";
import type { AdminClaim } from "@/demo/admin/types";
import { setDemoData, type DemoData } from "@/demo/engine/source";
import { demoStorage, STORAGE_PREFIX } from "./storage";

export type AdminState = AdminData & OrdersActions & DataActions & {
  addClaim: (claim: Omit<AdminClaim, "id" | "status" | "createdAt">) => void;
  resetAdmin: () => void;
};

/**
 * Estado del PANEL DEMO: solo en este navegador. No hay login, API ni base de datos.
 * La tienda lee `data` (catálogo, cupones, misiones, ajustes, contenido) para reflejar los cambios.
 */
export const useAdmin = create<AdminState>()(
  persist(
    (set) => ({
      ...defaultAdminData(),
      ...createOrdersActions(set),
      ...createDataActions(set),
      addClaim: (claim) =>
        set((s) => ({
          claims: [{ ...claim, id: `c-${Date.now().toString(36)}`, status: "OPEN", createdAt: new Date().toISOString(), fromShop: true }, ...s.claims],
          audit: [auditEntry("Arrepentimiento recibido desde la tienda", claim.code), ...s.audit],
        })),
      resetAdmin: () => set(defaultAdminData()),
    }),
    {
      name: `${STORAGE_PREFIX}admin`,
      version: 3,
      storage: demoStorage,
      skipHydration: true,
      // Versiones viejas de la demo: se descartan y vuelven a los fixtures.
      migrate: () => defaultAdminData(),
      // Campos nuevos de `data` toman el valor por defecto si el estado guardado no los tiene.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AdminData>;
        return { ...current, ...p, data: { ...current.data, ...(p.data ?? {}) } };
      },
      partialize: (s) => ({ data: s.data, orders: s.orders, users: s.users, claims: s.claims, audit: s.audit }),
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
