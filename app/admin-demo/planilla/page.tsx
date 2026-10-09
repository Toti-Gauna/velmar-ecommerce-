import type { Metadata } from "next";
import { SpreadsheetView } from "@/features/admin/sheet/SpreadsheetView";

export const metadata: Metadata = { title: "Planilla" };

export default function AdminSheetPage() {
  return <SpreadsheetView />;
}
