import type { Metadata } from "next";
import { ClaimsAdmin } from "@/features/admin/ClaimsAdmin";

export const metadata: Metadata = { title: "Reclamos" };

export default function Page() {
  return <ClaimsAdmin />;
}
