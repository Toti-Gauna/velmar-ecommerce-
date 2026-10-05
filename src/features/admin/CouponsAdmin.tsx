"use client";
import { Pagination } from "@/components/molecules/Pagination";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Switch } from "@/components/atoms/Switch";
import { DEMO_TODAY } from "@/demo/fixtures/admin-orders";
import type { Coupon } from "@/demo/types";
import { formatDate } from "@/lib/date";
import { formatARS } from "@/lib/money";
import { useAdmin } from "@/stores/admin";
import { AdminPageHeader } from "./AdminPageHeader";
import { usePaged } from "./usePaged";
import { CouponForm } from "./CouponForm";
import { useDemoSave } from "./useDemoSave";
import { WheelAdmin } from "./WheelAdmin";

function valueLabel(c: Coupon): string {
  return c.type === "PERCENT" ? `${c.value}%` : c.type === "FIXED" ? formatARS(c.value) : "Envío gratis";
}

export function CouponsAdmin() {
  const coupons = useAdmin((s) => s.data.coupons);
  const saveCoupon = useAdmin((s) => s.saveCoupon);
  // Los más nuevos primero (los cupones ganados en la ruleta se agregan al final).
  const paged = usePaged([...coupons].reverse(), 6);
  const save = useDemoSave();
  const [creating, setCreating] = useState(false);
  return (
    <>
      <AdminPageHeader title="Cupones" actions={<Button onClick={() => setCreating(true)}><Plus size={18} aria-hidden="true" /> Nuevo cupón</Button>}>
        Los cupones creados acá funcionan en el carrito de la tienda demo de este navegador. Usos simulados.
      </AdminPageHeader>
      {creating && <div className="mb-4"><CouponForm onDone={() => setCreating(false)} /></div>}
      <ul className="grid gap-3 md:grid-cols-2">
        {paged.items.map((c) => {
          const used = c.usedCount ?? 0;
          const expired = Boolean(c.endsAt && c.endsAt < DEMO_TODAY);
          const pct = c.maxUses ? Math.min(100, Math.round((used / c.maxUses) * 100)) : null;
          return (
            <li key={c.code} className="flex flex-col gap-2 rounded-3xl bg-surface shadow-[var(--shadow-card)] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-mono text-lg font-extrabold">{c.code}</p>
                <Badge>{valueLabel(c)}</Badge>
                {c.active === false && <Badge tone="warning">Pausado</Badge>}
                {expired && <Badge tone="danger">Vencido</Badge>}
                {c.onlyRegistered && <Badge tone="neutral">Solo con cuenta</Badge>}
                {c.code.startsWith("RULETA") && <Badge tone="brand">Ruleta</Badge>}
                {c.themeId && <Badge tone="brand">Temática</Badge>}
              </div>
              <p className="text-sm text-muted">{c.description}{c.minSubtotal ? ` · mínimo ${formatARS(c.minSubtotal)}` : ""}{c.endsAt ? ` · vence ${formatDate(c.endsAt)}` : ""}</p>
              <p className="text-sm"><strong className="tabular-nums">{used}</strong>{c.maxUses ? ` de ${c.maxUses}` : ""} usos <span className="text-muted">(simulados)</span></p>
              {pct !== null && (
                <div className="h-2 overflow-hidden rounded-full bg-accent" role="progressbar" aria-label={`Usos de ${c.code}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
                  <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
              )}
              <Switch checked={c.active !== false} onChange={(v) => save(v ? `Cupón ${c.code} activado` : `Cupón ${c.code} pausado`, () => saveCoupon({ ...c, active: v }))} label={c.active === false ? "Pausado" : "Activo"} />
            </li>
          );
        })}
      </ul>
      <Pagination {...paged} noun="cupones" onPage={paged.setPage} />
      <section aria-labelledby="ruleta-admin" className="mt-10">
        <h2 id="ruleta-admin" className="font-display mb-4 text-3xl">Ruleta de cupones</h2>
        <WheelAdmin />
      </section>
    </>
  );
}
