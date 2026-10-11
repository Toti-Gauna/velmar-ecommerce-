"use client";
import { ArrowRight, CalendarClock, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { StatusBadge } from "@/components/molecules/StatusBadge";
import { planTransfer, upcomingWorkdays, type TransferPlan } from "@/demo/admin/workshop/transfer";
import { formatDay } from "@/lib/date";
import { cn } from "@/lib/cn";
import { useAdmin } from "@/stores/admin";
import { useToasts } from "@/stores/toast";
import { PickDate } from "./PickDate";

interface Props { day: string; codes: string[]; today: string; onDone: () => void }

/**
 * Después de cerrar un día con entregas (8.4.15, pedido de Ignacio): "¿Querés transferir los pedidos a otro día?".
 * Propone los próximos días con taller y su carga, deja elegir cualquier fecha (todos juntos o uno por uno) y avisa si
 * el día elegido ya tiene pedidos, se pasa de la capacidad o no se puede. "Dejarlos para después" los deja marcados.
 */
export function TransferPanel({ day, codes, today, onDone }: Props) {
  const { orders, workshop, rescheduleOrder } = useAdmin();
  const toast = useToasts((s) => s.push);
  const settings = workshop.settings;
  const moving = orders.filter((o) => codes.includes(o.code));
  const options = upcomingWorkdays(day < today ? today : day, 5, orders, settings, codes).map((o) => ({ ...o, plan: planTransfer(codes, o.day, today, orders, settings) }));
  const [each, setEach] = useState(false);
  const [target, setTarget] = useState(options.find((o) => o.plan.ok && !o.plan.overloaded)?.day ?? options[0]?.day ?? "");
  const [targets, setTargets] = useState<Record<string, string>>(() => Object.fromEntries(codes.map((c) => [c, target])));
  const plans = each ? moving.map((o) => planTransfer([o.code], targets[o.code] ?? "", today, orders, settings)) : [planTransfer(codes, target, today, orders, settings)];
  const blocked = plans.find((p) => !p.ok);
  const over = plans.some((p) => p.ok && p.overloaded);
  const transfer = () => {
    const moves = moving.map((o) => [o.code, each ? targets[o.code]! : target] as const);
    const results = moves.map(([code, d]) => rescheduleOrder(code, d));
    if (results.some((r) => !r.ok)) return toast({ tone: "error", title: "No se pudieron mover todos", description: results.find((r) => !r.ok)?.error });
    toast({ tone: over ? "info" : "success", title: each ? `${moves.length} pedidos reprogramados` : `${moves.length === 1 ? "El pedido pasa" : `Los ${moves.length} pedidos pasan`} al ${formatDay(target)}`,
      description: over ? "Quedó un día sobrecargado: revisalo en el calendario." : "Cambio guardado solo en esta demo. En producción, cada cliente recibiría la fecha nueva." });
    onDone();
  };
  return (
    <section aria-labelledby="transfer-title" className="flex flex-col gap-4">
      <div className="rounded-2xl bg-night p-4 text-[#f6f1e8]">
        <p className="eyebrow flex items-center gap-2 text-brass"><CalendarClock size={14} aria-hidden="true" /> Día cerrado</p>
        <h3 id="transfer-title" className="font-display mt-1 text-2xl leading-tight">¿Querés transferir los pedidos de este día a otro?</h3>
        <p className="mt-1 text-sm text-[#cfc6b3]">El {formatDay(day, "long")} el taller no trabaja y {codes.length === 1 ? "este pedido tenía" : `estos ${codes.length} pedidos tenían`} entrega ese día.</p>
      </div>
      <div role="radiogroup" aria-label="Cómo transferirlos" className="grid grid-cols-2 gap-2 rounded-full bg-surface p-1 shadow-[var(--shadow-card)]">
        {[{ v: false, t: "Todos al mismo día" }, { v: true, t: "Un día por pedido" }].map((m) => (
          <button key={m.t} type="button" role="radio" aria-checked={each === m.v} onClick={() => { setEach(m.v); if (m.v) setTargets(Object.fromEntries(codes.map((c) => [c, target]))); }}
            className={cn("min-h-11 rounded-full px-3 text-sm font-bold transition-colors", each === m.v ? "bg-night text-[#f6f1e8]" : "text-muted hover:text-ink")}>{m.t}</button>
        ))}
      </div>
      {!each ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-bold">Próximos días con taller</p>
          <div role="radiogroup" aria-label="Próximos días con taller" className="grid grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] gap-2">
            {options.map((o) => {
              const full = o.plan.overloaded;
              return (
                <button key={o.day} type="button" role="radio" aria-checked={target === o.day} onClick={() => setTarget(o.day)}
                  className={cn("flex flex-col items-start rounded-2xl border-2 p-3 text-left text-sm transition-colors", target === o.day ? "border-primary bg-accent/40" : "border-transparent bg-surface shadow-[var(--shadow-card)] hover:border-ink/15")}>
                  <span className="font-bold first-letter:uppercase">{formatDay(o.day)}</span>
                  <span className={cn("text-xs font-semibold", full ? "text-warning" : "text-muted")}>{o.used ? `${o.used} de ${o.capacity} pedidos` : "Sin pedidos"}{full ? " · se pasa" : ""}</span>
                </button>
              );
            })}
          </div>
          <PickDate key={target} id="transfer-date" label="O elegí cualquier otra fecha" min={today} value={target} action="Elegir" onPick={setTarget} />
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {moving.map((o, i) => (
            <li key={o.code} className="flex flex-col gap-2 rounded-2xl bg-surface p-3 shadow-[var(--shadow-card)]">
              <p className="flex flex-wrap items-center gap-2 text-sm font-bold">{o.code} · {o.customer.name} <StatusBadge status={o.status} /></p>
              <PickDate key={targets[o.code]} id={`transfer-${o.code}`} label={`Nueva fecha para ${o.code}`} min={today} value={targets[o.code] ?? ""} action="Elegir" onPick={(d) => setTargets((t) => ({ ...t, [o.code]: d }))} />
              <PlanNote plan={plans[i]!} day={targets[o.code] ?? ""} />
            </li>
          ))}
        </ul>
      )}
      {!each && (
        <>
          <ul aria-label="Pedidos a transferir" className="flex flex-col gap-1.5 text-sm">
            {moving.map((o) => <li key={o.code} className="flex flex-wrap items-center gap-2"><span className="font-bold">{o.code}</span><span className="text-muted">{o.customer.name}</span><ArrowRight size={14} aria-hidden="true" className="text-muted" /><span className="font-semibold first-letter:uppercase">{target ? formatDay(target) : "—"}</span></li>)}
          </ul>
          <PlanNote plan={plans[0]!} day={target} />
        </>
      )}
      <div className="flex flex-wrap justify-end gap-2 border-t border-line pt-4">
        <Button variant="ghost" onClick={onDone}>Dejarlos para después</Button>
        <Button disabled={Boolean(blocked)} onClick={transfer}>{over ? "Transferir igual" : codes.length === 1 ? "Transferir el pedido" : "Transferir los pedidos"}</Button>
      </div>
    </section>
  );
}

