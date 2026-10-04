"use client";
import { CheckCircle2, Gift } from "lucide-react";
import { ProgressRing } from "@/components/molecules/ProgressRing";
import { formatMissionValue, previewMission } from "@/demo/engine/missions";
import type { Mission } from "@/demo/types";
import { cn } from "@/lib/cn";

/** Misión con anillo de progreso, premio y estado (texto + ícono, nunca solo color). */
export function MissionCard({ mission, progress, dark }: { mission: Mission; progress: number; dark?: boolean }) {
  const p = previewMission(mission, progress, { units: 0, total: 0 });
  const done = p.alreadyComplete;
  return (
    <article className={cn("flex h-full flex-col gap-4 rounded-[1.75rem] p-5", dark ? "bg-night-2 text-[#f6f1e8]" : "bg-surface shadow-[var(--shadow-card)]")}>
      <div className="flex items-center gap-4">
        <ProgressRing pct={p.pctAfter} size={84} stroke={8} tone={done ? "success" : dark ? "brass" : "primary"} label={`Progreso de ${mission.title}`}>
          {done ? <CheckCircle2 size={26} aria-hidden="true" className="text-success" /> : <span className="text-sm font-extrabold tabular-nums">{p.pctAfter}%</span>}
        </ProgressRing>
        <div className="min-w-0">
          <h3 className="font-display text-2xl leading-tight">{mission.title}</h3>
          <p className={cn("text-sm", dark ? "text-[#cfc6b3]" : "text-muted")}>{mission.description}</p>
        </div>
      </div>
      <div className={cn("mt-auto flex items-center justify-between gap-3 rounded-2xl px-4 py-3", dark ? "bg-white/5" : "bg-accent/50")}>
        <span className="flex items-center gap-2 text-sm font-bold"><Gift size={16} aria-hidden="true" className={dark ? "text-brass" : "text-brass-ink"} />{mission.reward}</span>
        <span className="text-xs font-bold tabular-nums">{done ? "¡Completada!" : `${formatMissionValue(mission, p.after)} / ${formatMissionValue(mission, mission.threshold)}`}</span>
      </div>
    </article>
  );
}
