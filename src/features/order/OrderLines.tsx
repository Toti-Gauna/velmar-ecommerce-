"use client";
import { LineThumb } from "@/components/organisms/LineThumb";
import type { CartLine } from "@/demo/engine/cart-types";
import { quoteLines } from "@/demo/engine/pricing";
import { getProduct } from "@/demo/engine/catalog";
import { demoData } from "@/demo/engine/source";
import { formatARS } from "@/lib/money";

export function OrderLines({ lines }: { lines: CartLine[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {quoteLines(lines).map((q) => {
        const product = getProduct(q.line.productSlug)!;
        const variant = product.variants.find((v) => v.id === q.line.variantId);
        const p = q.line.personalization;
        return (
          <li key={q.line.id} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
            <div className="w-16 shrink-0"><LineThumb art={product.art} tint={variant?.colorHex} name={product.name} personalization={p} zone={demoData().textZones[product.art]} /></div>
            <div className="min-w-0 flex-1 text-sm">
              <p className="font-bold">{q.line.quantity} × {product.name}</p>
              <p className="text-muted">{variant?.label}{p?.text ? ` · “${p.text}”` : ""}{p ? " · vista previa aprobada" : ""}</p>
            </div>
            <span className="font-bold tabular-nums">{formatARS(q.lineTotal)}</span>
          </li>
        );
      })}
    </ul>
  );
}