/** Cómo queda el día elegido: libre, con pedidos, sobrecargado o no se puede (con el motivo). */
function PlanNote({ plan, day }: { plan: TransferPlan; day: string }) {
  if (!day) return null;
  if (!plan.ok) return <p role="alert" className="flex gap-2 rounded-2xl bg-danger-soft p-3 text-sm font-semibold text-danger"><TriangleAlert size={16} aria-hidden="true" className="mt-0.5 shrink-0" />{plan.error}</p>;
  const lines = [
    plan.existing ? `Ese día ya tiene ${plan.existing} ${plan.existing === 1 ? "pedido" : "pedidos"}: con estos queda en ${plan.after} de ${plan.capacity}${plan.overloaded ? " y se pasa de la capacidad del taller" : ""}.` : `Ese día no tiene otros pedidos: queda en ${plan.after} de ${plan.capacity}.`,
    ...plan.warnings,
  ];
  const warn = plan.existing > 0 || plan.warnings.length > 0;
  return (
    <ul role="status" className={cn("flex flex-col gap-1 rounded-2xl p-3 text-sm font-semibold", plan.overloaded || warn ? "bg-warning-soft text-warning" : "bg-success-soft text-success")}>
      {lines.map((l) => <li key={l} className="flex gap-2">{warn && <TriangleAlert size={16} aria-hidden="true" className="mt-0.5 shrink-0" />}{l}</li>)}
    </ul>
  );
}
