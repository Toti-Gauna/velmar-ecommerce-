"use client";
import { create } from "zustand";

/** Estado efímero de la interfaz (no se persiste). */
interface UiState {
  cartOpen: boolean;
  menuOpen: boolean;
  wheelOpen: boolean;
  lastAdded: string | null;
  openCart: (lastAdded?: string) => void;
  closeCart: () => void;
  setMenu: (open: boolean) => void;
  setWheel: (open: boolean) => void;
}

export const useUi = create<UiState>()((set) => ({
  cartOpen: false,
  menuOpen: false,
  wheelOpen: false,
  lastAdded: null,
  openCart: (lastAdded) => set({ cartOpen: true, menuOpen: false, lastAdded: lastAdded ?? null }),
  closeCart: () => set({ cartOpen: false, lastAdded: null }),
  setMenu: (menuOpen) => set({ menuOpen }),
  setWheel: (wheelOpen) => set({ wheelOpen, menuOpen: false }),
}));
