import type { Metadata } from "next";
import { Suspense } from "react";
import { ListSkeleton } from "@/components/atoms/Skeleton";
import { OrdersList } from "@/features/admin/OrdersList";

export const metadata: Metadata = { title: "Pedidos" };

export default function AdminOrdersPage() {
  return <Suspense fallback={<ListSkeleton rows={4} />}><OrdersList /></Suspense>;
}
