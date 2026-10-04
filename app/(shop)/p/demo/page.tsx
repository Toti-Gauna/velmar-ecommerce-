import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { PanelProductView } from "@/features/product/PanelProductView";

export const metadata: Metadata = { title: "Producto (creado en el panel demo)" };

export default function PanelProductPage() {
  return (
    <div className="pb-20 md:pb-0">
      <Suspense fallback={<Skeleton className="h-96 w-full" />}><PanelProductView mode="detail" /></Suspense>
    </div>
  );
}
