import type { Metadata } from "next";
import { OrdersList } from "@/features/admin/OrdersList";

export const metadata: Metadata = { title: "Pedidos" };

export default function AdminOrdersPage() {
  return <OrdersList />;
}
