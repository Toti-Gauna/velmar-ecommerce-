import type { Metadata } from "next";
import { PaymentsQueue } from "@/features/admin/PaymentsQueue";

export const metadata: Metadata = { title: "Pagos manuales" };

export default function AdminPaymentsPage() {
  return <PaymentsQueue />;
}
