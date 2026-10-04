import type { Metadata } from "next";
import { CouponsAdmin } from "@/features/admin/CouponsAdmin";

export const metadata: Metadata = { title: "Cupones" };

export default function AdminCouponsPage() {
  return <CouponsAdmin />;
}
