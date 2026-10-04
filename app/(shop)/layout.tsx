import type { ReactNode } from "react";
import { DemoBanner } from "@/components/organisms/DemoBanner";
import { Footer } from "@/components/organisms/Footer";
import { Header } from "@/components/organisms/Header";
import { WhatsAppFab } from "@/components/organisms/WhatsAppFab";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DemoBanner />
      <Header />
      <main id="contenido" className="mx-auto w-full max-w-6xl px-4 pb-8 pt-5 sm:pt-8">{children}</main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
