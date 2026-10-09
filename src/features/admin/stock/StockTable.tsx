"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { EmptyState } from "@/components/molecules/EmptyState";
import { DataTable } from "@/components/organisms/data-table/DataTable";
import type { Column, RowCardProps } from "@/components/organisms/data-table/types";
import { DEFAULT_LOW_STOCK, inventoryValue, STOCK_LABEL, stockRows, type StockOp, type StockRow } from "@/demo/admin/stock";
import { formatARS } from "@/lib/money";
import { useAdmin } from "@/stores/admin";
import { AdminPageHeader } from "../AdminPageHeader";
import { StockChip } from "../table/StockChip";
import { BulkButton, TabFilter } from "../table/TabFilter";
import { useExport } from "../table/useExport";
import { useTableState } from "../table/useTableState";
import { useDemoSave } from "../useDemoSave";
import { StockEditor } from "./StockEditor";

type Tab = "all" | "reorder" | "out" | "low" | "made-to-order";
const TABS: [Tab, string, (r: StockRow) => boolean][] = [
  ["all", "Todas", () => true], ["reorder", "Para reponer", (r) => r.active && (r.state === "out" || r.state === "low")],
  ["out", "Sin stock", (r) => r.state === "out"], ["low", "Stock bajo", (r) => r.state === "low"], ["made-to-order", "A pedido", (r) => r.state === "made-to-order"],
];

