import { beforeEach, describe, expect, it } from "vitest";
import { defaultDemoData, demoData, setDemoData } from "@/demo/engine/source";
import { currentTheme, inSeason, nextTheme, offerPrice, themeForDate, themeOffer, themeProducts } from "@/demo/engine/themes";
import { walletCoupons } from "@/demo/engine/wallet";

const at = (iso: string) => new Date(`${iso}T12:00:00`);

describe("temáticas", () => {
  beforeEach(() => setDemoData(defaultDemoData()));

  it("elige la temática por fecha y se repite cada año", () => {
    expect(themeForDate(demoData().themes, at("2026-10-05"))?.id).toBe("dia-de-la-madre");
    expect(themeForDate(demoData().themes, at("2026-10-31"))?.id).toBe("halloween");
    expect(themeForDate(demoData().themes, at("2031-10-25"))?.id).toBe("halloween");
    expect(themeForDate(demoData().themes, at("2026-09-10"))).toBeNull();
  });

  it("contempla rangos que cruzan el año", () => {
    const range = { startsOn: "2026-12-26", endsOn: "2027-01-06" };
    expect(inSeason(range, at("2026-12-31"))).toBe(true);
    expect(inSeason(range, at("2027-01-03"))).toBe(true);
    expect(inSeason(range, at("2027-01-07"))).toBe(false);
  });

  it("la vista previa manda; después el modo del panel", () => {
    const now = at("2026-10-05");
    expect(currentTheme(now, "navidad")?.id).toBe("navidad");
    setDemoData({ ...demoData(), themeSettings: { mode: "fixed", fixedId: "san-patricio", showTryButton: true } });
    expect(currentTheme(now, null)?.id).toBe("san-patricio");
    setDemoData({ ...demoData(), themeSettings: { mode: "off", fixedId: "san-patricio", showTryButton: true } });
    expect(currentTheme(now, null)).toBeNull();
  });

  it("una temática deshabilitada no entra en el modo automático", () => {
    setDemoData({ ...demoData(), themes: demoData().themes.map((t) => (t.id === "halloween" ? { ...t, active: false } : t)) });
    expect(themeForDate(demoData().themes, at("2026-10-25"))).toBeNull();
    expect(nextTheme(at("2026-10-20"))?.id).toBe("black-friday");
  });

  it("arma la oferta desde su cupón y calcula el precio con descuento", () => {
    const halloween = demoData().themes.find((t) => t.id === "halloween")!;
    const offer = themeOffer(halloween)!;
    expect(offer.label).toBe("20% OFF");
    expect(offerPrice(10000, offer)).toBe(8000);
    const black = themeOffer(demoData().themes.find((t) => t.id === "black-friday")!)!;
    expect(black.condition).toBe("Desde $30.000 de compra");
    expect(offerPrice(10000, black)).toBeNull();
    setDemoData({ ...demoData(), coupons: demoData().coupons.map((c) => (c.code === "BOO20" ? { ...c, active: false } : c)) });
    expect(themeOffer(halloween)).toBeNull();
  });

  it("omite productos pausados de la oferta", () => {
    const halloween = demoData().themes.find((t) => t.id === "halloween")!;
    setDemoData({ ...demoData(), products: demoData().products.map((p) => (p.slug === "vela-caniche" ? { ...p, active: false } : p)) });
    expect(themeProducts(halloween).map((p) => p.slug)).not.toContain("vela-caniche");
  });

  it("el cupón de una temática solo aparece en Mis cupones mientras está puesta", () => {
    const ctx = { subtotal: 50000, isRegistered: false, now: at("2026-10-25"), wheelCode: null };
    expect(walletCoupons(ctx).some((w) => w.coupon.code === "BOO20")).toBe(false);
    expect(walletCoupons({ ...ctx, themeId: "halloween" }).some((w) => w.coupon.code === "BOO20")).toBe(true);
  });
});
