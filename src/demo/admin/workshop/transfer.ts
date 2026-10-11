import { CAPACITY_STATUSES, calendarOf, checkReschedule, loadByDay, type ScheduledOrder } from "../../engine/delivery";
import { closureFor, nextWorkday } from "../../engine/workdays";
import type { WorkshopSettings } from "../../fixtures/workshop";

/**
 * Transferir los pedidos de un día que se cierra (8.4.15, pedido de Ignacio). Las reglas son las de reprogramar un
 * pedido (fecha pasada, día sin taller, antes del plazo de fabricación); acá se suman todos los que se mueven juntos.
 */
export interface TransferPlan {
  ok: boolean;
  error?: string;
  /** Pedidos que ese día ya tenía (sin contar los que se mueven). */
  existing: number;
  /** Cómo queda el día con los que se mueven. */
  after: number;
  capacity: number;
  overloaded: boolean;
  /** Avisos por pedido (por ejemplo, antes del plazo de fabricación). */
  warnings: string[];
}

export function planTransfer(codes: string[], day: string, today: string, orders: ScheduledOrder[], settings: WorkshopSettings): TransferPlan {
  const moving = orders.filter((o) => codes.includes(o.code));
  const others = orders.filter((o) => !codes.includes(o.code));
  const existing = loadByDay(others).get(day) ?? 0;
  const after = existing + moving.filter((o) => CAPACITY_STATUSES.includes(o.status)).length;
  const capacity = settings.dailyCapacity;
  const base = { existing, after, capacity, overloaded: after > capacity };
  if (!day) return { ...base, ok: false, error: "Elegí un día.", warnings: [] };
  const warnings: string[] = [];
  for (const o of moving) {
    const r = checkReschedule(o, day, today, others, settings);
    if (!r.ok) return { ...base, ok: false, error: r.blocked === "fixed" ? `${o.code}: ${r.error}` : r.error, warnings: [] };
    // La sobrecarga se cuenta una sola vez para todo el grupo (en `after`).
    for (const w of r.warnings) if (!w.startsWith("Ese día ya tenía")) warnings.push(`${o.code}: ${w}`);
  }
  return { ...base, ok: true, warnings };
}

/** Próximos días en que el taller trabaja, con cuántos pedidos tienen (sin contar los que se van a mover). */
export function upcomingWorkdays(from: string, count: number, orders: ScheduledOrder[], settings: WorkshopSettings, exceptCodes: string[]): { day: string; used: number; capacity: number }[] {
  const cal = calendarOf(settings);
  const load = loadByDay(orders.filter((o) => !exceptCodes.includes(o.code)));
  const days: { day: string; used: number; capacity: number }[] = [];
  let day = from;
  for (let guard = 0; days.length < count && guard < 60; guard++) {
    day = nextWorkday(day, cal);
    if (!closureFor(day, cal)) days.push({ day, used: load.get(day) ?? 0, capacity: settings.dailyCapacity });
  }
  return days;
}
