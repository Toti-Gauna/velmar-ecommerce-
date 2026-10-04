import { coupons } from "../fixtures/commerce";
import type { Coupon } from "../types";

export type CouponCheck = { ok: true; coupon: Coupon } | { ok: false; message: string };

export function normalizeCode(code: string): string {
  return code.toUpperCase().replace(/\s+/g, "");
}

export function validateCoupon(rawCode: string, ctx: { subtotal: number; isRegistered: boolean; now: Date }): CouponCheck {
  const code = normalizeCode(rawCode);
  if (!code) return { ok: false, message: "Ingresá un código." };
  const coupon = coupons.find((c) => c.code === code);
  if (!coupon) return { ok: false, message: `El cupón ${code} no existe. Revisá cómo lo escribiste.` };
  if (coupon.endsAt && ctx.now > new Date(`${coupon.endsAt}T23:59:59`)) {
    return { ok: false, message: `El cupón ${code} venció. Probá con otro.` };
  }
  if (coupon.onlyRegistered && !ctx.isRegistered) {
    return { ok: false, message: `${code} es solo para compras con cuenta. Ingresá con la cuenta demo para usarlo.` };
  }
  if (coupon.minSubtotal && ctx.subtotal < coupon.minSubtotal) {
    return { ok: false, message: `${code} aplica desde ${coupon.minSubtotal.toLocaleString("es-AR")} pesos de compra.` };
  }
  return { ok: true, coupon };
}

export function couponDiscount(coupon: Coupon | null, subtotal: number): number {
  if (!coupon) return 0;
  if (coupon.type === "PERCENT") return Math.round((subtotal * coupon.value) / 100);
  if (coupon.type === "FIXED") return Math.min(coupon.value, subtotal);
  return 0;
}
