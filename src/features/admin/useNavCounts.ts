"use client";
import { useAdmin } from "@/stores/admin";
import { useHydrated } from "@/stores/hydration";
import type { NavBadge } from "./nav";

const IN_PROGRESS = new Set(["PAID", "IN_PRODUCTION", "READY", "SHIPPED"]);

/** Contadores de la navegación: pedidos en marcha, comprobantes por revisar y reclamos abiertos. */
export function useNavCounts(): Record<NavBadge, number> {
  const hydrated = useHydrated();
  const orders = useAdmin((s) => s.orders);
  const claims = useAdmin((s) => s.claims);
  if (!hydrated) return { orders: 0, payments: 0, claims: 0 };
  return {
    orders: orders.filter((o) => IN_PROGRESS.has(o.status)).length,
    payments: orders.filter((o) => o.status === "PAYMENT_REVIEW").length,
    claims: claims.filter((c) => c.status === "OPEN" || c.status === "IN_PROGRESS").length,
  };
}
