"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Field";
import { Select } from "@/components/atoms/Select";
import { Switch } from "@/components/atoms/Switch";
import type { ArtKey, CarouselSlide } from "@/demo/types";
import { useAdmin } from "@/stores/admin";
import { ListControls, moveItem } from "./ListControls";
import { useDemoSave } from "./useDemoSave";

const LINKS = [["/crear/", "Crear mi producto"], ["/categorias/", "Categorías"], ["/c/comederos/", "Comederos"], ["/c/llaveros-nfc/", "Llaveros NFC"], ["/c/iluminacion/", "Iluminación"], ["/c/hogar/", "Aromas"], ["/preguntas/", "Preguntas"]];
const ARTS: ArtKey[] = ["lamp-photo", "bowl-dog", "diffuser", "nfc-tag", "collar", "candle-poodle", "dachshund"];

export function SlidesEditor({ initial }: { initial: CarouselSlide[] }) {
  const saveSlides = useAdmin((s) => s.saveSlides);
  const save = useDemoSave();
  const [slides, setSlides] = useState(initial);
  const patch = (i: number, p: Partial<CarouselSlide>) => setSlides((l) => l.map((s, k) => (k === i ? { ...s, ...p } : s)));
  return (
    <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); save("Carrusel guardado", () => saveSlides(slides.filter((s) => s.title.trim()))); }}>
      {slides.map((s, i) => (
        <fieldset key={s.id} className="grid gap-3 rounded-3xl bg-surface shadow-[var(--shadow-card)] p-3 sm:grid-cols-2">
          <legend className="px-1 text-sm font-extrabold">Diapositiva {i + 1}</legend>
          <label className="flex flex-col gap-1 text-sm font-bold">Título<Input value={s.title} onChange={(e) => patch(i, { title: e.target.value })} /></label>
          <label className="flex flex-col gap-1 text-sm font-bold">Bajada<Input value={s.subtitle} onChange={(e) => patch(i, { subtitle: e.target.value })} /></label>
          <label className="flex flex-col gap-1 text-sm font-bold">Texto del botón<Input value={s.ctaLabel} onChange={(e) => patch(i, { ctaLabel: e.target.value })} /></label>
          <label className="flex flex-col gap-1 text-sm font-bold">Destino<Select value={s.ctaHref} onChange={(e) => patch(i, { ctaHref: e.target.value })}>{LINKS.map(([h, l]) => <option key={h} value={h}>{l}</option>)}</Select></label>
          <label className="flex flex-col gap-1 text-sm font-bold">Imagen ilustrativa<Select value={s.art} onChange={(e) => patch(i, { art: e.target.value as ArtKey })}>{ARTS.map((a) => <option key={a} value={a}>{a}</option>)}</Select></label>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <Switch checked={s.active !== false} onChange={(v) => patch(i, { active: v })} label="Visible" />
            <ListControls index={i} length={slides.length} label={`diapositiva ${i + 1}`} onMove={(d) => setSlides((l) => moveItem(l, i, d))} onRemove={slides.length > 1 ? () => setSlides((l) => l.filter((_, k) => k !== i)) : undefined} />
          </div>
        </fieldset>
      ))}
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={() => setSlides((l) => [...l, { id: `s-${Date.now().toString(36)}`, title: "Nueva diapositiva", subtitle: "", ctaLabel: "Ver más", ctaHref: "/categorias/", art: "dachshund", active: true }])}><Plus size={16} aria-hidden="true" /> Agregar</Button>
        <Button type="submit" size="sm">Guardar carrusel</Button>
      </div>
    </form>
  );
}
