"use client";
import { ShieldCheck, Sparkles, Undo2, Eye } from "lucide-react";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/atoms/Button";
import { QuantityStepper } from "@/components/molecules/QuantityStepper";
import { StockMeter } from "@/components/molecules/StockMeter";
import { VariantPicker } from "@/components/molecules/VariantPicker";
import { ProductGallery } from "@/components/organisms/ProductGallery";
import { availability, getCategory, isPurchasable, maxQuantity, personalizeHref, unitPrice } from "@/demo/engine/catalog";
import type { Product } from "@/demo/types";
import { formatARS, withoutNationalTaxes } from "@/lib/money";
import { useDemoData } from "@/stores/admin";
import { useCart } from "@/stores/cart";
import { useUi } from "@/stores/ui";
import { DeliveryEstimate } from "./DeliveryEstimate";
import { MissionChip } from "./MissionChip";
import { ProductAccordions } from "./ProductAccordions";
import { useVariantSelection } from "./useVariantSelection";

const KIND_LABEL = { TEXT: "Personalizable con nombre", PHOTO: "Personalizable con tu foto", PHOTO_REFERENCE: "Pintado desde tu foto" };

export function ProductDetail({ product: initial }: { product: Product }) {
  const product = useDemoData((d) => d.products.find((p) => p.slug === initial.slug)) ?? initial;
  const settings = useDemoData((d) => d.settings);
  const sel = useVariantSelection(product);
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const openCart = useUi((s) => s.openCart);
  const tmpl = product.personalization;
  const price = unitPrice(product, sel.variant, Boolean(tmpl));
  const avail = availability(product, sel.variant);
  const max = Math.max(1, maxQuantity(sel.variant));
  const quantity = Math.min(qty, max);
  const inactive = product.active === false;
  const canBuy = !inactive && isPurchasable(sel.variant, quantity);
  const transferPrice = Math.round(price * (1 - settings.transferDiscountPct / 100));
  const category = getCategory(product.categorySlug);

  const addToCart = () => {
    add({ productSlug: product.slug, variantId: sel.variant.id, quantity });
    openCart(product.slug);
  };

  const cta = tmpl ? (
    <ButtonLink href={`${personalizeHref(product.slug, sel.variant.id)}&cantidad=${quantity}`} size="lg" className="w-full" aria-disabled={!canBuy} tabIndex={canBuy ? undefined : -1}>
      <Sparkles size={18} aria-hidden="true" /> Personalizar<span className="max-sm:sr-only"> y ver vista previa</span>
    </ButtonLink>
  ) : (
    <Button size="lg" className="w-full" disabled={!canBuy} onClick={addToCart}>Agregar al carrito · {formatARS(price * quantity)}</Button>
  );

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <ProductGallery art={product.art} views={product.gallery} tint={sel.variant.colorHex} name={product.name} photoUrl={product.photoDataUrl} alt={product.imageAlt} />
      </div>
      <div className="flex flex-col gap-6">
        <div>
          <p className="eyebrow text-brass-ink">{category?.name}{tmpl ? ` · ${KIND_LABEL[tmpl.kind]}` : ""}{product.isNew ? " · Nuevo" : ""}</p>
          <h1 className="font-display mt-3 text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.02]">{product.name}</h1>
          <p className="mt-3 text-lg text-muted">{product.short}</p>
        </div>
        <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
          <span className="text-4xl font-extrabold tabular-nums tracking-tight">{formatARS(price)}</span>
          {settings.transferDiscountPct > 0 && (
            <span className="mb-1 rounded-full bg-success-soft px-3 py-1 text-sm font-bold text-success">{formatARS(transferPrice)} con transferencia o QR</span>
          )}
          <span className="w-full text-xs text-muted">Precio sin impuestos nacionales: {formatARS(withoutNationalTaxes(price, settings.nationalTaxRate))} · precio de muestra{tmpl && tmpl.surcharge > 0 ? ` · incluye ${formatARS(tmpl.surcharge)} de personalización` : ""}</span>
        </div>
        {sel.colorOptions.length > 0 && <VariantPicker legend="Color" options={sel.colorOptions} value={sel.color} onChange={sel.chooseColor} swatches />}
        {sel.sizeOptions.length > 0 && <VariantPicker legend="Opción" options={sel.sizeOptions} value={sel.size} onChange={sel.chooseSize} />}
        {inactive ? (
          <p role="status" className="rounded-2xl bg-warning-soft p-3 text-sm font-bold text-warning">Este producto está pausado desde el panel demo y no se puede comprar.</p>
        ) : <StockMeter availability={avail} />}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold">Cantidad</span>
            <QuantityStepper label="Cantidad" value={quantity} max={max} onChange={setQty} />
          </div>
          {sel.variant.stock > 0 && <span className="text-xs text-muted">Máximo {max} {max === 1 ? "unidad" : "unidades"}</span>}
        </div>
        <div className="hidden lg:block">{cta}</div>
        <MissionChip units={quantity} />
        <ul className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-muted">
          {[{ icon: Eye, t: "Vista previa antes de pagar" }, { icon: ShieldCheck, t: "Pago con Mercado Pago, QR o transferencia" }, { icon: Undo2, t: "Botón de arrepentimiento" }].map(({ icon: Icon, t }) => (
            <li key={t} className="flex flex-col items-center gap-2 rounded-2xl bg-surface p-3"><Icon size={18} aria-hidden="true" className="text-primary" />{t}</li>
          ))}
        </ul>
        <DeliveryEstimate makeDays={product.madeToOrderDays ?? 1} />
        <ProductAccordions product={product} />
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur lg:hidden">
        <span className="shrink-0 text-lg font-extrabold tabular-nums">{formatARS(price * quantity)}</span>
        <div className="flex-1">{cta}</div>
      </div>
    </div>
  );
}
