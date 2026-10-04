"use client";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button, ButtonLink } from "@/components/atoms/Button";
import { Price } from "@/components/atoms/Price";
import { AvailabilityNote } from "@/components/molecules/AvailabilityNote";
import { FaqList } from "@/components/molecules/FaqList";
import { QuantityStepper } from "@/components/molecules/QuantityStepper";
import { VariantPicker } from "@/components/molecules/VariantPicker";
import { ProductGallery } from "@/components/organisms/ProductGallery";
import { availability, isPurchasable, maxQuantity, personalizeHref, unitPrice } from "@/demo/engine/catalog";
import type { Product } from "@/demo/types";
import { withoutNationalTaxes } from "@/lib/money";
import { useDemoData } from "@/stores/admin";
import { useCart } from "@/stores/cart";
import { useToasts } from "@/stores/toast";
import { useVariantSelection } from "./useVariantSelection";

const KIND_LABEL = { TEXT: "texto, fuente y color", PHOTO: "tu foto con encuadre y zoom", PHOTO_REFERENCE: "tu foto de referencia y notas" };

export function ProductDetail({ product: initial }: { product: Product }) {
  const product = useDemoData((d) => d.products.find((p) => p.slug === initial.slug)) ?? initial;
  const settings = useDemoData((d) => d.settings);
  const sel = useVariantSelection(product);
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const toast = useToasts((s) => s.push);
  const price = unitPrice(product, sel.variant, false);
  const avail = availability(product, sel.variant);
  const max = maxQuantity(sel.variant);
  const quantity = Math.min(qty, Math.max(1, max));
  const inactive = product.active === false;
  const canBuy = !inactive && isPurchasable(sel.variant, quantity);
  const tmpl = product.personalization;

  const addToCart = () => {
    add({ productSlug: product.slug, variantId: sel.variant.id, quantity });
    toast({ tone: "success", title: "Agregado al carrito", description: `${quantity} × ${product.name} (${sel.variant.label})`, action: { label: "Ver carrito", href: "/carrito/" } });
  };

  const cta = tmpl ? (
    <ButtonLink href={personalizeHref(product.slug, sel.variant.id)} size="lg" className="w-full" aria-disabled={!canBuy} tabIndex={canBuy ? undefined : -1}>
      <Sparkles size={18} aria-hidden="true" /> Personalizar<span className="max-sm:sr-only"> y ver vista previa</span>
    </ButtonLink>
  ) : (
    <Button size="lg" className="w-full" disabled={!canBuy} onClick={addToCart}>Agregar al carrito</Button>
  );

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-10">
      <ProductGallery art={product.art} views={product.gallery} tint={sel.variant.colorHex} name={product.name} photoUrl={product.photoDataUrl} alt={product.imageAlt} />
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-1.5">
            {product.isNew && <Badge tone="brand">Nuevo</Badge>}
            {tmpl && <Badge>Personalizable: {KIND_LABEL[tmpl.kind]}</Badge>}
          </div>
          <h1 className="text-3xl font-extrabold leading-tight">{product.name}</h1>
          <p className="text-muted">{product.description}</p>
        </div>
        <div className="flex flex-col gap-1">
          <Price amount={price} withoutTaxes={withoutNationalTaxes(price, settings.nationalTaxRate)} size="lg" />
          {tmpl && tmpl.surcharge > 0 && <p className="text-sm text-muted">+ ${tmpl.surcharge.toLocaleString("es-AR")} por personalización</p>}
          <p className="text-sm font-semibold text-success">{settings.transferDiscountPct}% off pagando con transferencia o QR</p>
          <p className="text-xs text-muted">Precio de muestra para la demo.</p>
        </div>
        {sel.colorOptions.length > 0 && <VariantPicker legend="Color" options={sel.colorOptions} value={sel.color} onChange={sel.chooseColor} swatches />}
        {sel.sizeOptions.length > 0 && <VariantPicker legend="Opción" options={sel.sizeOptions} value={sel.size} onChange={sel.chooseSize} />}
        {inactive ? (
          <p role="status" className="rounded-2xl bg-warning-soft p-3 text-sm font-bold text-warning">Este producto está pausado desde el panel demo y no se puede comprar.</p>
        ) : (
          <AvailabilityNote availability={avail} />
        )}
        {!tmpl && <QuantityStepper label="Cantidad" value={quantity} max={Math.max(1, max)} onChange={setQty} />}
        <div className="hidden md:block">{cta}</div>
        <section aria-labelledby="faq">
          <h2 id="faq" className="mb-3 text-lg font-extrabold">Preguntas frecuentes</h2>
          <FaqList faqs={product.faqs} />
        </section>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center gap-3 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur md:hidden">
        <Price amount={price} size="sm" className="shrink-0" />
        <div className="flex-1">{cta}</div>
      </div>
    </div>
  );
}
