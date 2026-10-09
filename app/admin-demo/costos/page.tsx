import type { Metadata } from "next";
import { CostsTable } from "@/features/admin/workshop/CostsTable";

export const metadata: Metadata = { title: "Costos y margen" };

export default function AdminCostsPage() {
  return <CostsTable />;
}
