"use client";
import { useAudioUnlock } from "@/components/atoms/SoundToggle";
import { useRouteScroll } from "@/lib/useRouteScroll";
import { useRehydrateStores } from "@/stores/hydration";
import { BrandSync } from "./BrandSync";
import { Toaster } from "./Toaster";

export function ClientShell() {
  useRehydrateStores();
  useAudioUnlock();
  useRouteScroll();
  return (
    <>
      <BrandSync />
      <Toaster />
    </>
  );
}
