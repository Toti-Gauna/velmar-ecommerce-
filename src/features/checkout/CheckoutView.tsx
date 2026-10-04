"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/atoms/Button";
import { Skeleton } from "@/components/atoms/Skeleton";
import { EmptyState } from "@/components/molecules/EmptyState";
import { StepIndicator } from "@/components/molecules/StepIndicator";
import { missingForFreeShipping, totalsOf } from "@/demo/engine/pricing";
import { DEMO_ORDER_CODE, DEMO_TRACKING_TOKEN } from "@/demo/fixtures/commerce";
import { useAccount } from "@/stores/account";
import { useAdmin } from "@/stores/admin";
import { useCart } from "@/stores/cart";
import { useCheckout } from "@/stores/checkout";
import { useHydrated } from "@/stores/hydration";
import { useCartQuote } from "../cart/useCartQuote";
import { CheckoutSummary } from "./CheckoutSummary";
import { ConfirmStep } from "./ConfirmStep";
import { ContactStep } from "./ContactStep";
import { DeliveryStep } from "./DeliveryStep";
import { PaymentStep } from "./PaymentStep";

const STEPS = ["Datos", "Entrega", "Pago", "Confirmar"];

export function CheckoutView() {
  const hydrated = useHydrated();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const { quote } = useCartQuote();
  const lines = useCart((s) => s.lines);
  const clearCart = useCart((s) => s.clear);
  const isAccount = useAccount((s) => s.user !== null);
  const checkout = useCheckout();
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) heading.current?.focus();
    mounted.current = true;
  }, [step]);

  if (!hydrated) return <div role="status" aria-label="Cargando checkout"><Skeleton className="h-80 w-full" /></div>;
  if (lines.length === 0 && !checkout.lastOrder?.code) {
    return <EmptyState title="No hay nada para pagar" action={<ButtonLink href="/">Ver productos</ButtonLink>}>Tu carrito está vacío. Agregá productos para iniciar el checkout de demostración.</EmptyState>;
  }
  if (lines.length === 0) {
    return <EmptyState title="El carrito está vacío" action={<ButtonLink href="/checkout/confirmacion/">Ver mi pedido de demostración</ButtonLink>}>Ya confirmaste un pedido de demostración.</EmptyState>;
  }

  const confirm = () => {
    const order = {
      code: DEMO_ORDER_CODE, token: DEMO_TRACKING_TOKEN, createdAt: new Date().toISOString(), contact: checkout.contact,
      fulfillment: checkout.fulfillment!, paymentMethod: checkout.paymentMethod!, lines, quote: totalsOf(quote), asAccount: isAccount,
    };
    checkout.placeOrder(order);
    useAdmin.getState().syncShopOrder(order); // aparece en el panel demo de este navegador
    clearCart();
    router.push("/checkout/confirmacion/");
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="flex flex-col gap-5">
        <StepIndicator steps={STEPS} current={step} />
        <h2 ref={heading} tabIndex={-1} className="text-xl font-extrabold focus:outline-none">{STEPS[step]}</h2>
        <div key={step} className="animate-fade-up">
          {step === 0 && <ContactStep onNext={() => setStep(1)} />}
          {step === 1 && <DeliveryStep onNext={() => setStep(2)} onBack={() => setStep(0)} freeShipping={missingForFreeShipping(quote.subtotal) === 0} />}
          {step === 2 && <PaymentStep onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <ConfirmStep onBack={() => setStep(2)} onConfirm={confirm} onEdit={setStep} />}
        </div>
      </div>
      <aside className="lg:sticky lg:top-24 lg:self-start"><CheckoutSummary quote={quote} /></aside>
    </div>
  );
}
