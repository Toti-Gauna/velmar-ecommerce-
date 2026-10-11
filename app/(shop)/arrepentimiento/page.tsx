import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, FileCheck2, MessageCircle, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/templates/PageHeader";
import { WithdrawalForm } from "@/features/legal/WithdrawalForm";

export const metadata: Metadata = { title: "Botón de arrepentimiento" };

const STEPS = [
  { icon: FileCheck2, title: "Completás el formulario", text: "Sin registrarte ni iniciar sesión. Con el código del pedido es más rápido, pero no es obligatorio." },
  { icon: Sparkles, title: "Te damos un código al instante", text: "Es tu constancia de que pediste revocar la compra." },
  { icon: MessageCircle, title: "Velmar te contacta", text: "Coordinan la devolución del producto y el reintegro por el mismo medio de pago." },
];

/**
 * Botón de arrepentimiento (8.4.24): en tablet y escritorio, el formulario en una tarjeta y al lado "Cómo funciona",
 * con el plazo y qué pasa después; en el celular, uno debajo del otro.
 */
export default function WithdrawalPage() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <PageHeader title="Botón de arrepentimiento">
        Podés revocar la compra dentro de los 10 días corridos desde la entrega, sin registrarte (Res. 424/2020). Te damos un código al instante.
      </PageHeader>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-start lg:gap-10">
        <div className="@container"><WithdrawalForm /></div>
        <aside aria-label="Cómo funciona" className="flex flex-col gap-4 md:sticky md:top-24">
          <section className="rounded-[var(--radius-card)] bg-night p-5 text-[#f6f1e8] sm:p-6">
            <h2 className="font-display text-2xl">Cómo funciona</h2>
            <ol className="mt-4 flex flex-col gap-4">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brass/20 text-sm font-extrabold text-brass">{i + 1}</span>
                  <span><span className="flex items-center gap-1.5 font-bold"><s.icon size={15} aria-hidden="true" className="text-brass" /> {s.title}</span><span className="text-sm text-[#cfc6b3]">{s.text}</span></span>
                </li>
              ))}
            </ol>
          </section>
          <section className="flex gap-3 rounded-[var(--radius-card)] border border-line bg-surface p-5">
            <CalendarClock size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
            <div className="text-sm">
              <h2 className="font-bold">Plazo: 10 días corridos</h2>
              <p className="mt-1 text-muted">Se cuentan desde que recibís el producto. Los productos hechos a medida con tu nombre o tu foto pueden no tener derecho de arrepentimiento: te lo avisamos antes de pagar.</p>
              <p className="mt-2"><Link href="/terminos/" className="font-bold text-primary underline">Términos y condiciones</Link> · <Link href="/preguntas/" className="font-bold text-primary underline">Preguntas frecuentes</Link></p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
