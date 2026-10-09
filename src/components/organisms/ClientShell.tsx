"use client";
import { useAudioUnlock } from "@/components/atoms/SoundToggle";
import { useRehydrateStores } from "@/stores/hydration";
import { BrandSync } from "./BrandSync";
import { Toaster } from "./Toaster";

export function ClientShell() {
  useRehydrateStores();
  useAudioUnlock();
  return (
    <>
      <BrandSync />
      <Toaster />
    </>
  );
}
