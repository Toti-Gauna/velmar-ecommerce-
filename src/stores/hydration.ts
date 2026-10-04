"use client";
import { useEffect, useSyncExternalStore } from "react";
import { useAccount } from "./account";
import { useAdmin } from "./admin";
import { useCart } from "./cart";
import { useCheckout } from "./checkout";
import { clearDemoStorage } from "./storage";

let hydrated = false;
const listeners = new Set<() => void>();

/** Rehidrata los stores después del primer render para evitar diferencias con el HTML estático. */
export function useRehydrateStores(): void {
  useEffect(() => {
    if (hydrated) return;
    Promise.all([useCart.persist.rehydrate(), useCheckout.persist.rehydrate(), useAccount.persist.rehydrate(), useAdmin.persist.rehydrate()]).finally(() => {
      hydrated = true;
      listeners.forEach((l) => l());
    });
  }, []);
}

export function useHydrated(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => hydrated,
    () => false,
  );
}

/** Reinicia tienda y panel demo a los fixtures. */
export function resetDemo(): void {
  useCart.getState().clear();
  useCheckout.getState().reset();
  useAccount.setState({ user: null, usedRewards: [], sort: "relevance" });
  useAdmin.getState().resetAdmin();
  clearDemoStorage();
}
