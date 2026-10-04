import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { PageHeader } from "@/components/templates/PageHeader";
import { getProduct, personalizableProducts } from "@/demo/engine/catalog";
import { Personalizer } from "@/features/personalize/Personalizer";

export const dynamicParams = false;

export function generateStaticParams() {
  return personalizableProducts().map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).slug);
  return product ? { title: `Personalizar ${product.name}` } : {};
}

export default async function PersonalizePage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product?.personalization) notFound();
  return (
    <div className="pb-16 md:pb-0">
      <PageHeader title={`Personalizá: ${product.name}`} crumbs={[{ href: "/crear/", label: "Crear" }, { href: `/p/${product.slug}/`, label: product.name }]}>
        Armá tu pieza, mirá la vista previa y aprobala. Nada se fabrica ni se cobra en esta demo.
      </PageHeader>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <Personalizer product={product} />
      </Suspense>
    </div>
  );
}
