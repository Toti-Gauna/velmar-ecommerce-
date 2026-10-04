"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Field";
import { Switch } from "@/components/atoms/Switch";
import { EmptyState } from "@/components/molecules/EmptyState";
import { Pagination } from "@/components/molecules/Pagination";
import { ProductVisual } from "@/components/illustrations/ProductVisual";
import { productHref } from "@/demo/engine/catalog";
import { normalize } from "@/demo/engine/search";
import { formatARS } from "@/lib/money";
import { useAdmin } from "@/stores/admin";
import { AdminPageHeader } from "./AdminPageHeader";
import { useDemoSave } from "./useDemoSave";
import { usePaged } from "./usePaged";

function stockLabel(stock: number): string {
  return stock < 0 ? "a pedido" : stock === 0 ? "sin stock" : `${stock} u.`;
}

export function ProductsList() {
  const router = useRouter();
  const products = useAdmin((s) => s.data.products);
  const categories = useAdmin((s) => s.data.categories);
  const { createProduct, toggleProductActive } = useAdmin();
  const save = useDemoSave();
  const [q, setQ] = useState("");
  const list = products.filter((p) => !q || normalize(`${p.name} ${p.slug}`).includes(normalize(q)));
  const paged = usePaged(list, 9, q);
  return (
    <>
      <AdminPageHeader title="Productos y stock" actions={
        <Button onClick={() => { let slug = ""; save("Producto de ejemplo creado (pausado)", () => { slug = createProduct(); }); router.push(`/admin-demo/productos/editar/?id=${slug}`); }}>
          <Plus size={18} aria-hidden="true" /> Nuevo producto
        </Button>
      }>Stock -1 = “a pedido” (sin límite). La tienda no maneja cupos de fabricación: eso lo decide Velmar.</AdminPageHeader>
      <label className="mb-4 flex max-w-md flex-col gap-1 text-sm font-bold">Buscar producto<Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Comedero, velador…" /></label>
      {list.length === 0 ? <EmptyState title="Sin resultados">Probá con otro nombre.</EmptyState> : (
        <>
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {paged.items.map((p) => (
            <li key={p.slug} className="flex flex-col gap-3 rounded-3xl bg-surface shadow-[var(--shadow-card)] p-3">
              <div className="flex gap-3">
                <ProductVisual art={p.art} photoUrl={p.photoDataUrl} tint={p.variants[0]?.colorHex} label={p.imageAlt || p.name} showBadge={false} className="aspect-square w-20 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold leading-tight">{p.name}</p>
                  <p className="text-sm text-muted">{categories.find((c) => c.slug === p.categorySlug)?.name} · {formatARS(p.basePrice)} (ilustrativo)</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {p.featured && <Badge>Destacado</Badge>}{p.isNew && <Badge tone="brand">Nuevo</Badge>}
                    {p.active === false && <Badge tone="warning">Pausado</Badge>}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted">Stock: {p.variants.map((v) => `${v.label}: ${stockLabel(v.stock)}`).join(" · ")}</p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                <Switch checked={p.active !== false} onChange={() => save(p.active === false ? "Producto activado" : "Producto pausado", () => toggleProductActive(p.slug))} label={p.active === false ? "Pausado" : "Visible en la tienda"} />
                <div className="flex gap-3 text-sm font-bold">
                  <Link href={productHref(p.slug)} className="text-muted underline">Ver en tienda</Link>
                  <Link href={`/admin-demo/productos/editar/?id=${p.slug}`} className="text-primary underline">Editar</Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Pagination {...paged} noun="productos" onPage={paged.setPage} />
        </>
      )}
    </>
  );
}
