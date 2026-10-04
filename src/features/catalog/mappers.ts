import type { ProductCardData } from "@/components/molecules/ProductCard";
import { fromPrice, productHref } from "@/demo/engine/catalog";
import type { Product } from "@/demo/types";

export function toCard(product: Product): ProductCardData {
  const deltas = new Set(product.variants.map((v) => v.priceDelta));
  return {
    slug: product.slug,
    href: productHref(product.slug),
    photoUrl: product.photoDataUrl,
    alt: product.imageAlt || product.name,
    name: product.name,
    short: product.short,
    art: product.art,
    tint: product.variants[0]?.colorHex,
    fromPrice: fromPrice(product),
    hasRange: deltas.size > 1 || Boolean(product.personalization?.surcharge),
    isNew: product.isNew,
    madeToOrder: product.variants.every((v) => v.stock < 0),
    personalizable: Boolean(product.personalization),
  };
}
