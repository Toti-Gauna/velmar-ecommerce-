import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { OrderDetail } from "@/features/admin/OrderDetail";

export const metadata: Metadata = { title: "Detalle de pedido" };

export default function AdminOrderDetailPage() {
  return <Suspense fallback={<Skeleton className="h-96" />}><OrderDetail /></Suspense>;
}
