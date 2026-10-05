"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input, Textarea } from "@/components/atoms/Field";
import type { Faq } from "@/demo/types";
import { useAdmin } from "@/stores/admin";
import { ListControls, moveItem } from "./ListControls";
import { useDemoSave } from "./useDemoSave";

export function FaqEditor({ initial }: { initial: Faq[] }) {
  const saveFaqs = useAdmin((s) => s.saveFaqs);
  const save = useDemoSave();
  const [faqs, setFaqs] = useState(initial);
  const patch = (i: number, p: Partial<Faq>) => setFaqs((l) => l.map((f, k) => (k === i ? { ...f, ...p } : f)));
  return (
    <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); save("Preguntas guardadas", () => saveFaqs(faqs.filter((f) => f.q.trim() && f.a.trim()))); }}>
      {faqs.map((f, i) => (
        <fieldset key={i} className="flex min-w-0 flex-col gap-3 rounded-3xl bg-surface p-4 shadow-[var(--shadow-card)] sm:p-5">
          <legend className="sr-only">Pregunta {i + 1}</legend>
          <p aria-hidden="true" className="flex items-center gap-2 border-b border-line pb-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-brass-ink">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-xs text-primary">{i + 1}</span>Pregunta frecuente
          </p>
          <label className="flex flex-col gap-1 text-sm font-bold">Pregunta<Input value={f.q} onChange={(e) => patch(i, { q: e.target.value })} /></label>
          <label className="flex flex-col gap-1 text-sm font-bold">Respuesta<Textarea value={f.a} onChange={(e) => patch(i, { a: e.target.value })} className="min-h-20" /></label>
          <div className="self-end"><ListControls index={i} length={faqs.length} label={`pregunta ${i + 1}`} onMove={(d) => setFaqs((l) => moveItem(l, i, d))} onRemove={() => setFaqs((l) => l.filter((_, k) => k !== i))} /></div>
        </fieldset>
      ))}
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={() => setFaqs((l) => [...l, { q: "", a: "" }])}><Plus size={16} aria-hidden="true" /> Agregar pregunta</Button>
        <Button type="submit" size="sm">Guardar preguntas</Button>
      </div>
    </form>
  );
}
