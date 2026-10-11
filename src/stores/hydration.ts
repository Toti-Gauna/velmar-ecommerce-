"use client";
import { useEffect, useSyncExternalStore } from "react";
import { useAccount } from "./account";
import { useAdmin } from "./admin";
import { useCart } from "./cart";
import { useCheckout } from "./checkout";
import { useFavorites } from "./favorites";
import { useGifts } from "./gifts";
import { useProfile } from "./profile";
import { useTablePrefs } from "./tablePrefs";
import { useThemePreview } from "./themePreview";

let hydrated = false;
const listeners = new Set<() => void>();

/** Rehidrata los stores después del primer render para evitar diferencias con el HTML estático. */
export function useRehydrateStores(): void {
  useEffect(() => {
    if (hydrated) return;
    Promise.all([useCart.persist.rehydrate(), useCheckout.persist.rehydrate(), useAccount.persist.rehydrate(), useAdmin.persist.rehydrate(), useFavorites.persist.rehydrate(), useGifts.persist.rehydrate(), useProfile.persist.rehydrate(), useThemePreview.persist.rehydrate(), useTablePrefs.persist.rehydrate()]).finally(() => {
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
