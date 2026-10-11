import type { Metadata } from "next";
import { PageHeader } from "@/components/templates/PageHeader";
import { AccountView } from "@/features/account/AccountView";

export const metadata: Metadata = { title: "Mi cuenta (demo)" };

export default function AccountPage() {
  return (
    <>
      <PageHeader title="Mi cuenta">Pedidos, regalos, misiones, premios, direcciones, mascotas y tarjetas (datos de muestra).</PageHeader>
      <AccountView />
    </>
  );
}
