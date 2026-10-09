"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Field";
import { Sheet } from "@/components/motion/Sheet";
import { EmptyState } from "@/components/molecules/EmptyState";
import { DataTable } from "@/components/organisms/data-table/DataTable";
import type { Column, RowCardProps } from "@/components/organisms/data-table/types";
import { MATERIAL_STATE_LABEL, materialRows, reorderQty, type MaterialRow, type MaterialState } from "@/demo/admin/workshop/materials";
import { UNIT_LABEL, UNIT_SHORT, type Material, type MaterialUnit } from "@/demo/fixtures/workshop";
import { formatARS } from "@/lib/money";
import { useAdmin } from "@/stores/admin";
import { useToasts } from "@/stores/toast";
import { AdminPageHeader } from "../AdminPageHeader";
import { CommitNumberField } from "../NumberField";
import { BulkButton, TabFilter } from "../table/TabFilter";
import { useExport } from "../table/useExport";
import { useTableState } from "../table/useTableState";
import { useDemoSave } from "../useDemoSave";
import { InlineNumber } from "./InlineNumber";

const TONE = { ok: "success", low: "warning", short: "danger" } as const;
const qty = (n: number, unit: MaterialUnit) => `${n.toLocaleString("es-AR", { maximumFractionDigits: 2 })} ${UNIT_SHORT[unit]}`;

export function MaterialChip({ state }: { state: MaterialState }) {
  return <Badge tone={TONE[state]} className="whitespace-nowrap">{MATERIAL_STATE_LABEL[state]}</Badge>;
}

type Tab = "all" | "reorder" | "short";
const TABS: [Tab, string, (r: MaterialRow) => boolean][] = [["all", "Todos", () => true], ["reorder", "Para reponer", (r) => r.state !== "ok"], ["short", "No alcanza para los pedidos", (r) => r.state === "short"]];

function MaterialSheet({ material, onClose }: { material: Material | null; onClose: () => void }) {
  const saveMaterial = useAdmin((s) => s.saveMaterial);
  const save = useDemoSave();
  const [name, setName] = useState<string | null>(null);
  const [supplier, setSupplier] = useState<string | null>(null);
  if (!material) return <Sheet open={false} onClose={onClose} title="Insumo"><span /></Sheet>;
  const patch = (p: Partial<Material>, label = "Insumo guardado") => save(label, () => saveMaterial({ ...material, ...p }));
  return (
    <Sheet open onClose={() => { setName(null); setSupplier(null); onClose(); }} title={`Insumo ${material.name}`} side="right" className="max-w-lg bg-bg">
      <div className="flex h-full flex-col gap-4 overflow-y-auto p-6 pt-14">
        <h2 className="font-display text-3xl">{material.name}</h2>
        <label className="flex flex-col gap-1 text-sm font-bold">Nombre
          <Input value={name ?? material.name} onChange={(e) => setName(e.target.value)} onBlur={() => { if (name?.trim() && name.trim() !== material.name) patch({ name: name.trim() }); setName(null); }} />
        </label>
        <label className="flex flex-col gap-1 text-sm font-bold">Unidad de medida
          <select value={material.unit} onChange={(e) => patch({ unit: e.target.value as MaterialUnit })} className="h-12 rounded-2xl border border-ink/12 bg-surface px-3 font-semibold">
            {(Object.keys(UNIT_LABEL) as MaterialUnit[]).map((u) => <option key={u} value={u}>{UNIT_LABEL[u]}</option>)}
          </select>
        </label>
        <CommitNumberField id="m-cost" label={`Costo por ${UNIT_SHORT[material.unit]}`} suffix="pesos enteros" value={material.costPerUnit} onCommit={(n) => patch({ costPerUnit: n }, "Costo del insumo guardado")} hint="Se usa en Costos y margen para calcular el costo de cada producto." />
        <CommitNumberField id="m-min" label="Avisar para reponer con" suffix={UNIT_LABEL[material.unit]} value={material.minStock} onCommit={(n) => patch({ minStock: n })} />
        <label className="flex flex-col gap-1 text-sm font-bold">Proveedor
          <Input value={supplier ?? material.supplier ?? ""} placeholder="Opcional" onChange={(e) => setSupplier(e.target.value)} onBlur={() => { if (supplier !== null && supplier.trim() !== (material.supplier ?? "")) patch({ supplier: supplier.trim() || undefined }); setSupplier(null); }} />
        </label>
      </div>
    </Sheet>
  );
}

