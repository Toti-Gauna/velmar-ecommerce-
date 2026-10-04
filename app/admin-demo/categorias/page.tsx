import type { Metadata } from "next";
import { CategoriesAdmin } from "@/features/admin/CategoriesAdmin";

export const metadata: Metadata = { title: "Categorías y personalización" };

export default function AdminCategoriesPage() {
  return <CategoriesAdmin />;
}
