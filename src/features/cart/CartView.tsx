"use client";
import { Truck } from "lucide-react";
import { ButtonLink } from "@/components/atoms/Button";
import { Skeleton } from "@/components/atoms/Skeleton";
import { EmptyState } from "@/components/molecules/EmptyState";
import { OrderSummary } from "@/components/molecules/OrderSummary";
import { CartLineItem, type CartLineView } from "@/components/organisms/CartLineItem";
import { getProduct, maxQuantity } from "@/demo/engine/catalog";
import { demoData } from "@/demo/engine/source";
import { useDemoVersion } from "@/stores/admin";
import { missingForFreeShipping, type QuotedLine } from "@/demo/engine/pricing";
import { formatARS } from "@/lib/money";
import { useCart } from "@/stores/cart";
import { useHydrated } from "@/stores/hydration";
import { CartMission } from "./CartMission";
import { CouponForm } from "./CouponForm";
import { useCartQuote } from "./useCartQuote";

export function toLineView(q: QuotedLine): CartLineView | null {
  const product = getProduct(q.line.productSlug);
  const variant = product?.variants.find((v) => v.id === q.line.variantId);
  if (!product || !variant) return null;
  return {
    id: q.line.id, slug: product.slug, name: product.name, variantLabel: variant.label, art: product.art, tint: variant.colorHex,
    unitPrice: q.unitPrice, lineTotal: q.lineTotal, quantity: q.line.quantity, maxQuantity: maxQuantity(variant), personalization: q.line.personalization, zone: demoData().textZones[product.art],
  };
}

export function CartView() {
  const hydrated = useHydrated();
  useDemoVersion();
  const { quote, couponCheck, isRegistered } = useCartQuote();
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  if (!hydrated) return <div role="status" aria-label="Cargando carrito" className="flex flex-col gap-3"><Skeleton className="h-32" /><Skeleton className="h-32" /></div>;
  if (quote.lines.length === 0) {
    return <EmptyState title="Tu carrito está vacío" action={<ButtonLink href="/">Ver productos</ButtonLink>}>Agregá algo o creá tu producto personalizado.</EmptyState>;
  }
  const missing = missingForFreeShipping(quote.subtotal);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <ul className="flex flex-col gap-3" aria-label="Productos en el carrito">
        {quote.lines.map((q) => {
          const view = toLineView(q);
          return view && <CartLineItem key={view.id} line={view} onQuantity={(n) => setQuantity(view.id, n)} onRemove={() => remove(view.id)} />;
        })}
      </ul>
      <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
        <p className="flex items-center gap-2 rounded-2xl bg-accent p-3 text-sm font-semibold">
          <Truck size={18} aria-hidden="true" className="text-primary" />
          {missing > 0 ? `Te faltan ${formatARS(missing)} para envío gratis.` : "¡Tenés envío gratis!"}
        </p>
        <CartMission units={quote.units} total={quote.total} isRegistered={isRegistered} />
        <CouponForm subtotal={quote.subtotal} isRegistered={isRegistered} check={couponCheck} />
        <OrderSummary
          rows={[
            { label: `Subtotal (${quote.units} ${quote.units === 1 ? "producto" : "productos"})`, amount: quote.subtotal },
            ...(quote.couponDiscount > 0 ? [{ label: "Cupón", amount: quote.couponDiscount, negative: true }] : []),
            { label: "Envío", amount: null, pendingLabel: "Se calcula en el checkout" },
          ]}
          total={quote.total}
          totalNote="Precios de muestra. En la tienda real el total se recalcula en el servidor al confirmar."
        >
          <ButtonLink href="/checkout/" size="lg" className="w-full">Continuar al checkout</ButtonLink>
        </OrderSummary>
      </aside>
    </div>
  );
}
