"use client";
import { MissionProgress } from "@/components/molecules/MissionProgress";
import { formatMissionValue, previewMission } from "@/demo/engine/missions";
import { demoAccountProgress, missions } from "@/demo/fixtures/commerce";

/** Progreso ILUSTRATIVO de la misión "Comprá 2 productos" con el carrito actual. */
export function CartMission({ units, total, isRegistered }: { units: number; total: number; isRegistered: boolean }) {
  const mission = missions[0]!;
  const current = isRegistered ? (demoAccountProgress[mission.id] ?? 0) : 0;
  const p = previewMission(mission, current, { units, total });
  const label = `${formatMissionValue(mission, p.after)} / ${mission.threshold}`;
  if (!isRegistered) {
    return (
      <MissionProgress title={mission.title} reward={mission.reward} pctFrom={0} pctTo={p.pctAfter} valueLabel={label} status="progress"
        note={`Con cuenta, este pedido sumaba ${Math.min(units, mission.threshold)} a la misión. Podés comprar igual como invitado. (Ilustrativo: en la tienda real cuenta al confirmarse el pago.)`} compact />
    );
  }
  return (
    <MissionProgress title={mission.title} reward={mission.reward} pctFrom={p.pctBefore} pctTo={p.pctAfter} valueLabel={label}
      status={p.alreadyComplete ? "complete" : p.completesNow ? "completes-now" : "progress"}
      note={p.completesNow ? "El premio se acredita cuando el pedido queda pagado. (Ilustrativo)" : `Te falta ${p.remaining} para el premio. (Ilustrativo)`} compact />
  );
}
