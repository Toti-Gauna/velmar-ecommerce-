"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FileSpreadsheet, Plus, Sheet, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/atoms/Button";
import { Switch } from "@/components/atoms/Switch";
import { EmptyState } from "@/components/molecules/EmptyState";
import { DataTable } from "@/components/organisms/data-table/DataTable";
import type { RowCardProps } from "@/components/organisms/data-table/types";
import { DEFAULT_LOW_STOCK, lowStockRows, productStockState, productStockTotal, type StockState } from "@/demo/admin/stock";
import type { Product } from "@/demo/types";
import { formatARS } from "@/lib/money";
import { useAdmin } from "@/stores/admin";
import { AdminPageHeader } from "../AdminPageHeader";
import { useDemoSave } from "../useDemoSave";
import { StockChip } from "../table/StockChip";
import { BulkButton, TabFilter } from "../table/TabFilter";
import { useExport } from "../table/useExport";
import { useTableState } from "../table/useTableState";
import { minPrice, ProductThumb, productColumns } from "./productColumns";

type StockTab = "all" | StockState | "paused";
const select = "h-11 rounded-2xl border border-ink/12 bg-surface px-3 text-sm font-bold";

/** Catálogo como tabla: filtros por categoría y stock, pausar o mover en lote, alertas de reposición y Excel. */
export function ProductsTable() {
  const router = useRouter();
  const params = useSearchParams();
  const { data, createProduct, toggleProductActive, setProductsActive, setProductsCategory } = useAdmin();
  const save = useDemoSave();
  const onExport = useExport("productos");
  const low = data.settings.lowStockThreshold ?? DEFAULT_LOW_STOCK;
  const [category, setCategory] = useState("all");
  const [tab, setTab] = useState<StockTab>("all");
  const [moveTo, setMoveTo] = useState("");
  const state = useTableState("products", { sort: { id: "name", dir: "asc" }, hidden: ["stockState"] });
  const toggle = (p: Product) => save(p.active === false ? "Producto activado" : "Producto pausado", () => toggleProductActive(p.slug));
  const create = () => { let slug = ""; save("Producto de ejemplo creado (pausado)", () => { slug = createProduct(); }); router.push(`/admin-demo/productos/editar/?id=${slug}`); };
  // "Nuevo producto" desde el buscador ⌘K: se crea una sola vez y se abre el editor.
  const created = useRef(false);
  useEffect(() => {
    if (params.get("nuevo") !== "1" || created.current) return;
    created.current = true;
    const slug = useAdmin.getState().createProduct();
    router.replace(`/admin-demo/productos/editar/?id=${slug}`);
  }, [params, router]);

  const byCategory = data.products.filter((p) => category === "all" || p.categorySlug === category);
  const matches = (p: Product, t: StockTab) => t === "all" || (t === "paused" ? p.active === false : productStockState(p, low) === t);
  const rows = byCategory.filter((p) => matches(p, tab));
  const reorder = lowStockRows(data.products, data.categories, low).length;
  const cats = [...data.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  const Card = ({ row: p, selected, onToggle }: RowCardProps<Product>) => (
    <div className={`flex flex-col gap-3 rounded-3xl bg-bg p-3 ring-1 ${selected ? "ring-primary" : "ring-ink/[0.06]"}`}>
      <div className="flex items-start gap-3">
        <input type="checkbox" checked={selected} onChange={onToggle} aria-label={`Seleccionar ${p.name}`} className="mt-1 h-5 w-5 shrink-0 accent-primary" />
        <ProductThumb product={p} size="w-16" />
        <span className="min-w-0 flex-1">
          <span className="block font-bold leading-tight">{p.name}</span>
          <span className="text-sm text-muted">{cats.find((c) => c.slug === p.categorySlug)?.name} · desde {formatARS(minPrice(p))}</span>
          <span className="mt-1 block"><StockChip state={productStockState(p, low)} units={productStockTotal(p)} /></span>
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Switch checked={p.active !== false} onChange={() => toggle(p)} label={p.active === false ? "Pausado" : "Visible en la tienda"} />
        <Link href={`/admin-demo/productos/editar/?id=${p.slug}`} className="text-sm font-bold text-primary underline">Editar</Link>
      </div>
    </div>
  );
  return (
    <>
      <AdminPageHeader title="Productos y stock" actions={(
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/admin-demo/importar/" variant="secondary"><FileSpreadsheet size={17} aria-hidden="true" /> Importar Excel</ButtonLink>
          <ButtonLink href="/admin-demo/planilla/" variant="secondary"><Sheet size={17} aria-hidden="true" /> Planilla</ButtonLink>
          <Button onClick={create}><Plus size={18} aria-hidden="true" /> Nuevo producto</Button>
        </div>
      )}>Stock “a pedido” = sin límite. La tienda no maneja cupos de fabricación: eso lo decide Velmar.</AdminPageHeader>
      {reorder > 0 && (
        <Link href="/admin-demo/stock/?vista=reponer" className="mb-4 flex items-center gap-3 rounded-2xl bg-warning-soft px-4 py-3 text-sm font-bold text-warning ring-1 ring-warning/30">
          <TriangleAlert size={18} aria-hidden="true" /><span className="flex-1">{reorder} {reorder === 1 ? "variante necesita" : "variantes necesitan"} reposición (sin stock o con {low} o menos).</span><span className="underline">Ver stock</span>
        </Link>
      )}
      <div className="mb-4">
        <TabFilter label="Filtrar por stock" value={tab} onChange={(t) => { setTab(t); state.setPage(1); }} tabs={([["all", "Todos"], ["low", "Stock bajo"], ["out", "Sin stock"], ["made-to-order", "A pedido"], ["paused", "Pausados"]] as [StockTab, string][]).map(([id, label]) => ({ id, label, count: byCategory.filter((p) => matches(p, id)).length }))} />
      </div>
      <DataTable caption="Productos" noun="productos" rows={rows} columns={productColumns(data.categories, low, toggle)} state={state} pageSize={10}
        rowKey={(p) => p.slug} rowLabel={(p) => `Seleccionar ${p.name}`} searchText={(p) => `${p.name} ${p.slug} ${p.tags.join(" ")}`}
        searchLabel="Buscar producto" searchPlaceholder="Comedero, velador…"
        filters={<div className="flex flex-col gap-1 text-sm font-bold"><label htmlFor="products-category">Categoría</label><select id="products-category" value={category} onChange={(e) => { setCategory(e.target.value); state.setPage(1); }} className={select}><option value="all">Todas</option>{cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></div>}
        bulkActions={(list, clear) => (
          <>
            <BulkButton onClick={() => { save(`${list.length} productos visibles`, () => setProductsActive(list.map((p) => p.slug), true)); clear(); }}>Mostrar en la tienda</BulkButton>
            <BulkButton onClick={() => { save(`${list.length} productos pausados`, () => setProductsActive(list.map((p) => p.slug), false)); clear(); }}>Pausar</BulkButton>
            <select aria-label="Mover a la categoría" value={moveTo} onChange={(e) => { const to = e.target.value; if (!to) return; save(`${list.length} productos movidos`, () => setProductsCategory(list.map((p) => p.slug), to)); setMoveTo(""); clear(); }}
                className="h-9 rounded-full bg-white/10 px-3 text-[13px] font-bold text-[#f6f1e8]">
                <option value="">Mover a…</option>{cats.map((c) => <option key={c.slug} value={c.slug} className="text-ink">{c.name}</option>)}
            </select>
          </>
        )}
        onRowOpen={(p) => router.push(`/admin-demo/productos/editar/?id=${p.slug}`)} onExport={onExport} renderCard={Card}
        rowTone={(p) => (productStockState(p, low) === "out" && p.active !== false ? "danger" : productStockState(p, low) === "low" ? "warning" : undefined)}
        empty={<EmptyState title="Sin resultados">Probá con otro nombre, categoría o filtro de stock.</EmptyState>} />
    </>
  );
}
