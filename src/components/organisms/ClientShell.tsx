"use client";
import { useRehydrateStores } from "@/stores/hydration";
import { BrandSync } from "./BrandSync";
import { Toaster } from "./Toaster";

export function ClientShell() {
  useRehydrateStores();
  return (
    <>
      <BrandSync />
      <Toaster />
    </>
  );
}
