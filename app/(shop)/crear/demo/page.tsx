import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { PanelProductView } from "@/features/product/PanelProductView";

export const metadata: Metadata = { title: "Personalizar (producto del panel demo)" };

export default function PanelPersonalizePage() {
  return (
    <div className="pb-36 sm:pb-0">
      <Suspense fallback={<Skeleton className="h-96 w-full" />}><PanelProductView mode="personalize" /></Suspense>
    </div>
  );
}