/** Stock por variante: se edita en la tabla, se avisa lo que hay que reponer y se ve cuánto vale el inventario. */
export function StockTable() {
  const { data, setVariantStock, saveSettings, bulkStock } = useAdmin();
  const save = useDemoSave();
  const onExport = useExport("stock");
  const low = data.settings.lowStockThreshold ?? DEFAULT_LOW_STOCK;
  const [tab, setTab] = useState<Tab>(useSearchParams().get("vista") === "reponer" ? "reorder" : "all");
  const [threshold, setThreshold] = useState<string | null>(null);
  const state = useTableState("stock", { sort: { id: "product", dir: "asc" } });
  const all = stockRows(data.products, data.categories, low);
  const rows = all.filter(TABS.find((t) => t[0] === tab)![2]);
  const setStock = (r: StockRow, stock: number) => save(`Stock de ${r.productName} · ${r.variantLabel}: ${stock < 0 ? "a pedido" : stock}`, () => setVariantStock(r.productSlug, r.variantId, stock));
  const bulk = (list: StockRow[], op: StockOp, label: string, clear: () => void) => {
    save(label, () => bulkStock(list.map((r) => r.key), op, label));
    clear();
  };
  const columns: Column<StockRow>[] = [
    { id: "product", header: "Producto", pinned: true, cell: (r) => <Link href={`/admin-demo/productos/editar/?id=${r.productSlug}`} className="font-bold hover:text-primary hover:underline">{r.productName}</Link>, sortValue: (r) => r.productName, exportValue: (r) => r.productName },
    { id: "variant", header: "Variante", cell: (r) => r.variantLabel, sortValue: (r) => r.variantLabel, exportValue: (r) => r.variantLabel },
    { id: "category", header: "Categoría", cell: (r) => r.categoryName, sortValue: (r) => r.categoryName, exportValue: (r) => r.categoryName },
    { id: "price", header: "Precio", align: "right", cell: (r) => formatARS(r.price), sortValue: (r) => r.price, exportValue: (r) => r.price },
    { id: "stock", header: "Unidades", cell: (r) => <StockEditor value={r.stock} label={`${r.productName} · ${r.variantLabel}`} onChange={(s) => setStock(r, s)} />, sortValue: (r) => (r.stock < 0 ? Number.MAX_SAFE_INTEGER : r.stock), exportValue: (r) => (r.stock < 0 ? "a pedido" : r.stock) },
    { id: "state", header: "Estado", cell: (r) => <StockChip state={r.state} />, sortValue: (r) => ["out", "low", "ok", "made-to-order"].indexOf(r.state), exportValue: (r) => STOCK_LABEL[r.state] },
    { id: "value", header: "Valor en stock", align: "right", cell: (r) => (r.stock > 0 ? formatARS(r.stock * r.price) : "—"), sortValue: (r) => Math.max(0, r.stock) * r.price, exportValue: (r) => Math.max(0, r.stock) * r.price },
  ];
  const Card = ({ row: r, selected, onToggle }: RowCardProps<StockRow>) => (
    <div className={`flex flex-col gap-3 rounded-3xl bg-bg p-3 ring-1 ${selected ? "ring-primary" : "ring-ink/[0.06]"}`}>
      <div className="flex items-start gap-3">
        <input type="checkbox" checked={selected} onChange={onToggle} aria-label={`Seleccionar ${r.productName} · ${r.variantLabel}`} className="mt-1 h-5 w-5 accent-primary" />
        <span className="min-w-0 flex-1"><span className="block font-bold">{r.productName}</span><span className="text-sm text-muted">{r.variantLabel} · {formatARS(r.price)}</span></span>
        <StockChip state={r.state} />
      </div>
      <StockEditor value={r.stock} label={`${r.productName} · ${r.variantLabel}`} onChange={(s) => setStock(r, s)} />
    </div>
  );
  return (
    <>
      <AdminPageHeader title="Stock" actions={(
        <label className="flex items-center gap-2 rounded-2xl bg-surface px-3 py-2 text-sm font-bold shadow-[var(--shadow-card)]">
          Avisar con
          <input type="number" min={0} max={99} value={threshold ?? low} aria-label="Avisar de stock bajo con estas unidades o menos" onChange={(e) => setThreshold(e.target.value)}
            onBlur={() => { const n = Number(threshold); if (threshold !== null && threshold.trim() !== "" && Number.isInteger(n) && n >= 0 && n !== low) save(`Aviso de stock bajo: ${n} o menos`, () => saveSettings({ lowStockThreshold: n })); setThreshold(null); }}
            onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }} className="h-9 w-16 rounded-xl border border-ink/12 bg-bg text-center tabular-nums" />
          o menos
        </label>
      )}>Una fila por variante. Sumá o restá en la tabla, o marcá “a pedido” (∞) lo que no tiene límite. Los cambios se ven en la tienda al instante.</AdminPageHeader>
      <div className="mb-4"><TabFilter label="Filtrar stock" value={tab} onChange={(t) => { setTab(t); state.setPage(1); }} tabs={TABS.map(([id, label, fn]) => ({ id, label, count: all.filter(fn).length }))} /></div>
      <DataTable caption="Stock por variante" noun="variantes" rows={rows} columns={columns} state={state} pageSize={12}
        rowKey={(r) => r.key} rowLabel={(r) => `Seleccionar ${r.productName} · ${r.variantLabel}`} searchText={(r) => `${r.productName} ${r.variantLabel} ${r.categoryName}`}
        searchLabel="Buscar variante" searchPlaceholder="Vela, lavanda, comederos…" onExport={onExport} renderCard={Card}
        rowTone={(r) => (r.state === "out" && r.active ? "danger" : r.state === "low" ? "warning" : undefined)}
        bulkActions={(list, clear) => (
          <>
            {[5, 10].map((n) => <BulkButton key={n} onClick={() => bulk(list, { kind: "add", units: n }, `Se sumaron ${n} unidades`, clear)}>Sumar {n}</BulkButton>)}
            <BulkButton onClick={() => bulk(list, { kind: "set", stock: -1 }, "Variantes a pedido", clear)}>Pasar a pedido</BulkButton>
            <BulkButton tone="danger" onClick={() => bulk(list, { kind: "set", stock: 0 }, "Variantes sin stock", clear)}>Dejar en 0</BulkButton>
          </>
        )}
        footer={(list) => (
          <p className="flex flex-wrap justify-end gap-x-6 gap-y-1 border-t border-line px-5 py-3 text-sm">
            <span className="text-muted">Unidades: <strong className="tabular-nums text-ink">{list.reduce((s, r) => s + Math.max(0, r.stock), 0).toLocaleString("es-AR")}</strong></span>
            <span className="text-muted">Valor del inventario: <strong className="tabular-nums text-ink">{formatARS(inventoryValue(list))}</strong></span>
          </p>
        )}
        empty={<EmptyState title="Nada para mostrar">No hay variantes en este filtro.</EmptyState>} />
    </>
  );
}
