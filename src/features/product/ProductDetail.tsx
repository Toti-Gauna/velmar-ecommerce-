"use client";
import { Eye, ShieldCheck, ShoppingBag, Undo2, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { StockMeter } from "@/components/molecules/StockMeter";
import { ProductGallery } from "@/components/organisms/ProductGallery";
import { availability, getCategory, isPurchasable, maxQuantity, unitPrice, type Availability } from "@/demo/engine/catalog";
import type { Product } from "@/demo/types";
import { formatARS, withoutNationalTaxes } from "@/lib/money";
import { useDemoData } from "@/stores/admin";
import { usePersonalizationDraft } from "../personalize/usePersonalizationDraft";
import { ConfigureCard } from "./ConfigureCard";
import { DeliveryEstimate } from "./DeliveryEstimate";
import { FavoriteButton } from "./FavoriteButton";
import { LivePreview } from "./LivePreview";
import { MissionChip } from "./MissionChip";
import { ProductAccordions } from "./ProductAccordions";
import { useProductPurchase } from "./useProductPurchase";
import { useVariantSelection } from "./useVariantSelection";

const KIND_LABEL = { TEXT: "Personalizable con nombre", PHOTO: "Personalizable con tu foto", PHOTO_REFERENCE: "Pintado desde tu foto" };
const TRUST = [{ icon: Eye, t: "Vista previa antes de pagar" }, { icon: ShieldCheck, t: "Mercado Pago, QR o transferencia" }, { icon: Undo2, t: "Botón de arrepentimiento" }];

function stockNote(a: Availability): string {
  return a.kind === "in-stock" ? `(${a.units} disponibles)` : a.kind === "made-to-order" ? "Hecho a pedido" : "Sin stock";
}

/** Ficha todo en uno: galería con vista previa en vivo + una sola tarjeta para elegir opción, diseño y cantidad. */
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
  const avail = availability(product, sel.variant);
  const { purchase } = useProductPurchase(product, sel.variant, quantity, canBuy, draft);
  const transferPrice = Math.round(price * (1 - settings.transferDiscountPct / 100));
  const category = getCategory(product.categorySlug);
  const live = tmpl && tmpl.kind !== "PHOTO_REFERENCE" ? <LivePreview product={product} tint={sel.variant.colorHex} draft={draft} /> : undefined;

  const desktopActions = (
    <div className="flex gap-3">
      <FavoriteButton slug={product.slug} name={product.name} className="h-14 w-14" />
      <Button size="lg" disabled={!canBuy} onClick={() => purchase("cart")} className="flex-1"><ShoppingBag size={18} aria-hidden="true" />Agregar al carrito</Button>
      <Button size="lg" variant="dark" disabled={!canBuy} onClick={() => purchase("buy")} className="flex-1"><Zap size={18} aria-hidden="true" className="text-brass" />Comprar ahora</Button>
    </div>
  );

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
      <div className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
        <ProductGallery art={product.art} views={product.gallery} tint={sel.variant.colorHex} name={product.name} photoUrl={product.photoDataUrl} alt={product.imageAlt} live={live} />
        {inactive ? (
          <p role="status" className="rounded-2xl bg-warning-soft p-3 text-sm font-bold text-warning">Este producto está pausado desde el panel demo y no se puede comprar.</p>
        ) : <StockMeter availability={avail} />}
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
        <ConfigureCard product={product} sel={sel} draft={draft} quantity={quantity} max={max} stockNote={stockNote(avail)} onQuantity={setQty} actions={desktopActions} />
        <MissionChip units={quantity} />
        <DeliveryEstimate product={product} variant={sel.variant} />
        <ul className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-muted">
          {TRUST.map(({ icon: Icon, t }) => <li key={t} className="flex flex-col items-center gap-2 rounded-2xl bg-surface p-3"><Icon size={18} aria-hidden="true" className="text-primary" />{t}</li>)}
        </ul>
        <ProductAccordions product={product} />
      </div>
      <div className="bleed-bottom fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-line bg-surface px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_30px_-20px_rgb(28_32_22/0.4)] sm:hidden">
        <FavoriteButton slug={product.slug} name={product.name} className="h-14 w-14" />
        <Button size="lg" disabled={!canBuy} onClick={() => purchase("cart")} className="flex-1 justify-between whitespace-nowrap px-5 text-[15px]">
          <span>Agregar al carrito</span>
          <span className="tabular-nums">{formatARS(price * quantity)}</span>
        </Button>
      </div>
    </div>
  );
}
