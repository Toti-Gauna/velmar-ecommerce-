import type { ReactNode } from "react";
import type { SortDir, SortValue } from "@/demo/admin/table";

/** Columna de DataTable. Es ordenable si tiene `sortValue` y se exporta si tiene `exportValue`. */
export interface Column<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  sortValue?: (row: T) => SortValue;
  exportValue?: (row: T) => string | number;
  align?: "left" | "right" | "center";
  /** Ancho mínimo u otras clases de la celda. */
  className?: string;
  /** Celda que abre el detalle de la fila (se vuelve un botón). */
  primary?: boolean;
  /** No se puede ocultar desde "Columnas". */
  pinned?: boolean;
  /** Arranca oculta. */
  defaultHidden?: boolean;
}

export interface Sort {
  id: string;
  dir: SortDir;
}

export type Density = "comfortable" | "compact";

/** Estado de la tabla (lo maneja useTableState en el panel; la tabla solo lo muestra). */
export interface TableState {
  query: string;
  setQuery: (q: string) => void;
  sort: Sort | null;
  setSort: (s: Sort | null) => void;
  page: number;
  setPage: (p: number) => void;
  selected: Set<string>;
  setSelected: (keys: Set<string>) => void;
  hidden: Set<string>;
  toggleColumn: (id: string) => void;
  density: Density;
  setDensity: (d: Density) => void;
}

export interface RowCardProps<T> {
  row: T;
  selected: boolean;
  onToggle: () => void;
  onOpen?: () => void;
}

export type ExportSheet = (string | number)[][];

export interface DataTableProps<T> {
  /** Nombre accesible de la tabla. */
  caption: string;
  /** Plural para el paginado y los contadores ("pedidos"). */
  noun: string;
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  /** Texto para el checkbox de selección ("Seleccionar VEL-000123"). */
  rowLabel: (row: T) => string;
  /** Texto en el que busca el buscador de la tabla. */
  searchText: (row: T) => string;
  searchLabel: string;
  searchPlaceholder?: string;
  state: TableState;
  pageSize?: number;
  /** Filtros propios de la pantalla, al lado del buscador. */
  filters?: ReactNode;
  /** Vistas guardadas u otros controles a la derecha de la barra. */
  toolbarEnd?: ReactNode;
  bulkActions?: (rows: T[], clear: () => void) => ReactNode;
  onRowOpen?: (row: T) => void;
  onExport?: (sheet: ExportSheet, scope: "selected" | "filtered") => void;
  /** Tarjeta para el celular; sin ella se ve la tabla con scroll horizontal. */
  renderCard?: (props: RowCardProps<T>) => ReactNode;
  /** Fila destacada (por ejemplo, stock bajo). */
  rowTone?: (row: T) => "warning" | "danger" | undefined;
  empty: ReactNode;
  footer?: (rows: T[]) => ReactNode;
}
