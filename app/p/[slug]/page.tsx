import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/molecules/ProductCard";
import { Breadcrumbs } from "@/components/templates/PageHeader";
import { getCategory, getProduct, productsInCategory } from "@/demo/engine/catalog";
import { products } from "@/demo/fixtures/products";
import { toCard } from "@/features/catalog/mappers";
import { ProductDetail } from "@/features/product/ProductDetail";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).slug);
  return product ? { title: product.name, description: product.short, openGraph: { title: product.name, description: product.description } } : {};
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const category = getCategory(product.categorySlug);
  const related = productsInCategory(product.categorySlug).filter((p) => p.slug !== slug).slice(0, 4);
  return (
    <div className="pb-20 md:pb-0">
      <div className="mb-4"><Breadcrumbs crumbs={category ? [{ href: `/c/${category.slug}/`, label: category.name }] : []} /></div>
      <ProductDetail product={product} />
      {related.length > 0 && (
        <section aria-labelledby="relacionados" className="mt-14">
          <h2 id="relacionados" className="mb-4 text-xl font-extrabold">También te puede gustar</h2>
          <ProductGrid products={related.map(toCard)} />
        </section>
      )}
    </div>
  );
}
