import { describe, expect, it } from "vitest";
import { SOUND_LEVEL, SOUNDS } from "@/lib/sound-kit";
import { isTypingField, soundForTap, type TapTarget } from "@/lib/uiSounds";

/** Polish 8.4 · Lote 11: sonidos en toda la tienda y el panel (8.4.29). */
const t = (p: Partial<TapTarget>): TapTarget => ({ tag: "button", role: null, type: null, sound: null, wasChecked: false, checked: false, disabled: false, href: null, external: false, ...p });

describe("qué suena al tocar (8.4.29)", () => {
  it("botones, links internos y externos", () => {
    expect(soundForTap(t({}))).toBe("tap");
    expect(soundForTap(t({ tag: "a", href: "/categorias/" }))).toBe("nav");
    expect(soundForTap(t({ tag: "a", href: "https://wa.me/", external: true }))).toBe("tap");
    expect(soundForTap(t({ tag: "a", href: "#ofertas" }))).toBe("tap");
    expect(soundForTap(t({ tag: "div", role: "button" }))).toBe("tap");
    expect(soundForTap(t({ tag: "summary" }))).toBe("tap");
  });
  it("interruptores y casillas suenan distinto al prender y al apagar", () => {
    expect(soundForTap(t({ role: "switch", wasChecked: false }))).toBe("toggleOn");
    expect(soundForTap(t({ role: "switch", wasChecked: true }))).toBe("toggleOff");
    expect(soundForTap(t({ tag: "input", type: "checkbox", checked: true }))).toBe("toggleOn");
    expect(soundForTap(t({ tag: "input", type: "checkbox", checked: false }))).toBe("toggleOff");
  });
  it("opciones, pestañas y radios eligen; los campos de texto suenan al escribir, no al tocarlos", () => {
    expect(soundForTap(t({ tag: "input", type: "radio" }))).toBe("select");
    expect(soundForTap(t({ role: "tab" }))).toBe("select");
    expect(soundForTap(t({ tag: "div", role: "option" }))).toBe("select");
    expect(soundForTap(t({ tag: "input", type: "text" }))).toBeNull();
    expect(soundForTap(t({ tag: "label" }))).toBeNull();
    expect(isTypingField("input", null, false)).toBe(true);
    expect(isTypingField("input", "email", false)).toBe(true);
    expect(isTypingField("textarea", null, false)).toBe(true);
    expect(isTypingField("div", null, true)).toBe(true);
    expect(isTypingField("input", "password", false)).toBe(false);
    expect(isTypingField("input", "range", false)).toBe(false);
  });
  it("data-sound pide otro sonido o ninguno; deshabilitado no suena", () => {
    expect(soundForTap(t({ sound: "up" }))).toBe("up");
    expect(soundForTap(t({ sound: "remove" }))).toBe("remove");
    expect(soundForTap(t({ sound: "none" }))).toBeNull();
    expect(soundForTap(t({ sound: "inventado" }))).toBeNull();
    expect(soundForTap(t({ disabled: true }))).toBeNull();
  });
  it("cada sonido tiene receta y prioridad; los de compra tapan a los de interfaz", () => {
    expect(Object.keys(SOUND_LEVEL).sort()).toEqual(Object.keys(SOUNDS).sort());
    expect(SOUND_LEVEL.add).toBeGreaterThan(SOUND_LEVEL.success);
    expect(SOUND_LEVEL.success).toBeGreaterThan(SOUND_LEVEL.tap);
    expect(SOUND_LEVEL.product).toBeGreaterThan(SOUND_LEVEL.nav);
  });
});
