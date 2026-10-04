import type { LucideIcon } from "lucide-react";
import { BadgePercent, Boxes, ClipboardList, LayoutDashboard, LifeBuoy, Palette, Settings, Shapes, Target, Users, Wallet } from "lucide-react";

export const ADMIN_GROUPS = ["Operación", "Catálogo", "Marketing", "Clientes"] as const;

export type NavBadge = "orders" | "payments" | "claims";

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
  { href: "/admin-demo/", label: "Inicio", short: "Inicio", icon: LayoutDashboard, group: "Operación", tab: true },
  { href: "/admin-demo/pedidos/", label: "Pedidos", short: "Pedidos", icon: ClipboardList, group: "Operación", badge: "orders", tab: true },
  { href: "/admin-demo/pagos/", label: "Pagos manuales", short: "Pagos", icon: Wallet, group: "Operación", badge: "payments", tab: true },
  { href: "/admin-demo/reclamos/", label: "Reclamos", short: "Reclamos", icon: LifeBuoy, group: "Operación", badge: "claims" },
  { href: "/admin-demo/productos/", label: "Productos", short: "Productos", icon: Boxes, group: "Catálogo", tab: true },
  { href: "/admin-demo/categorias/", label: "Categorías y personalización", short: "Categorías", icon: Shapes, group: "Catálogo" },
  { href: "/admin-demo/misiones/", label: "Misiones", short: "Misiones", icon: Target, group: "Marketing" },
  { href: "/admin-demo/cupones/", label: "Cupones y ruleta", short: "Cupones", icon: BadgePercent, group: "Marketing" },
  { href: "/admin-demo/contenido/", label: "Contenido", short: "Contenido", icon: Palette, group: "Marketing" },
  { href: "/admin-demo/usuarios/", label: "Usuarios", short: "Usuarios", icon: Users, group: "Clientes" },
  { href: "/admin-demo/ajustes/", label: "Ajustes", short: "Ajustes", icon: Settings, group: "Clientes" },
];


export function isActive(pathname: string, href: string): boolean {
  return href === "/admin-demo/" ? pathname === "/admin-demo/" || pathname === "/admin-demo" : pathname.startsWith(href);
}

export function currentSection(pathname: string): AdminNavItem {
  return ADMIN_NAV.find((n) => n.href !== "/admin-demo/" && isActive(pathname, n.href)) ?? ADMIN_NAV[0]!;
}
