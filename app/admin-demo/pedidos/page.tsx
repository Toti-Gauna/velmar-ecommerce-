import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { OrdersList } from "@/features/admin/OrdersList";

export const metadata: Metadata = { title: "Pedidos" };

export default function AdminOrdersPage() {
  return <Suspense fallback={<Skeleton className="h-96" />}><OrdersList /></Suspense>;
}
