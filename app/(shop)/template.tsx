import type { ReactNode } from "react";

/** Se remonta en cada navegación: entrada suave por CSS (visible aunque no haya JS). */
export default function ShopTemplate({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
