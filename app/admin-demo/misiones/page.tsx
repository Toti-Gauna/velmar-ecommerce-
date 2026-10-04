import type { Metadata } from "next";
import { MissionsAdmin } from "@/features/admin/MissionsAdmin";

export const metadata: Metadata = { title: "Misiones" };

export default function AdminMissionsPage() {
  return <MissionsAdmin />;
}
