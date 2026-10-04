"use client";
import { Gift, Lock, Truck } from "lucide-react";
import { motion } from "motion/react";
import { Button, ButtonLink } from "@/components/atoms/Button";
import { Skeleton } from "@/components/atoms/Skeleton";
import { EmptyState } from "@/components/molecules/EmptyState";
import { OrderSummary } from "@/components/molecules/OrderSummary";
import { CartLineItem, type CartLineView } from "@/components/organisms/CartLineItem";
import { getProduct, maxQuantity } from "@/demo/engine/catalog";
import { missingForFreeShipping, type QuotedLine } from "@/demo/engine/pricing";
import { recommendForCart } from "@/demo/engine/recommend";
import { demoData } from "@/demo/engine/source";
import { formatARS } from "@/lib/money";
import { useAccount } from "@/stores/account";
import { useDemoData, useDemoVersion } from "@/stores/admin";
import { useCart } from "@/stores/cart";
import { useHydrated } from "@/stores/hydration";
import { useUi } from "@/stores/ui";
import { CartMissionNudge } from "./CartMissionNudge";
import { CouponForm } from "./CouponForm";
import { MiniRecommendations } from "./MiniRecommendations";
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
  const lines = useCart((s) => s.lines);
  const { setQuantity, remove } = useCart();
  const wheelActive = useDemoData((d) => d.wheel.active);
  const hasPrize = useAccount((s) => s.wheelPrize !== null);
  const setWheel = useUi((s) => s.setWheel);
  if (!hydrated) return <div role="status" aria-label="Cargando carrito" className="flex flex-col gap-3"><Skeleton className="h-32" /><Skeleton className="h-32" /></div>;
  if (quote.lines.length === 0) {
    return (
      <div className="flex flex-col gap-12">
        <EmptyState title="Tu carrito está vacío" action={<ButtonLink href="/">Ver productos</ButtonLink>}>Agregá algo o creá tu producto personalizado.</EmptyState>
        <MiniRecommendations title="Lo más elegido" products={recommendForCart([], 6)} />
      </div>
    );
  }
  const missing = missingForFreeShipping(quote.subtotal);
  const threshold = demoData().settings.freeShippingFrom;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12">
      <div className="flex flex-col gap-6">
        <div className="rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]">
          <p className="flex items-center gap-2 text-sm font-semibold"><Truck size={18} aria-hidden="true" className="text-primary" />{missing > 0 ? `Te faltan ${formatARS(missing)} para envío gratis.` : "¡Tenés envío gratis!"}</p>
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-accent"><motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${Math.min(100, (quote.subtotal / threshold) * 100)}%` }} transition={{ duration: 1 }} /></div>
        </div>
        <ul className="flex flex-col gap-3" aria-label="Productos en el carrito">
          {quote.lines.map((q) => {
            const view = toLineView(q);
            return view && <CartLineItem key={view.id} line={view} onQuantity={(n) => setQuantity(view.id, n)} onRemove={() => remove(view.id)} />;
          })}
        </ul>
        <CartMissionNudge units={quote.units} total={quote.total} />
        <MiniRecommendations title="Completá tu pedido" products={recommendForCart(lines, 6)} />
      </div>
      <aside className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
        {wheelActive && !hasPrize && (
          <button type="button" onClick={() => setWheel(true)} className="flex items-center gap-3 rounded-3xl bg-night p-4 text-left text-[#f6f1e8] transition-transform hover:-translate-y-0.5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brass text-night"><Gift size={20} aria-hidden="true" /></span>
            <span><span className="block font-bold">Girá la ruleta antes de pagar</span><span className="text-xs text-[#cfc6b3]">Ganás un cupón para este pedido</span></span>
          </button>
        )}
        <div className="rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)]"><CouponForm subtotal={quote.subtotal} isRegistered={isRegistered} check={couponCheck} /></div>
        <OrderSummary
          rows={[
            { label: `Subtotal (${quote.units} ${quote.units === 1 ? "producto" : "productos"})`, amount: quote.subtotal },
            ...(quote.couponDiscount > 0 ? [{ label: "Cupón", amount: quote.couponDiscount, negative: true }] : []),
            { label: "Envío", amount: null, pendingLabel: "Se calcula en el checkout" },
          ]}
          total={quote.total}
          totalNote="Precios de muestra. En la tienda real el total se recalcula en el servidor al confirmar."
        >
          <ButtonLink href="/checkout/" size="lg" className="w-full"><Lock size={16} aria-hidden="true" /> Continuar al checkout</ButtonLink>
          <Button variant="ghost" className="mt-2 w-full" onClick={() => history.back()}>Seguir comprando</Button>
        </OrderSummary>
      </aside>
    </div>
  );
}
