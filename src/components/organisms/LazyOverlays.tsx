"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useUi } from "@/stores/ui";

// Carrito, cupones y buscador se descargan la primera vez que se abren (no pesan en la carga de cada página).
const CartDrawer = dynamic(() => import("@/features/cart/CartDrawer").then((m) => m.CartDrawer), { ssr: false });
const CouponsSheet = dynamic(() => import("@/features/cart/CouponsSheet").then((m) => m.CouponsSheet), { ssr: false });
const SearchModal = dynamic(() => import("@/features/catalog/SearchModal").then((m) => m.SearchModal), { ssr: false });

/** Una vez abierto queda montado: así el cierre tiene su animación y la segunda vez abre al instante. */
function useOpenedOnce(open: boolean): boolean {
  const [ever, setEver] = useState(open);
  if (open && !ever) setEver(true);
  return ever;
}

export function LazyOverlays() {
  const { cartOpen, couponsOpen, searchOpen } = useUi();
  const cart = useOpenedOnce(cartOpen);
  const coupons = useOpenedOnce(couponsOpen);
  const search = useOpenedOnce(searchOpen);
  // Con la página quieta se precargan en segundo plano, para que el primer toque no espere la descarga.
  useEffect(() => {
    const warm = () => { void import("@/features/cart/CartDrawer"); void import("@/features/catalog/SearchModal"); };
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 2500));
    const id = window.setTimeout(() => idle(warm), 4000);
    return () => window.clearTimeout(id);
  }, []);
  return (
    <>
      {cart && <CartDrawer />}
      {coupons && <CouponsSheet />}
      {search && <SearchModal />}
    </>
  );
}
