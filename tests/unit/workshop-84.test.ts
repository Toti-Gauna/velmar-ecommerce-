import { beforeEach, describe, expect, it } from "vitest";
import { planTransfer, upcomingWorkdays } from "@/demo/admin/workshop/transfer";
import { DEMO_TODAY } from "@/demo/fixtures/admin-orders";
import { useAdmin } from "@/stores/admin";

/** Polish 8.4 · Lote 6: transferir los pedidos de un día que se cierra (8.4.15). */
const state = () => useAdmin.getState();
const settings = () => state().workshop.settings;
const plan = (codes: string[], day: string) => planTransfer(codes, day, DEMO_TODAY, state().orders, settings());
const DAY_9 = ["VEL-000125", "VEL-000110", "VEL-000109"];
beforeEach(() => state().resetAdmin());

describe("transferir pedidos de un día cerrado (8.4.15)", () => {
  it("propone los próximos días con taller después del cerrado, sin domingos ni feriados, con su carga sin contar los que se mueven", () => {
    expect(upcomingWorkdays("2026-10-09", 5, state().orders, settings(), DAY_9)).toEqual([
      { day: "2026-10-13", used: 0, capacity: 3 }, { day: "2026-10-14", used: 1, capacity: 3 }, { day: "2026-10-15", used: 0, capacity: 3 },
      { day: "2026-10-16", used: 0, capacity: 3 }, { day: "2026-10-19", used: 1, capacity: 3 },
    ]);
  });
  it("un día libre entra; uno con pedidos avisa cuántos tenía y cómo queda; si se pasa de la capacidad lo marca una sola vez", () => {
    expect(plan(["VEL-000123"], "2026-10-15")).toMatchObject({ ok: true, existing: 0, after: 1, overloaded: false, warnings: [] });
    expect(plan(["VEL-000123"], "2026-10-19")).toMatchObject({ ok: true, existing: 1, after: 2, overloaded: false });
    const over = plan(DAY_9, "2026-10-08");
    expect(over).toMatchObject({ ok: true, existing: 3, after: 6, capacity: 3, overloaded: true });
    expect(over.warnings.every((w) => !w.includes("Ese día ya tenía"))).toBe(true);
    expect(over.warnings).toContain("VEL-000125: Queda antes del plazo de fabricación (5 días hábiles).");
    expect(plan(DAY_9, "2026-10-13")).toMatchObject({ ok: true, after: 3, overloaded: false });
  });
  it("no deja pasarlos a un día sin taller, a un feriado, a una fecha pasada ni sin fecha", () => {
    expect(plan(["VEL-000123"], "2026-10-11")).toMatchObject({ ok: false, error: "Domingo sin taller: el taller no trabaja ese día." });
    expect(plan(["VEL-000123"], "2026-10-12")).toMatchObject({ ok: false, error: "Día de la Diversidad Cultural: el taller no trabaja ese día." });
    expect(plan(["VEL-000123"], "2026-10-03")).toMatchObject({ ok: false, error: "No se puede comprometer una fecha que ya pasó." });
    expect(plan(["VEL-000123"], "")).toMatchObject({ ok: false, error: "Elegí un día." });
  });
  it("calcular el plan no mueve nada; reprogramar con la fecha elegida sí", () => {
    plan(DAY_9, "2026-10-13");
    expect(state().orders.find((o) => o.code === "VEL-000110")!.promisedDate).toBe("2026-10-09");
    for (const code of DAY_9) expect(state().rescheduleOrder(code, "2026-10-13").ok).toBe(true);
    expect(state().orders.filter((o) => o.promisedDate === "2026-10-13").map((o) => o.code).sort()).toEqual([...DAY_9].sort());
  });
});
