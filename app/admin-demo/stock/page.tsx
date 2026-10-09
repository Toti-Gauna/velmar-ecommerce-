import type { Metadata } from "next";
import { Suspense } from "react";
import { ListSkeleton } from "@/components/atoms/Skeleton";
import { StockTable } from "@/features/admin/stock/StockTable";

export const metadata: Metadata = { title: "Stock" };

export default function AdminStockPage() {
  return <Suspense fallback={<ListSkeleton rows={4} />}><StockTable /></Suspense>;
}
