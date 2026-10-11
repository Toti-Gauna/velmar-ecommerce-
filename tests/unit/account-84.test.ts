import { describe, expect, it } from "vitest";
import {
  TEST_CARD, cardBrand, cardExpiry, cardLabel, checkAddress, checkCard, formatCardNumber, formatExpiry, luhn, normalizeAddresses, normalizeCards, toSavedCard,
} from "@/demo/engine/profile";

/** Polish 8.4 · Lote 4: direcciones y tarjetas de la cuenta (demo). */
const today = new Date("2026-10-11T12:00:00-03:00");

describe("tarjetas de demostración (8.4.22)", () => {
  it("detecta la marca y valida el número con Luhn", () => {
    expect(cardBrand("4242 4242 4242 4242")).toBe("visa");
    expect(cardBrand("5555 5555 5555 4444")).toBe("mastercard");
    expect(cardBrand("2223 0031 2200 3222")).toBe("mastercard");
    expect(cardBrand("3782 822463 10005")).toBe("amex");
    expect(cardBrand("5895 6200 0000 0000")).toBe("naranja");
    expect(luhn(TEST_CARD.number)).toBe(true);
    expect(luhn("4242 4242 4242 4241")).toBe(false);
    expect(formatCardNumber("4242424242424242")).toBe("4242 4242 4242 4242");
    expect(formatCardNumber("378282246310005")).toBe("3782 822463 10005");
    expect(formatExpiry("1229")).toBe("12/29");
  });

  it("avisa cada error con un mensaje claro; la de prueba pasa", () => {
    expect(checkCard(TEST_CARD, today)).toEqual({});
    const e = checkCard({ number: "1234", expiry: "13/30", holder: "A", cvv: "1" }, today);
    expect(e.number).toMatch(/no es una tarjeta válida/);
    expect(e.expiry).toMatch(/MM\/AA/);
    expect(e.holder).toMatch(/como figura/);
    expect(e.cvv).toMatch(/3 números/);
    expect(checkCard({ ...TEST_CARD, expiry: "09/26" }, today).expiry).toBe("Esa tarjeta ya venció.");
    expect(checkCard({ ...TEST_CARD, expiry: "10/26" }, today).expiry).toBeUndefined();
    expect(checkCard({ number: "3782 822463 10005", expiry: "12/29", holder: "Prueba", cvv: "123" }, today).cvv).toMatch(/4 números/);
  });

  it("de la tarjeta se guarda solo marca, últimos 4 y vencimiento (nunca el número, el código ni el titular)", () => {
    const saved = toSavedCard(TEST_CARD, "t1");
    expect(saved).toEqual({ id: "t1", brand: "visa", last4: "4242", expMonth: 12, expYear: 2029 });
    const json = JSON.stringify(saved);
    expect(json).not.toContain("4242 4242");
    expect(json).not.toContain(TEST_CARD.cvv);
    expect(json).not.toContain(TEST_CARD.holder);
    expect(cardLabel(saved)).toBe("Visa terminada en 4242");
    expect(cardExpiry(saved)).toBe("12/29");
  });

  it("datos guardados tocados a mano: se descarta lo inválido y se quitan los campos que no se permiten", () => {
    const list = normalizeCards([
      { id: "a", brand: "visa", last4: "4242", expMonth: 12, expYear: 2029, number: "4242424242424242", cvv: "123" },
      { id: "b", brand: "visa", last4: "42", expMonth: 12, expYear: 2029 },
      { id: "c", brand: "trucha", last4: "1111", expMonth: 1, expYear: 2030 },
      null,
    ]);
    expect(list).toEqual([{ id: "a", brand: "visa", last4: "4242", expMonth: 12, expYear: 2029 }]);
    expect(normalizeCards("roto")).toEqual([]);
  });
});

describe("direcciones guardadas (8.4.6)", () => {
  const ok = { label: "Casa", street: "Güemes", number: "2500", postalCode: "7600", city: "Mar del Plata", province: "Buenos Aires" };
  it("mismas reglas que el checkout", () => {
    expect(checkAddress(ok)).toEqual({});
    expect(checkAddress({ ...ok, postalCode: "76" }).postalCode).toMatch(/4 dígitos/);
    expect(checkAddress({ ...ok, label: " " }).label).toMatch(/Casa, Trabajo/);
  });
  it("las inválidas o rotas se descartan al cargar; las buenas quedan igual", () => {
    expect(normalizeAddresses([{ id: "d1", ...ok }, { id: "d2", ...ok, street: "" }, 7])).toEqual([{ id: "d1", ...ok }]);
    expect(normalizeAddresses(undefined)).toEqual([]);
  });
});
