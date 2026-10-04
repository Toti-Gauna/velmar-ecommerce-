import type { Metadata } from "next";
import { ProductsList } from "@/features/admin/ProductsList";

export const metadata: Metadata = { title: "Productos" };

export default function AdminProductsPage() {
  return <ProductsList />;
}
