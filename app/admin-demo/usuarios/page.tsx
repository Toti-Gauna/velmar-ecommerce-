import type { Metadata } from "next";
import { UsersAdmin } from "@/features/admin/UsersAdmin";

export const metadata: Metadata = { title: "Usuarios" };

export default function Page() {
  return <UsersAdmin />;
}
