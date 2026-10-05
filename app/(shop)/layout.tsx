import type { ReactNode } from "react";
import { DemoBanner } from "@/components/organisms/DemoBanner";
import { Footer } from "@/components/organisms/Footer";
import { Header } from "@/components/organisms/Header";
import { ShopBottomNav } from "@/components/organisms/ShopBottomNav";
import { WhatsAppFab } from "@/components/organisms/WhatsAppFab";
import { CartDrawer } from "@/features/cart/CartDrawer";
import { CouponsSheet } from "@/features/cart/CouponsSheet";
import { SearchModal } from "@/features/catalog/SearchModal";
import { WheelModal } from "@/features/club/WheelModal";
import { ThemeRibbon } from "@/features/themes/ThemeRibbon";
import { ThemeTryButton } from "@/features/themes/ThemeTryButton";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DemoBanner />
      <ThemeRibbon />
      <Header />
      <main id="contenido" className="mx-auto w-full max-w-7xl px-4 pb-10 pt-6 sm:px-6 sm:pt-10">{children}</main>
      <Footer />
      <ShopBottomNav />
      <WhatsAppFab />
      <ThemeTryButton />
      <CartDrawer />
      <WheelModal />
      <CouponsSheet />
      <SearchModal />
    </>
  );
}
