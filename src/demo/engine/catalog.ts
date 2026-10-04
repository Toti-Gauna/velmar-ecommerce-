import { categories } from "../fixtures/categories";
import { products } from "../fixtures/products";
import type { Category, Product, Variant } from "../types";

export type Availability = { kind: "made-to-order"; days?: number } | { kind: "in-stock"; units: number } | { kind: "out-of-stock" };
export type SortKey = "relevance" | "price-asc" | "price-desc" | "new";

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function productsInCategory(slug: string): Product[] {
  return products.filter((p) => p.categorySlug === slug);
}

/** Categorías sin productos no aparecen. */
export function visibleCategories(): Category[] {
  return categories.filter((c) => productsInCategory(c.slug).length > 0).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function featuredCategories(): Category[] {
  return visibleCategories().filter((c) => c.featured);
}

export function bestSellers(limit = 4): Product[] {
  return [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, limit);
}

export function newArrivals(limit = 4): Product[] {
  return products.filter((p) => p.isNew).slice(0, limit);
}

export function personalizableProducts(): Product[] {
  return products.filter((p) => p.personalization);
}

export function fromPrice(product: Product): number {
  return product.basePrice + Math.min(...product.variants.map((v) => v.priceDelta));
}

export function unitPrice(product: Product, variant: Variant, withPersonalization: boolean): number {
  const surcharge = withPersonalization ? (product.personalization?.surcharge ?? 0) : 0;
  return product.basePrice + variant.priceDelta + surcharge;
}

export function availability(product: Product, variant: Variant): Availability {
  if (variant.stock < 0) return { kind: "made-to-order", days: product.madeToOrderDays };
  if (variant.stock === 0) return { kind: "out-of-stock" };
  return { kind: "in-stock", units: variant.stock };
}

export function isPurchasable(variant: Variant, quantity: number): boolean {
  return variant.stock < 0 || variant.stock >= quantity;
}

export function maxQuantity(variant: Variant): number {
  return variant.stock < 0 ? 10 : Math.min(10, variant.stock);
}

export function sortProducts(list: Product[], sort: SortKey): Product[] {
  const copy = [...list];
  if (sort === "price-asc") return copy.sort((a, b) => fromPrice(a) - fromPrice(b));
  if (sort === "price-desc") return copy.sort((a, b) => fromPrice(b) - fromPrice(a));
  if (sort === "new") return copy.sort((a, b) => Number(b.isNew) - Number(a.isNew));
  return copy.sort((a, b) => Number(b.featured) - Number(a.featured) || b.soldCount - a.soldCount);
}

export function findVariant(product: Product, color?: string, size?: string): Variant | undefined {
  return product.variants.find((v) => (color === undefined || v.color === color) && (size === undefined || v.size === size));
}

export function variantOptions(product: Product): { colors: { name: string; hex?: string }[]; sizes: string[] } {
  const colors = new Map<string, string | undefined>();
  const sizes = new Set<string>();
  for (const v of product.variants) {
    if (v.color) colors.set(v.color, v.colorHex);
    if (v.size) sizes.add(v.size);
  }
  return { colors: [...colors].map(([name, hex]) => ({ name, hex })), sizes: [...sizes] };
}
