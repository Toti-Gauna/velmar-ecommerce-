"use client";
import { useRehydrateStores } from "@/stores/hydration";
import { Toaster } from "./Toaster";
import { WhatsAppFab } from "./WhatsAppFab";

export function ClientShell() {
  useRehydrateStores();
  return (
    <>
      <Toaster />
      <WhatsAppFab />
    </>
  );
}
