"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SeasonId } from "@/demo/types";
import { demoStorage, STORAGE_PREFIX } from "./storage";

/** "Probar temáticas": vista previa elegida en este navegador. null = la que corresponde por el panel. */
interface ThemePreviewState {
  previewId: SeasonId | null;
  setPreview: (id: SeasonId | null) => void;
}

export const useThemePreview = create<ThemePreviewState>()(
  persist(
    (set) => ({ previewId: null, setPreview: (previewId) => set({ previewId }) }),
    { name: `${STORAGE_PREFIX}theme-preview`, storage: demoStorage, skipHydration: true },
  ),
);