/** Insumos con stock propio (pedido de Ignacio, fuera de la especificación): cuánto queda, cuánto piden los pedidos y qué reponer. */
export function MaterialsTable() {
  const orders = useAdmin((s) => s.orders);
  const { materials, recipes } = useAdmin((s) => s.workshop);
  const { adjustMaterials, createMaterial } = useAdmin();
  const save = useDemoSave();
  const push = useToasts((t) => t.push);
  const onExport = useExport("insumos");
  const state = useTableState("materials", { sort: { id: "state", dir: "asc" }, hidden: ["value"] });
  const [tab, setTab] = useState<Tab>("all");
  const [open, setOpen] = useState<string | null>(null);
  const all = materialRows(materials, orders, recipes);
  const rows = all.filter(TABS.find((t) => t[0] === tab)![2]);
  const setStock = (r: MaterialRow, stock: number) => save(`Stock de ${r.name}: ${qty(stock, r.unit)}`, () => adjustMaterials([r.id], { kind: "set", stock }, `Stock de ${r.name}`));
  const buy = (list: MaterialRow[], clear: () => void) => {
    const need = list.filter((r) => reorderQty(r) > 0);
    if (!need.length) return push({ tone: "info", title: "Nada para reponer", description: "Los insumos elegidos alcanzan para los pedidos y están sobre el mínimo." });
    need.forEach((r) => adjustMaterials([r.id], { kind: "add", qty: reorderQty(r) }, `Compra registrada: ${r.name}`));
    push({ tone: "success", title: `Compra registrada de ${need.length} ${need.length === 1 ? "insumo" : "insumos"}`, description: need.map((r) => `${r.name}: +${qty(reorderQty(r), r.unit)}`).join(" · ") });
    clear();
  };
  const columns: Column<MaterialRow>[] = [
    { id: "name", header: "Insumo", pinned: true, primary: true, cell: (r) => <span><span className="block font-bold">{r.name}</span>{r.supplier && <span className="text-xs text-muted">{r.supplier}</span>}</span>, sortValue: (r) => r.name, exportValue: (r) => r.name },
    { id: "cost", header: "Costo", align: "right", className: "whitespace-nowrap", cell: (r) => `${formatARS(r.costPerUnit)} / ${UNIT_SHORT[r.unit]}`, sortValue: (r) => r.costPerUnit, exportValue: (r) => r.costPerUnit },
    { id: "stock", header: "En el taller", cell: (r) => <span className="inline-flex items-center gap-1.5"><InlineNumber value={r.stock} decimals={r.unit === "m" || r.unit === "plancha"} label={`Stock de ${r.name}`} onCommit={(n) => setStock(r, n)} /><span className="text-xs text-muted">{UNIT_SHORT[r.unit]}</span></span>, sortValue: (r) => r.stock, exportValue: (r) => r.stock },
    { id: "committed", header: "Piden los pedidos", align: "right", cell: (r) => (r.committed ? qty(r.committed, r.unit) : "—"), sortValue: (r) => r.committed, exportValue: (r) => r.committed },
    { id: "available", header: "Queda", align: "right", cell: (r) => <span className={r.available < 0 ? "font-bold text-danger" : "font-bold"}>{qty(r.available, r.unit)}</span>, sortValue: (r) => r.available, exportValue: (r) => r.available },
    { id: "min", header: "Mínimo", align: "right", cell: (r) => qty(r.minStock, r.unit), sortValue: (r) => r.minStock, exportValue: (r) => r.minStock },
    { id: "state", header: "Estado", cell: (r) => <MaterialChip state={r.state} />, sortValue: (r) => ["short", "low", "ok"].indexOf(r.state), exportValue: (r) => MATERIAL_STATE_LABEL[r.state] },
    { id: "reorder", header: "Comprar", align: "right", cell: (r) => (reorderQty(r) ? qty(reorderQty(r), r.unit) : "—"), sortValue: (r) => reorderQty(r), exportValue: (r) => reorderQty(r) },
    { id: "value", header: "Valor", align: "right", defaultHidden: true, cell: (r) => formatARS(r.value), sortValue: (r) => r.value, exportValue: (r) => r.value },
  ];
  const Card = ({ row: r, selected, onToggle, onOpen }: RowCardProps<MaterialRow>) => (
    <div className={`flex flex-col gap-3 rounded-3xl bg-bg p-3 ring-1 ${selected ? "ring-primary" : "ring-ink/[0.06]"}`}>
      <div className="flex items-start gap-3">
        <input type="checkbox" checked={selected} onChange={onToggle} aria-label={`Seleccionar ${r.name}`} className="mt-1 h-5 w-5 accent-primary" />
        <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left"><span className="block font-bold">{r.name}</span><span className="text-sm text-muted">{formatARS(r.costPerUnit)} / {UNIT_SHORT[r.unit]} · piden {qty(r.committed, r.unit)}</span></button>
        <MaterialChip state={r.state} />
      </div>
      <div className="flex items-center gap-2 text-sm"><InlineNumber value={r.stock} decimals={r.unit === "m" || r.unit === "plancha"} label={`Stock de ${r.name}`} onCommit={(n) => setStock(r, n)} /><span className="text-muted">{UNIT_LABEL[r.unit]} · queda {qty(r.available, r.unit)}</span></div>
    </div>
  );
  return (
    <>
      <AdminPageHeader title="Insumos" actions={<Button variant="secondary" size="sm" onClick={() => { const id = createMaterial("Insumo nuevo"); setOpen(id); }}><Plus size={16} aria-hidden="true" /> Nuevo insumo</Button>}>
        Filamento, madera, cera, LED y todo lo que usa el taller. “Piden los pedidos” suma las recetas de los pedidos pagados que todavía no entraron a producción; al pasarlos a producción se descuenta del stock.
      </AdminPageHeader>
      <div className="mb-4"><TabFilter label="Filtrar insumos" value={tab} onChange={(t) => { setTab(t); state.setPage(1); }} tabs={TABS.map(([id, label, fn]) => ({ id, label, count: all.filter(fn).length }))} /></div>
      <DataTable caption="Insumos del taller" noun="insumos" rows={rows} columns={columns} state={state} pageSize={12}
        rowKey={(r) => r.id} rowLabel={(r) => `Seleccionar ${r.name}`} searchText={(r) => `${r.name} ${r.supplier ?? ""}`} searchLabel="Buscar insumo" searchPlaceholder="Filamento, cera, LED…"
        onRowOpen={(r) => setOpen(r.id)} onExport={onExport} renderCard={Card} rowTone={(r) => (r.state === "short" ? "danger" : r.state === "low" ? "warning" : undefined)}
        bulkActions={(list, clear) => <BulkButton onClick={() => buy(list, clear)}>Registrar compra para reponer</BulkButton>}
        footer={(list) => <p className="flex justify-end gap-6 border-t border-line px-5 py-3 text-sm text-muted">Valor de los insumos: <strong className="tabular-nums text-ink">{formatARS(list.reduce((s, r) => s + r.value, 0))}</strong></p>}
        empty={<EmptyState title="Nada para mostrar">No hay insumos en este filtro.</EmptyState>} />
      <MaterialSheet material={materials.find((m) => m.id === open) ?? null} onClose={() => setOpen(null)} />
    </>
  );
}
