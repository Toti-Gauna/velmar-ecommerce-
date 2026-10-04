import type { ReactNode } from "react";
import { formatARS } from "@/lib/money";

export interface SummaryRow {
  label: ReactNode;
  amount: number | null;
  /** Descuento: se muestra con signo menos. */
  negative?: boolean;
  pendingLabel?: string;
}

export function OrderSummary({ rows, total, totalNote, children }: { rows: SummaryRow[]; total: number; totalNote?: ReactNode; children?: ReactNode }) {
  return (
    <section aria-label="Resumen" className="rounded-3xl bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6">
      <dl className="flex flex-col gap-2 text-sm">
        {rows.map((r, i) => (
          <div key={i} className="flex justify-between gap-3">
            <dt className="text-muted">{r.label}</dt>
            <dd className={r.negative ? "font-bold text-success" : "font-semibold tabular-nums"}>
              {r.amount === null ? r.pendingLabel ?? "A definir" : `${r.negative ? "−" : ""}${formatARS(r.amount)}`}
            </dd>
          </div>
        ))}
        <div className="mt-2 flex items-end justify-between border-t border-line pt-3">
          <dt className="font-display text-2xl">Total</dt>
          <dd className="text-3xl font-extrabold tabular-nums tracking-tight">{formatARS(total)}</dd>
        </div>
      </dl>
      {totalNote && <p className="mt-1 text-xs text-muted">{totalNote}</p>}
      {children && <div className="mt-4">{children}</div>}
    </section>
  );
}
