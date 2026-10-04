import type { Metadata } from "next";
import { ContentAdmin } from "@/features/admin/ContentAdmin";

export const metadata: Metadata = { title: "Contenido" };

export default function Page() {
  return <ContentAdmin />;
}
