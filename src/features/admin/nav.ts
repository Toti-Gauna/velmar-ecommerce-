import type { LucideIcon } from "lucide-react";
import { BadgePercent, Boxes, Calculator, CalendarDays, ClipboardList, Factory, FileSpreadsheet, LayoutDashboard, LifeBuoy, PackageCheck, Palette, PartyPopper, Settings, Shapes, Sheet, Spool, Target, Users, Wallet } from "lucide-react";

export const ADMIN_GROUPS = ["Ventas", "Taller", "Catálogo", "Marketing", "Ajustes"] as const;

export type NavBadge = "orders" | "payments" | "claims" | "stock" | "late" | "materials";

/** Texto para lectores de pantalla después del número del contador. */
export const BADGE_TEXT: Record<NavBadge, string> = { orders: "en marcha", payments: "por revisar", claims: "abiertos", stock: "para reponer", late: "atrasados", materials: "para reponer" };

export interface AdminNavItem {
  href: string;
  label: string;
  /** Rótulo corto para las pestañas inferiores del celular. */
  short: string;
  icon: LucideIcon;
  group: (typeof ADMIN_GROUPS)[number];
  badge?: NavBadge;
  /** Aparece en las pestañas inferiores del celular. */
  tab?: boolean;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin-demo/", label: "Inicio", short: "Inicio", icon: LayoutDashboard, group: "Ventas", tab: true },
  { href: "/admin-demo/pedidos/", label: "Pedidos", short: "Pedidos", icon: ClipboardList, group: "Ventas", badge: "orders", tab: true },
  { href: "/admin-demo/pagos/", label: "Pagos manuales", short: "Pagos", icon: Wallet, group: "Ventas", badge: "payments", tab: true },
  { href: "/admin-demo/usuarios/", label: "Clientes", short: "Clientes", icon: Users, group: "Ventas" },
  { href: "/admin-demo/reclamos/", label: "Reclamos", short: "Reclamos", icon: LifeBuoy, group: "Ventas", badge: "claims" },
  { href: "/admin-demo/calendario/", label: "Calendario de entregas", short: "Calendario", icon: CalendarDays, group: "Taller", badge: "late" },
  { href: "/admin-demo/produccion/", label: "Cola de producción", short: "Producción", icon: Factory, group: "Taller" },
  { href: "/admin-demo/costos/", label: "Costos y margen", short: "Costos", icon: Calculator, group: "Taller" },
  { href: "/admin-demo/insumos/", label: "Insumos", short: "Insumos", icon: Spool, group: "Taller", badge: "materials" },
  { href: "/admin-demo/productos/", label: "Productos", short: "Productos", icon: Boxes, group: "Catálogo", tab: true },
  { href: "/admin-demo/stock/", label: "Stock", short: "Stock", icon: PackageCheck, group: "Catálogo", badge: "stock" },
  { href: "/admin-demo/planilla/", label: "Planilla", short: "Planilla", icon: Sheet, group: "Catálogo" },
  { href: "/admin-demo/importar/", label: "Importar desde Excel", short: "Importar", icon: FileSpreadsheet, group: "Catálogo" },
  { href: "/admin-demo/categorias/", label: "Categorías y personalización", short: "Categorías", icon: Shapes, group: "Catálogo" },
  { href: "/admin-demo/misiones/", label: "Misiones", short: "Misiones", icon: Target, group: "Marketing" },
  { href: "/admin-demo/cupones/", label: "Cupones y ruleta", short: "Cupones", icon: BadgePercent, group: "Marketing" },
  { href: "/admin-demo/tematicas/", label: "Temáticas", short: "Temáticas", icon: PartyPopper, group: "Marketing" },
  { href: "/admin-demo/contenido/", label: "Contenido", short: "Contenido", icon: Palette, group: "Marketing" },
  { href: "/admin-demo/ajustes/", label: "Ajustes", short: "Ajustes", icon: Settings, group: "Ajustes" },
];


export function isActive(pathname: string, href: string): boolean {
  return href === "/admin-demo/" ? pathname === "/admin-demo/" || pathname === "/admin-demo" : pathname.startsWith(href);
}

export function currentSection(pathname: string): AdminNavItem {
  return ADMIN_NAV.find((n) => n.href !== "/admin-demo/" && isActive(pathname, n.href)) ?? ADMIN_NAV[0]!;
}
