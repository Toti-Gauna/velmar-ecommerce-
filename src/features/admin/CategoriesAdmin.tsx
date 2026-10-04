"use client";
import { templatesFrom } from "@/demo/admin/templates";
import { useAdmin } from "@/stores/admin";
import { AdminPageHeader } from "./AdminPageHeader";
import { CategoriesOrder } from "./CategoriesOrder";
import { TemplateEditor } from "./TemplateEditor";
import { TextZoneEditor } from "./TextZoneEditor";

export function CategoriesAdmin() {
  const products = useAdmin((s) => s.data.products);
  const templates = templatesFrom(products);
  return (
    <>
      <AdminPageHeader title="Categorías y personalización">Ordená las categorías, elegí las destacadas y ajustá las plantillas del personalizador. Todo se refleja en la tienda de este navegador.</AdminPageHeader>
      <section aria-labelledby="cats" className="mb-8"><h2 id="cats" className="mb-3 text-lg font-extrabold">Categorías</h2><CategoriesOrder /></section>
      <section aria-labelledby="tpls" className="mb-8">
        <h2 id="tpls" className="mb-3 text-lg font-extrabold">Plantillas de personalización</h2>
        <div className="grid gap-3 lg:grid-cols-2">
          {templates.map((t) => <TemplateEditor key={`${t.id}-${JSON.stringify(t)}`} template={t} usedBy={products.filter((p) => p.personalization?.id === t.id).map((p) => p.name)} />)}
        </div>
      </section>
      <section aria-labelledby="zone"><h2 id="zone" className="mb-3 text-lg font-extrabold">Zona de texto sobre la foto base</h2><TextZoneEditor /></section>
    </>
  );
}
