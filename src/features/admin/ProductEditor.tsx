"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button, ButtonLink } from "@/components/atoms/Button";
import { Input, Textarea } from "@/components/atoms/Field";
import { Select } from "@/components/atoms/Select";
import { Switch } from "@/components/atoms/Switch";
import { EmptyState } from "@/components/molecules/EmptyState";
import { templatesFrom } from "@/demo/admin/templates";
import { productHref } from "@/demo/engine/catalog";
import type { Product } from "@/demo/types";
import { useAdmin } from "@/stores/admin";
import { NumberField } from "./NumberField";
import { ProductMediaFields } from "./ProductMediaFields";
import { useDemoSave } from "./useDemoSave";
import { VariantsEditor } from "./VariantsEditor";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="flex flex-col gap-3 rounded-3xl bg-surface shadow-[var(--shadow-card)] p-4"><h2 className="font-extrabold">{title}</h2>{children}</section>;
}

function problems(p: Product): string[] {
  const out: string[] = [];
  if (p.name.trim().length < 2) out.push("El nombre es obligatorio.");
  if (p.basePrice <= 0) out.push("El precio base tiene que ser mayor a 0.");
  if (p.variants.length === 0 || p.variants.some((v) => !v.label.trim())) out.push("Cada variante necesita un nombre visible.");
  return out;
}

function Editor({ product }: { product: Product }) {
  const router = useRouter();
  const all = useAdmin((s) => s.data.products);
  const categories = useAdmin((s) => s.data.categories);
  const saveProduct = useAdmin((s) => s.saveProduct);
  const save = useDemoSave();
  const [d, setD] = useState<Product>(product);
  const [errors, setErrors] = useState<string[]>([]);
  const set = (p: Partial<Product>) => setD((x) => ({ ...x, ...p }));
  const dims = d.dims ?? { lengthCm: 0, widthCm: 0, heightCm: 0, weightG: 0 };
  return (
    <form noValidate className="flex flex-col gap-4" onSubmit={(e) => {
      e.preventDefault();
      const found = problems(d);
      setErrors(found);
      if (found.length === 0) { save("Producto guardado", () => saveProduct(d)); router.push("/admin-demo/productos/"); }
    }}>
      <Section title="Datos">
        <label className="flex flex-col gap-1 text-sm font-bold">Nombre<Input value={d.name} onChange={(e) => set({ name: e.target.value })} /></label>
        <label className="flex flex-col gap-1 text-sm font-bold">Descripción corta<Input value={d.short} onChange={(e) => set({ short: e.target.value })} /></label>
        <label className="flex flex-col gap-1 text-sm font-bold">Descripción<Textarea value={d.description} onChange={(e) => set({ description: e.target.value })} /></label>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-sm font-bold">Categoría
            <Select value={d.categorySlug} onChange={(e) => set({ categorySlug: e.target.value })}>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</Select>
          </label>
          <NumberField id="p-price" label="Precio base ilustrativo" suffix="ARS" value={d.basePrice} onChange={(n) => set({ basePrice: n })} />
          <NumberField id="p-days" label="Plazo de fabricación" suffix="días hábiles" value={d.madeToOrderDays} onChange={(n) => set({ madeToOrderDays: n || undefined })} hint="Lo que tarda el taller desde el pago. Cuenta solo días hábiles (sin feriados) y lo usa el calendario de entregas" />
        </div>
        <div className="flex flex-wrap gap-x-6">
          <Switch checked={d.active !== false} onChange={(v) => set({ active: v })} label="Visible en la tienda" />
          <Switch checked={d.featured} onChange={(v) => set({ featured: v })} label="Destacado" />
          <Switch checked={d.isNew} onChange={(v) => set({ isNew: v })} label="Nuevo" />
        </div>
      </Section>
      <Section title="Foto y texto alternativo"><ProductMediaFields draft={d} onChange={set} /></Section>
      <Section title="Variantes, precio y stock"><VariantsEditor variants={d.variants} onChange={(variants) => set({ variants })} idPrefix={d.slug} /></Section>
      <Section title="Medidas de envío">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <NumberField id="d-l" label="Largo" suffix="cm" value={dims.lengthCm} onChange={(n) => set({ dims: { ...dims, lengthCm: n } })} />
          <NumberField id="d-w" label="Ancho" suffix="cm" value={dims.widthCm} onChange={(n) => set({ dims: { ...dims, widthCm: n } })} />
          <NumberField id="d-h" label="Alto" suffix="cm" value={dims.heightCm} onChange={(n) => set({ dims: { ...dims, heightCm: n } })} />
          <NumberField id="d-g" label="Peso" suffix="g" value={dims.weightG} onChange={(n) => set({ dims: { ...dims, weightG: n } })} />
        </div>
      </Section>
      <Section title="Personalización">
        <Select aria-label="Plantilla de personalización" value={d.personalization?.id ?? ""} onChange={(e) => set({ personalization: templatesFrom(all).find((t) => t.id === e.target.value) })}>
          <option value="">Sin personalización</option>
          {templatesFrom(all).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </Select>
        <p className="text-xs text-muted">Las plantillas se ajustan en “Categorías y personalización”.</p>
      </Section>
      {errors.length > 0 && <ul role="alert" className="rounded-2xl bg-danger-soft p-3 text-sm font-semibold text-danger">{errors.map((x) => <li key={x}>{x}</li>)}</ul>}
      <div className="sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] -mx-4 flex lg:bottom-0 flex-wrap gap-3 border-t border-line bg-bg/95 px-4 py-3 backdrop-blur">
        <Button type="submit" size="lg">Guardar (solo en esta demo)</Button>
        <ButtonLink href={productHref(d.slug)} variant="ghost">Ver en tienda</ButtonLink>
      </div>
    </form>
  );
}

export function ProductEditor() {
  const slug = useSearchParams().get("id") ?? "";
  const product = useAdmin((s) => s.data.products.find((p) => p.slug === slug));
  if (!product) return <EmptyState title="Producto no encontrado en la demo" action={<ButtonLink href="/admin-demo/productos/">Ver productos</ButtonLink>} />;
  return (
    <>
      <Link href="/admin-demo/productos/" className="mb-3 flex w-fit items-center gap-1 text-sm font-bold text-primary"><ArrowLeft size={16} aria-hidden="true" /> Productos</Link>
      <h1 className="mb-4 text-2xl font-extrabold">Editar: {product.name} <span className="text-sm text-warning">(demo)</span></h1>
      <Editor key={product.slug} product={product} />
    </>
  );
}
