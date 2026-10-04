import { formatARS } from "@/lib/money";

export interface SalesBar {
  key: string;
  label: string;
  amount: number;
  orders: number;
}

/**
 * Barras de una sola serie (ventas de muestra por día). Sin leyenda: el título nombra la serie.
 * Tooltip al pasar el mouse o con foco de teclado; tabla equivalente para lectores de pantalla.
 */
export function SalesChart({ title, bars }: { title: string; bars: SalesBar[] }) {
  const max = Math.max(1, ...bars.map((b) => b.amount));
  return (
    <figure className="rounded-2xl border border-line bg-surface p-4">
      <figcaption className="mb-3 text-sm font-bold">{title}</figcaption>
      <div className="relative flex h-40 items-end gap-0.5 border-b border-line">
        {[0.5, 1].map((t) => <span key={t} aria-hidden="true" className="pointer-events-none absolute inset-x-0 border-t border-dashed border-line/70" style={{ bottom: `${t * 100}%` }} />)}
        {bars.map((b) => (
          <div key={b.key} tabIndex={0} role="img" aria-label={`${b.label}: ${formatARS(b.amount)}, ${b.orders} ${b.orders === 1 ? "pedido" : "pedidos"} (demo)`} className="group relative flex h-full flex-1 items-end justify-center outline-none">
            <div className="w-full max-w-10 rounded-t-[4px] bg-primary transition-opacity group-hover:opacity-85 group-focus-visible:ring-2 group-focus-visible:ring-primary/50"
              style={{ height: b.amount > 0 ? `${Math.max(3, (b.amount / max) * 100)}%` : "2px", opacity: b.amount > 0 ? 1 : 0.25 }} />
            <span aria-hidden="true" className="pointer-events-none absolute -top-2 z-10 hidden -translate-y-full whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-xs font-bold text-white shadow group-hover:block group-focus-visible:block">
              {b.label}: {formatARS(b.amount)} · {b.orders} {b.orders === 1 ? "pedido" : "pedidos"}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-0.5 text-center text-[11px] text-muted" aria-hidden="true">
        {bars.map((b) => <span key={b.key} className="flex-1">{b.label}</span>)}
      </div>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer font-bold text-primary">Ver como tabla</summary>
        <table className="mt-2 w-full text-left">
          <thead><tr className="text-muted"><th className="py-1 font-semibold">Día</th><th className="font-semibold">Ventas (demo)</th><th className="font-semibold">Pedidos</th></tr></thead>
          <tbody>{bars.map((b) => <tr key={b.key} className="border-t border-line"><td className="py-1">{b.label}</td><td className="tabular-nums">{formatARS(b.amount)}</td><td className="tabular-nums">{b.orders}</td></tr>)}</tbody>
        </table>
      </details>
    </figure>
  );
}
