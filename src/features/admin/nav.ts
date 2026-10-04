import { BadgePercent, Boxes, ClipboardList, LayoutDashboard, LifeBuoy, Palette, Settings, Shapes, Target, Users, Wallet } from "lucide-react";

export const ADMIN_NAV = [
  { href: "/admin-demo/", label: "Inicio", icon: LayoutDashboard, group: "Operación" },
  { href: "/admin-demo/pedidos/", label: "Pedidos", icon: ClipboardList, group: "Operación" },
  { href: "/admin-demo/pagos/", label: "Pagos manuales", icon: Wallet, group: "Operación" },
  { href: "/admin-demo/reclamos/", label: "Reclamos", icon: LifeBuoy, group: "Operación" },
  { href: "/admin-demo/productos/", label: "Productos", icon: Boxes, group: "Catálogo" },
  { href: "/admin-demo/categorias/", label: "Categorías y personalización", icon: Shapes, group: "Catálogo" },
  { href: "/admin-demo/misiones/", label: "Misiones", icon: Target, group: "Marketing" },
  { href: "/admin-demo/cupones/", label: "Cupones", icon: BadgePercent, group: "Marketing" },
  { href: "/admin-demo/contenido/", label: "Contenido", icon: Palette, group: "Marketing" },
  { href: "/admin-demo/usuarios/", label: "Usuarios", icon: Users, group: "Clientes" },
  { href: "/admin-demo/ajustes/", label: "Ajustes", icon: Settings, group: "Clientes" },
] as const;

export const ADMIN_GROUPS = ["Operación", "Catálogo", "Marketing", "Clientes"] as const;
