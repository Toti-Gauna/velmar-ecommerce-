import type { Metadata } from "next";
import { MaterialsTable } from "@/features/admin/workshop/MaterialsTable";

export const metadata: Metadata = { title: "Insumos" };

export default function AdminMaterialsPage() {
  return <MaterialsTable />;
}
