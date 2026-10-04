import type { Metadata } from "next";
import { SettingsAdmin } from "@/features/admin/SettingsAdmin";

export const metadata: Metadata = { title: "Ajustes" };

export default function Page() {
  return <SettingsAdmin />;
}
