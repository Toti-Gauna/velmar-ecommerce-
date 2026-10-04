"use client";
import { TicketPercent, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Field";
import { validateCoupon, normalizeCode, type CouponCheck } from "@/demo/engine/coupons";
import { useCart } from "@/stores/cart";

export function CouponForm({ subtotal, isRegistered, check }: { subtotal: number; isRegistered: boolean; check: CouponCheck | null }) {
  const setCoupon = useCart((s) => s.setCoupon);
  const code = useCart((s) => s.couponCode);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  if (code && check?.ok) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-2xl bg-success-soft p-3 text-sm">
        <span className="flex items-center gap-2 font-bold text-success"><TicketPercent size={18} aria-hidden="true" /> {code}: {check.coupon.description}</span>
        <button type="button" onClick={() => setCoupon(null)} aria-label={`Quitar cupón ${code}`} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white"><X size={16} aria-hidden="true" /></button>
      </div>
    );
  }
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const result = validateCoupon(value, { subtotal, isRegistered, now: new Date() });
        setError(result.ok ? null : result.message);
        if (result.ok) setCoupon(normalizeCode(value));
      }}
    >
      <label htmlFor="coupon" className="text-sm font-bold">Cupón de descuento</label>
      <div className="flex gap-2">
        <Input id="coupon" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Ej.: BIENVENIDA10" autoCapitalize="characters" aria-invalid={Boolean(error)} aria-describedby="coupon-help" />
        <Button type="submit" variant="secondary">Aplicar</Button>
      </div>
      <p id="coupon-help" className="text-xs text-muted" role={error ? "alert" : undefined}>
        {error ?? (code && check && !check.ok ? check.message : "Cupones de muestra: BIENVENIDA10, FERIA2000, ENVIOGRATIS (con cuenta) e INVIERNO (vencido).")}
      </p>
    </form>
  );
}
