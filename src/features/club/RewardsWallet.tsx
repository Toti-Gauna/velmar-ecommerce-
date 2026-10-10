"use client";
import { CouponTicket } from "@/components/molecules/CouponTicket";
import { formatDate } from "@/lib/date";
import { useAccount } from "@/stores/account";
import { useDemoData } from "@/stores/admin";

/** Billetera de premios: el cupón ganado en la ruleta + los premios de misiones de la cuenta demo. */
export function RewardsWallet() {
  const { user, wheelPrize, usedRewards, wheelSpinning } = useAccount();
  const coupons = useDemoData((d) => d.coupons);
  const prize = wheelPrize && !wheelSpinning ? coupons.find((c) => c.code === wheelPrize.code) : undefined;
  const engraving = { code: "PREMIO-MISION", type: "FIXED" as const, value: 0, description: "Grabado de nombre gratis" };
  const empty = !prize && !user;
  if (empty) return <p className="rounded-2xl border border-dashed border-line p-5 text-sm text-muted">Todavía no tenés premios. Girá la ruleta o completá una misión.</p>;
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {prize && (
        <li><CouponTicket coupon={prize} badge="Ruleta" dimmed={(prize.usedCount ?? 0) >= 1}
          meta={`${prize.endsAt ? `Vence ${formatDate(prize.endsAt)} · ` : ""}${(prize.usedCount ?? 0) >= 1 ? "Usado" : "Disponible · 1 uso"}`} /></li>
      )}
      {user && (
        <li><CouponTicket coupon={engraving} badge="Misión “Primera compra”" dimmed={usedRewards.includes("r-grabado")}
          meta={`Vence 30 nov 2026 · ${usedRewards.includes("r-grabado") ? "Usado" : "Disponible"}`} /></li>
      )}
    </ul>
  );
}
