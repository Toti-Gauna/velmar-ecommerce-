"use client";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { getProduct } from "@/demo/engine/catalog";
import { whatsappLink, whatsappMessage } from "@/lib/whatsapp";
import { useDemoData } from "@/stores/admin";

/** CTA para continuar por WhatsApp con texto según la página. No reemplaza el flujo de compra. */
export function WhatsAppFab() {
  const pathname = usePathname();
  useDemoData((d) => d.settings.whatsappNumber); // re-render si cambia el número en el panel
  const slug = pathname.match(/\/(?:p|crear)\/([^/]+)/)?.[1];
  const productName = slug ? getProduct(slug)?.name : undefined;
  const page = pathname.startsWith("/checkout") ? "checkout" : pathname.startsWith("/crear") ? "crear" : undefined;
  // Sube por encima de las barras fijas de compra (ficha: 2 filas hasta sm; carrito: 1 fila hasta lg).
  const onProduct = pathname.startsWith("/p/") || /^\/crear\/[^/]+/.test(pathname);
  const onCart = pathname.startsWith("/carrito");
  return (
    <a
      href={whatsappLink(whatsappMessage({ productName, page }))}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed right-4 z-30 inline-flex items-center gap-2 rounded-full bg-[#1f6f43] px-4 py-3 text-sm font-bold text-white shadow-lg hover:bg-[#185a36] ${onProduct ? "bottom-40 sm:bottom-6" : onCart ? "bottom-28 lg:bottom-6" : "bottom-5"}`}
    >
      <MessageCircle size={20} aria-hidden="true" />
      <span className="max-sm:sr-only">Consultar por WhatsApp</span>
    </a>
  );
}
