import { Bike, Store, Truck } from "lucide-react";
import { DEMO_TODAY } from "@/demo/fixtures/admin-orders";

const fmt = new Intl.DateTimeFormat("es-AR", { weekday: "short", day: "numeric", month: "short", timeZone: "America/Argentina/Buenos_Aires" });

/** Días hábiles desde la fecha de referencia de la demo (sin feriados). */
function addBusinessDays(from: string, days: number): Date {
  const d = new Date(`${from}T12:00:00-03:00`);
  let left = days;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    const wd = d.getDay();
    if (wd !== 0 && wd !== 6) left -= 1;
  }
  return d;
}

/** Estimación ilustrativa: plazo de fabricación + tránsito, contra la fecha de referencia de la demo. */
export function DeliveryEstimate({ makeDays }: { makeDays: number }) {
  const rows = [
    { icon: Store, label: "Retiro en Mar del Plata", from: makeDays, to: makeDays + 1 },
    { icon: Bike, label: "Cadete en MdP", from: makeDays + 1, to: makeDays + 2 },
    { icon: Truck, label: "Envío al país", from: makeDays + 3, to: makeDays + 7 },
  ];
  return (
    <div className="rounded-2xl border border-line p-4">
      <p className="eyebrow mb-3 text-muted">¿Cuándo llega?</p>
      <ul className="flex flex-col gap-2.5 text-sm">
        {rows.map(({ icon: Icon, label, from, to }) => (
          <li key={label} className="flex items-center gap-3">
            <Icon size={18} aria-hidden="true" className="shrink-0 text-primary" />
            <span className="flex-1">{label}</span>
            <span className="font-bold">{fmt.format(addBusinessDays(DEMO_TODAY, from))} – {fmt.format(addBusinessDays(DEMO_TODAY, to))}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">Estimado de muestra si comprás hoy (fecha de referencia de la demo).</p>
    </div>
  );
}
