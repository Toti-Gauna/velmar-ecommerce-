import Link from "next/link";
import type { ArtKey } from "@/demo/types";
import { Badge } from "@/components/atoms/Badge";
import { Price } from "@/components/atoms/Price";
import { ProductArt } from "@/components/illustrations/ProductArt";

export interface ProductCardData {
  slug: string;
  name: string;
  short: string;
  art: ArtKey;
  tint?: string;
  fromPrice: number;
  hasRange: boolean;
  isNew: boolean;
  madeToOrder: boolean;
  personalizable: boolean;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <article className="group relative flex flex-col gap-2">
      <div className="relative overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
        <ProductArt art={product.art} tint={product.tint} label={product.name} className="aspect-square transition-transform duration-300 group-hover:scale-[1.03]" />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {product.isNew && <Badge tone="brand">Nuevo</Badge>}
          {product.personalizable && <Badge>Personalizable</Badge>}
        </div>
      </div>
      <h3 className="text-[15px] font-bold leading-snug text-ink">
        <Link href={`/p/${product.slug}/`} className="after:absolute after:inset-0 focus-visible:outline-none">
          {product.name}
        </Link>
      </h3>
      <p className="-mt-1 line-clamp-1 text-sm text-muted">{product.short}</p>
      <div className="flex flex-col gap-0.5">
        <Price amount={product.fromPrice} prefix={product.hasRange ? "desde" : undefined} size="sm" />
        {product.madeToOrder && <span className="text-xs font-semibold text-muted">Hecho a pedido</span>}
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <li key={p.slug} className="animate-fade-up">
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}
