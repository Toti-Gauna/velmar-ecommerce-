"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAccount } from "@/stores/account";
import { useHydrated } from "@/stores/hydration";

/** 8.4.7: desde el detalle de un pedido se vuelve a "Mis pedidos" de la cuenta (con la sesión abierta). */
export function BackToOrders() {
  const hydrated = useHydrated();
  const user = useAccount((s) => s.user);
  if (!hydrated || !user) return null;
  return (
    <Link href="/cuenta/#pedidos" className="mb-3 inline-flex min-h-11 items-center gap-2 rounded-full pr-3 text-sm font-bold text-primary hover:underline">
      <ArrowLeft size={16} aria-hidden="true" /> Volver a Mis pedidos
    </Link>
  );
}
