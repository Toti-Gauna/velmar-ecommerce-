import { Camera, CreditCard, Truck } from "lucide-react";
import { HomeSections } from "@/features/catalog/HomeSections";

const TRUST = [
  { icon: Camera, title: "Vista previa antes de pagar", text: "Aprobás tu pieza y llega igual al taller." },
  { icon: CreditCard, title: "Tarjeta, Mercado Pago, QR o transferencia", text: "Elegís cómo pagar." },
  { icon: Truck, title: "Envío o retiro", text: "Cadete en Mar del Plata y envíos al país." },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      <HomeSections />
      <ul className="grid gap-3 sm:grid-cols-3">
        {TRUST.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-3 rounded-2xl bg-surface p-4">
            <Icon className="shrink-0 text-primary" aria-hidden="true" />
            <div><p className="font-bold">{title}</p><p className="text-sm text-muted">{text}</p></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
