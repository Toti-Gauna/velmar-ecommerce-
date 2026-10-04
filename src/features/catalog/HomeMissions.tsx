import { MissionProgress } from "@/components/molecules/MissionProgress";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { formatMissionValue, previewMission } from "@/demo/engine/missions";
import { demoAccountProgress, missions } from "@/demo/fixtures/commerce";

export function HomeMissions() {
  return (
    <section aria-labelledby="misiones">
      <SectionHeader id="misiones" title="Misiones vigentes" href="/cuenta/" linkLabel="Ver en mi cuenta">Con cuenta, cada compra pagada suma. Progreso de ejemplo.</SectionHeader>
      <div className="grid gap-3 md:grid-cols-3">
        {missions.map((m) => {
          const p = previewMission(m, demoAccountProgress[m.id] ?? 0, { units: 0, total: 0 });
          return (
            <MissionProgress key={m.id} title={m.title} reward={m.reward} pctFrom={0} pctTo={p.pctAfter}
              valueLabel={`${formatMissionValue(m, p.after)} / ${formatMissionValue(m, m.threshold)}`} status={p.alreadyComplete ? "complete" : "progress"} />
          );
        })}
      </div>
    </section>
  );
}
