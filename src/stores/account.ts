"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SortKey } from "@/demo/engine/catalog";
import { demoStorage, STORAGE_PREFIX } from "./storage";

/** Sesión SIMULADA: no hay autenticación ni contraseña real en la demo. */
interface AccountState {
  user: { name: string; email: string } | null;
  usedRewards: string[];
  sort: SortKey;
  /** Premio de la ruleta (un giro por navegador en la demo). */
  wheelPrize: { code: string; label: string; at: string } | null;
  setWheelPrize: (prize: { code: string; label: string; at: string }) => void;
  /** La ruleta está girando: el premio ya está guardado pero no se muestra hasta que frena (no se persiste). */
  wheelSpinning: boolean;
  setWheelSpinning: (on: boolean) => void;
  login: (user: { name: string; email: string }) => void;
  logout: () => void;
  markRewardUsed: (id: string) => void;
  setSort: (sort: SortKey) => void;
}

export const useAccount = create<AccountState>()(
  persist(
    (set) => ({
      user: null,
      usedRewards: [],
      sort: "relevance",
      wheelPrize: null,
      setWheelPrize: (wheelPrize) => set({ wheelPrize }),
      wheelSpinning: false,
      setWheelSpinning: (wheelSpinning) => set({ wheelSpinning }),
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      markRewardUsed: (id) => set((s) => ({ usedRewards: [...new Set([...s.usedRewards, id])] })),
      setSort: (sort) => set({ sort }),
    }),
    { name: `${STORAGE_PREFIX}account`, storage: demoStorage, skipHydration: true,
      partialize: ({ user, usedRewards, sort, wheelPrize }) => ({ user, usedRewards, sort, wheelPrize }) },
  ),
);
