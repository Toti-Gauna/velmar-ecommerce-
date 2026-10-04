import type { ReactNode } from "react";
import { DemoBanner } from "@/components/organisms/DemoBanner";
import { Footer } from "@/components/organisms/Footer";
import { Header } from "@/components/organisms/Header";
import { WhatsAppFab } from "@/components/organisms/WhatsAppFab";
import { CartDrawer } from "@/features/cart/CartDrawer";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DemoBanner />
      <Header />
      <main id="contenido" className="mx-auto w-full max-w-7xl px-4 pb-10 pt-6 sm:px-6 sm:pt-10">{children}</main>
      <Footer />
      <WhatsAppFab />
      <CartDrawer />
    </>
  );
}
