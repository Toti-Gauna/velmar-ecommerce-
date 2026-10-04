"use client";
import { Eye, ShieldCheck, ShoppingBag, Undo2, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { QuantityStepper } from "@/components/molecules/QuantityStepper";
import { StockMeter } from "@/components/molecules/StockMeter";
import { VariantPicker } from "@/components/molecules/VariantPicker";
import { ProductGallery } from "@/components/organisms/ProductGallery";
import { availability, getCategory, isPurchasable, maxQuantity, unitPrice } from "@/demo/engine/catalog";
import type { Product } from "@/demo/types";
import { formatARS, withoutNationalTaxes } from "@/lib/money";
import { useDemoData } from "@/stores/admin";
import { usePersonalizationDraft } from "../personalize/usePersonalizationDraft";
import { DeliveryEstimate } from "./DeliveryEstimate";
import { LivePreview } from "./LivePreview";
import { MissionChip } from "./MissionChip";
import { PersonalizeSection } from "./PersonalizeSection";
import { ProductAccordions } from "./ProductAccordions";
import { useProductPurchase } from "./useProductPurchase";
import { useVariantSelection } from "./useVariantSelection";

const KIND_LABEL = { TEXT: "Personalizable con nombre", PHOTO: "Personalizable con tu foto", PHOTO_REFERENCE: "Pintado desde tu foto" };
const TRUST = [{ icon: Eye, t: "Vista previa antes de pagar" }, { icon: ShieldCheck, t: "Mercado Pago, QR o transferencia" }, { icon: Undo2, t: "Botón de arrepentimiento" }];

/** Ficha todo en uno: variante, personalización con vista previa en vivo, cantidad y compra en la misma pantalla. */
export function ProductDetail({ product: initial }: { product: Product }) {
  const product = useDemoData((d) => d.products.find((p) => p.slug === initial.slug)) ?? initial;
  const settings = useDemoData((d) => d.settings);
  const sel = useVariantSelection(product);
  const [qty, setQty] = useState(1);
  const tmpl = product.personalization;
  const draft = usePersonalizationDraft(tmpl);
  const price = unitPrice(product, sel.variant, Boolean(tmpl));
  const max = Math.max(1, maxQuantity(sel.variant));
  const quantity = Math.min(qty, max);
  const inactive = product.active === false;
  const canBuy = !inactive && isPurchasable(sel.variant, quantity);
  const { purchase, needApproval } = useProductPurchase(product, sel.variant, quantity, canBuy, draft);
  const transferPrice = Math.round(price * (1 - settings.transferDiscountPct / 100));
  const category = getCategory(product.categorySlug);
  const live = tmpl && tmpl.kind !== "PHOTO_REFERENCE" ? <LivePreview product={product} tint={sel.variant.colorHex} draft={draft} /> : undefined;

  const actions = (compact: boolean) => (
    <div className={compact ? "flex gap-2" : "grid gap-3 sm:grid-cols-2"}>
      <Button size="lg" variant="dark" disabled={!canBuy} onClick={() => purchase("buy")} className={compact ? "flex-1 px-4" : "w-full"}>
        <Zap size={18} aria-hidden="true" className="text-brass" />Comprar ahora
      </Button>
      <Button size="lg" variant={compact ? "secondary" : "primary"} disabled={!canBuy} onClick={() => purchase("cart")} className={compact ? "px-4" : "w-full"} aria-label={compact ? "Agregar al carrito" : undefined}>
        <ShoppingBag size={18} aria-hidden="true" />{!compact && "Agregar al carrito"}
      </Button>
    </div>
  );

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <ProductGallery art={product.art} views={product.gallery} tint={sel.variant.colorHex} name={product.name} photoUrl={product.photoDataUrl} alt={product.imageAlt} live={live} />
      </div>
      <div className="flex flex-col gap-6">
        <div>
          <p className="eyebrow text-brass-ink">{category?.name}{tmpl ? ` · ${KIND_LABEL[tmpl.kind]}` : ""}{product.isNew ? " · Nuevo" : ""}</p>
          <h1 className="font-display mt-3 text-[clamp(2.1rem,4.5vw,3.4rem)] leading-[1.02]">{product.name}</h1>
          <p className="mt-3 text-lg text-muted">{product.short}</p>
          {product.soldCount > 0 && <p className="mt-2 text-sm font-semibold text-muted">+{product.soldCount} vendidos (muestra)</p>}
        </div>
        <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
          <span className="text-4xl font-extrabold tabular-nums tracking-tight">{formatARS(price)}</span>
          {settings.transferDiscountPct > 0 && <span className="mb-1 rounded-full bg-success-soft px-3 py-1 text-sm font-bold text-success">{formatARS(transferPrice)} con transferencia o QR</span>}
          <span className="w-full text-xs text-muted">Precio sin impuestos nacionales: {formatARS(withoutNationalTaxes(price, settings.nationalTaxRate))} · precio de muestra</span>
        </div>
        {sel.colorOptions.length > 0 && <VariantPicker legend="Color" options={sel.colorOptions} value={sel.color} onChange={sel.chooseColor} swatches />}
        {sel.sizeOptions.length > 0 && <VariantPicker legend="Opción" options={sel.sizeOptions} value={sel.size} onChange={sel.chooseSize} />}
        {inactive ? (
          <p role="status" className="rounded-2xl bg-warning-soft p-3 text-sm font-bold text-warning">Este producto está pausado desde el panel demo y no se puede comprar.</p>
        ) : <StockMeter availability={availability(product, sel.variant)} />}
        {tmpl && <PersonalizeSection product={product} draft={draft} needApproval={needApproval} />}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold">Cantidad</span>
            <QuantityStepper label="Cantidad" value={quantity} max={max} onChange={setQty} />
          </div>
          <span className="text-sm text-muted">{quantity > 1 ? <>Total <strong className="tabular-nums text-ink">{formatARS(price * quantity)}</strong>{tmpl ? " · mismo diseño" : ""}</> : sel.variant.stock > 0 ? `Máximo ${max} ${max === 1 ? "unidad" : "unidades"}` : null}</span>
        </div>
        <div className="hidden sm:block">{actions(false)}</div>
        <MissionChip units={quantity} />
        <DeliveryEstimate makeDays={product.madeToOrderDays ?? 1} />
        <ul className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-muted">
          {TRUST.map(({ icon: Icon, t }) => <li key={t} className="flex flex-col items-center gap-2 rounded-2xl bg-surface p-3"><Icon size={18} aria-hidden="true" className="text-primary" />{t}</li>)}
        </ul>
        <ProductAccordions product={product} />
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:hidden">
        <div className="mb-2 flex items-baseline justify-between text-sm"><span className="text-muted">{quantity} × {formatARS(price)}</span><span className="text-lg font-extrabold tabular-nums">{formatARS(price * quantity)}</span></div>
        {actions(true)}
      </div>
    </div>
  );
}
