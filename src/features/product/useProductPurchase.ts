"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product, Variant } from "@/demo/types";
import { useCart } from "@/stores/cart";
import { useUi } from "@/stores/ui";
import type { PersonalizationDraft } from "../personalize/usePersonalizationDraft";

/**
 * "Agregar al carrito" y "Comprar ahora" desde la ficha. Si el producto es personalizable,
 * primero exige el diseño completo y la aprobación; si falta algo, lleva el foco ahí.
 */
export function useProductPurchase(product: Product, variant: Variant, quantity: number, canBuy: boolean, draft: PersonalizationDraft) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const openCart = useUi((s) => s.openCart);
  const [needApproval, setNeedApproval] = useState(false);

  const focus = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => el?.focus({ preventScroll: true }), 350);
  };

  const purchase = (mode: "cart" | "buy") => {
    if (!canBuy) return;
    if (draft.tmpl) {
      draft.touch();
      if (draft.problem) return focus(draft.tmpl.kind === "TEXT" ? "p-text" : "personalizar");
      if (!draft.approved) { setNeedApproval(true); return focus("aprobar"); }
    }
    add({ productSlug: product.slug, variantId: variant.id, quantity, personalization: draft.build() });
    setNeedApproval(false);
    if (mode === "buy") router.push("/checkout/");
    else openCart(product.slug);
  };

  return { purchase, needApproval };
}
