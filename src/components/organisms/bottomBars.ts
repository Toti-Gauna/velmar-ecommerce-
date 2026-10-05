/** Qué barra fija inferior lleva cada ruta de la tienda en el celular (una sola por pantalla). */
export type BottomBar = "nav" | "product" | "cart" | "none";

export function bottomBarFor(pathname: string): BottomBar {
  if (pathname.startsWith("/p/") || /^\/crear\/[^/]+/.test(pathname)) return "product";
  if (pathname.startsWith("/carrito")) return "cart";
  if (pathname.startsWith("/checkout")) return "none";
  return "nav";
}
