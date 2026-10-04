"use client";
import { useRouter } from "next/navigation";
import { personalizeHref } from "@/demo/engine/catalog";
import type { Product } from "@/demo/types";
import { useCart } from "@/stores/cart";
import { useUi } from "@/stores/ui";

/** Agregado rápido: los personalizables van al personalizador; el resto suma la primera variante con stock. */
export function useQuickAdd() {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const openCart = useUi((s) => s.openCart);
  return (product: Product) => {
    if (product.personalization) return router.push(personalizeHref(product.slug));
    const variant = product.variants.find((v) => v.stock !== 0);
    if (!variant) return;
    add({ productSlug: product.slug, variantId: variant.id, quantity: 1 });
    openCart(product.slug);
  };
}
