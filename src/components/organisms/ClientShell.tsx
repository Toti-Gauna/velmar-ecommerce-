"use client";
import { useAudioUnlock } from "@/components/atoms/SoundToggle";
import { useRouteScroll } from "@/lib/useRouteScroll";
import { useUiSounds } from "@/lib/uiSounds";
import { useRehydrateStores } from "@/stores/hydration";
import { Toaster } from "./Toaster";

export function ClientShell() {
  useRehydrateStores();
  useAudioUnlock();
  useUiSounds();
  useRouteScroll();
  return (
    <>
      <Toaster />
    </>
  );
}
