import { describe, expect, it } from "vitest";
import { isManualPayment, isProviderPayment, PAYMENT_METHODS, withKnownMethods } from "@/demo/engine/payments";
import { cardLabel, toSavedCard, TEST_CARD } from "@/demo/engine/profile";
import { demoSettings } from "@/demo/fixtures/commerce";
import type { PaymentMethod } from "@/demo/types";

/** Polish 8.4 · Lote 9: la tarjeta como medio de pago propio (8.4.22). */
const DEFAULTS = demoSettings.enabledMethods;
const OLD: PaymentMethod[] = ["CHECKOUT_PRO", "BANK_TRANSFER", "QR_MANUAL"];

describe("tarjeta como medio de pago (8.4.22)", () => {
  it("la demo nueva trae los cuatro medios activos, la tarjeta primero", () => {
    expect(DEFAULTS).toEqual(PAYMENT_METHODS);
    expect(PAYMENT_METHODS[0]).toBe("CARD");
  });
  it("ajustes guardados antes de 8.4: la tarjeta se suma activa una sola vez, sin tocar lo demás", () => {
    const migrated = withKnownMethods({ enabledMethods: OLD.filter((m) => m !== "QR_MANUAL"), other: 1 }, DEFAULTS);
    expect(migrated.enabledMethods).toEqual(["CHECKOUT_PRO", "BANK_TRANSFER", "CARD"]);
    expect(migrated.knownMethods).toEqual(PAYMENT_METHODS);
    expect(migrated.other).toBe(1);
    // Si después el dueño la apaga, al volver a cargar queda apagada.
    const off = withKnownMethods({ ...migrated, enabledMethods: ["BANK_TRANSFER"] }, DEFAULTS);
    expect(off.enabledMethods).toEqual(["BANK_TRANSFER"]);
  });
  it("un medio desconocido o una lista rota no rompen nada", () => {
    expect(withKnownMethods({ enabledMethods: ["BITCOIN", "QR_MANUAL"] as unknown as PaymentMethod[], knownMethods: PAYMENT_METHODS }, DEFAULTS).enabledMethods).toEqual(["QR_MANUAL"]);
    expect(withKnownMethods({ enabledMethods: null as unknown as PaymentMethod[] }, DEFAULTS).enabledMethods).toEqual(DEFAULTS);
  });
  it("transferencia y QR se aprueban a mano; tarjeta y Mercado Pago los confirma el proveedor", () => {
    expect(PAYMENT_METHODS.filter(isManualPayment)).toEqual(["BANK_TRANSFER", "QR_MANUAL"]);
    expect(PAYMENT_METHODS.filter(isProviderPayment)).toEqual(["CARD", "CHECKOUT_PRO"]);
  });
  it("del pedido con tarjeta solo viajan la marca y los últimos 4", () => {
    const label = cardLabel(toSavedCard(TEST_CARD, "t1"));
    expect(label).toBe("Visa terminada en 4242");
    expect(label).not.toMatch(/4242 ?4242/);
  });
});
