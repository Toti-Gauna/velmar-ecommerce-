"use client";
import { Calculator, CircleDollarSign, Flag, Percent, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { suggestedPrice, type CostRow } from "@/demo/admin/workshop/costs";
import { formatARS } from "@/lib/money";
import { cn } from "@/lib/cn";
import { useAdmin } from "@/stores/admin";
import { CommitNumberField } from "../NumberField";
import { useDemoSave } from "../useDemoSave";
import { MARGIN_TONE } from "./RecipeSheet";

const FIELD = "flex min-w-0 flex-col gap-1 [&>label]:whitespace-nowrap";
const EXAMPLE = { cost: 4000, price: 10000 };

/**
 * Valores del taller, indicadores y cómo se calcula (8.4.18, pedido de Ignacio): los tres campos van alineados en una
 * fila (etiquetas de una línea y ayuda debajo), el margen promedio y "Para revisar" son indicadores aparte, y una
 * tarjeta explica qué es cada número y para qué sirve.
 */
export function CostsSummary({ rows }: { rows: CostRow[] }) {
  const settings = useAdmin((s) => s.workshop.settings);
  const saveWorkshopSettings = useAdmin((s) => s.saveWorkshopSettings);
  const save = useDemoSave();
  const withCost = rows.filter((r) => r.margin !== null);
  const avg = withCost.length ? Math.round(withCost.reduce((s, r) => s + r.margin!, 0) / withCost.length) : null;
  const review = rows.filter((r) => r.state === "low" || r.state === "loss").length;
  const missing = rows.filter((r) => r.state === "missing").length;
  const target = settings.targetMarginPct;
  const exampleMargin = Math.round(((EXAMPLE.price - EXAMPLE.cost) / EXAMPLE.price) * 100);
  return (
    <div className="mb-5 flex flex-col gap-3">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <section aria-label="Valores del taller" className="grid gap-4 rounded-[1.75rem] bg-surface p-4 shadow-[var(--shadow-card)] sm:grid-cols-3 sm:p-5">
          <CommitNumberField id="c-machine" className={FIELD} label="Hora de máquina" suffix="$/h" value={settings.machineHourCost} hint="Luz, desgaste y repuestos"
            onCommit={(n) => save("Costo de la hora de máquina guardado", () => saveWorkshopSettings({ machineHourCost: n }))} />
          <CommitNumberField id="c-hand" className={FIELD} label="Hora a mano" suffix="$/h" value={settings.handHourCost} hint="Tu trabajo de terminación"
            onCommit={(n) => save("Costo de la hora de trabajo guardado", () => saveWorkshopSettings({ handHourCost: n }))} />
          <CommitNumberField id="c-target" className={FIELD} label="Margen objetivo" suffix="%" max={90} value={target} hint="Lo mínimo que querés que deje"
            onCommit={(n) => save(`Margen objetivo: ${n}%`, () => saveWorkshopSettings({ targetMarginPct: n }))} />
        </section>
        <section aria-label="Indicadores" className="grid grid-cols-2 gap-3">
          <div className="flex flex-col justify-center rounded-[1.75rem] bg-surface p-4 shadow-[var(--shadow-card)] sm:p-5">
            <p className="text-sm font-bold text-muted">Margen promedio</p>
            <p className={cn("text-3xl font-extrabold tabular-nums", avg !== null && avg < target ? "text-warning" : "text-success")}>{avg === null ? "—" : `${avg}%`}</p>
            <p className="text-xs text-muted">{avg === null ? "Cargá costos para verlo" : avg < target ? `Por debajo del ${target}%` : `Arriba del objetivo (${target}%)`}</p>
          </div>
          <div className="flex flex-col justify-center rounded-[1.75rem] bg-surface p-4 shadow-[var(--shadow-card)] sm:p-5">
            <p className="text-sm font-bold text-muted">Para revisar</p>
            <p className={cn("text-3xl font-extrabold tabular-nums", MARGIN_TONE.low)}>{review}</p>
            <p className="text-xs text-muted">{missing} sin costo cargado</p>
          </div>
        </section>
      </div>
      <section aria-labelledby="costs-how" className="rounded-[1.75rem] bg-night p-5 text-[#f6f1e8] sm:p-6">
        <h2 id="costs-how" className="font-display text-2xl">Cómo se calcula y para qué sirve</h2>
        <p className="mt-1 max-w-3xl text-sm text-[#cfc6b3]">Con esto sabés cuánto te deja cada producto al precio de hoy y cuál tendrías que cobrar para llegar a tu margen.</p>
        <ul className="mt-4 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
          <Item icon={Calculator} title="Costo">Insumos de la receta + horas de máquina + horas a mano, cada una a su valor de arriba.</Item>
          <Item icon={CircleDollarSign} title="Ganancia y margen">Ganancia = precio − costo. Margen = la ganancia sobre el precio: ej., costo {formatARS(EXAMPLE.cost)} y precio {formatARS(EXAMPLE.price)} dan {exampleMargin}%.</Item>
          <Item icon={Percent} title="Precio sugerido">El precio para llegar a tu margen objetivo: con {target}%, ese mismo costo pide {formatARS(suggestedPrice(EXAMPLE.cost, target))}.</Item>
          <Item icon={Flag} title="Para revisar">Productos por debajo del objetivo o que dan pérdida. Tocá uno para ajustar la receta o aplicar el precio sugerido.</Item>
        </ul>
        <p className="mt-4 flex gap-2 text-xs text-[#cfc6b3]"><TriangleAlert size={14} aria-hidden="true" className="mt-px shrink-0 text-brass" />Valores de muestra: cambiá las horas y los insumos por los reales del taller. Solo se guardan en este navegador.</p>
      </section>
    </div>
  );
}

function Item({ icon: Icon, title, children }: { icon: typeof Calculator; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-3 rounded-2xl bg-white/[0.06] p-3 ring-1 ring-white/10">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brass/20 text-brass"><Icon size={17} aria-hidden="true" /></span>
      <span><span className="block font-bold">{title}</span><span className="text-[#cfc6b3]">{children}</span></span>
    </li>
  );
}
