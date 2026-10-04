import { brand } from "@/config/brand";

/** Link de WhatsApp con texto prearmado. Sin número confirmado abre WhatsApp para elegir contacto. */
export function whatsappLink(message: string): string {
  const text = encodeURIComponent(message);
  return brand.whatsappNumber ? `https://wa.me/${brand.whatsappNumber}?text=${text}` : `https://wa.me/?text=${text}`;
}

export function whatsappMessage(context: { productName?: string; page?: string }): string {
  if (context.productName) return `Hola ${brand.name}! Vi "${context.productName}" en la tienda y quiero hacer una consulta.`;
  if (context.page === "checkout") return `Hola ${brand.name}! Estoy terminando una compra en la tienda y tengo una duda.`;
  if (context.page === "crear") return `Hola ${brand.name}! Quiero un producto personalizado y tengo una consulta.`;
  return `Hola ${brand.name}! Estoy mirando la tienda y quiero hacer una consulta.`;
}
