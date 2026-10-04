import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { ProductEditor } from "@/features/admin/ProductEditor";

export const metadata: Metadata = { title: "Editar producto" };

export default function AdminProductEditPage() {
  return <Suspense fallback={<Skeleton className="h-96" />}><ProductEditor /></Suspense>;
}
