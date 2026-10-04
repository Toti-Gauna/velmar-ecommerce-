"use client";
import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Field";
import { useAdmin } from "@/stores/admin";
import { AdminPageHeader } from "./AdminPageHeader";
import { FaqEditor } from "./FaqEditor";
import { SlidesEditor } from "./SlidesEditor";
import { useDemoSave } from "./useDemoSave";

function HomeCtaEditor() {
  const cta = useAdmin((s) => s.data.content.homeCta);
  const saveHomeCta = useAdmin((s) => s.saveHomeCta);
  const save = useDemoSave();
  const [d, setD] = useState(cta);
  return (
    <form className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-3" onSubmit={(e) => { e.preventDefault(); save("Textos de inicio guardados", () => saveHomeCta(d)); }}>
      <label className="flex flex-col gap-1 text-sm font-bold">Título del bloque “Crear”<Input value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} /></label>
      <label className="flex flex-col gap-1 text-sm font-bold">Texto<Input value={d.text} onChange={(e) => setD({ ...d, text: e.target.value })} /></label>
      <Button type="submit" size="sm" className="self-start">Guardar textos</Button>
    </form>
  );
}

export function ContentAdmin() {
  const content = useAdmin((s) => s.data.content);
  return (
    <>
      <AdminPageHeader title="Contenido">Carrusel, textos de inicio y preguntas frecuentes. Se ven en la tienda de este navegador sin deploy.</AdminPageHeader>
      <div className="flex flex-col gap-8">
        <section aria-labelledby="car"><h2 id="car" className="mb-3 text-lg font-extrabold">Carrusel</h2><SlidesEditor initial={content.slides} /></section>
        <section aria-labelledby="txt"><h2 id="txt" className="mb-3 text-lg font-extrabold">Textos de inicio</h2><HomeCtaEditor /></section>
        <section aria-labelledby="faq"><h2 id="faq" className="mb-3 text-lg font-extrabold">Preguntas frecuentes</h2><FaqEditor initial={content.faqs} /></section>
      </div>
    </>
  );
}
