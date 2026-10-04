"use client";
import { Ticket } from "lucide-react";
import { formatDate } from "@/lib/date";
import { useAccount } from "@/stores/account";
import { useDemoData } from "@/stores/admin";

/** Billetera de premios: los de la cuenta demo + el cupón ganado en la ruleta. */
export function RewardsWallet() {
  const { user, wheelPrize, usedRewards } = useAccount();
  const coupons = useDemoData((d) => d.coupons);
  const prize = wheelPrize ? coupons.find((c) => c.code === wheelPrize.code) : undefined;
  const items = [
    ...(wheelPrize ? [{ id: "wheel", title: wheelPrize.label, meta: `Ruleta · código ${wheelPrize.code}${prize?.endsAt ? ` · vence ${formatDate(prize.endsAt)}` : ""}`, used: (prize?.usedCount ?? 0) >= 1 }] : []),
    ...(user ? [{ id: "r-grabado", title: "Grabado de nombre gratis", meta: "Misión “Primera compra” · vence 30 nov 2026", used: usedRewards.includes("r-grabado") }] : []),
  ];
  if (items.length === 0) return <p className="rounded-2xl border border-dashed border-line p-5 text-sm text-muted">Todavía no tenés premios. Girá la ruleta o completá una misión.</p>;
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((r) => (
        <li key={r.id} className="relative flex items-center gap-4 overflow-hidden rounded-2xl bg-surface p-4 shadow-[var(--shadow-card)]">
          <span aria-hidden="true" className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-bg" />
          <span aria-hidden="true" className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-bg" />
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-night text-brass"><Ticket size={20} aria-hidden="true" /></span>
          <span className="min-w-0"><span className="block font-bold">{r.title}</span><span className="block text-xs text-muted">{r.meta}</span></span>
          <span className="ml-auto shrink-0 text-xs font-bold">{r.used ? "Usado" : "Disponible"}</span>
        </li>
      ))}
    </ul>
  );
}
