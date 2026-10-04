import { BadgePercent, Boxes, ClipboardList, LayoutDashboard, LifeBuoy, Palette, Settings, Shapes, Target, Users, Wallet } from "lucide-react";

export const ADMIN_NAV = [
  { href: "/admin-demo/", label: "Inicio", icon: LayoutDashboard },
  { href: "/admin-demo/pedidos/", label: "Pedidos", icon: ClipboardList },
  { href: "/admin-demo/pagos/", label: "Pagos manuales", icon: Wallet },
  { href: "/admin-demo/productos/", label: "Productos", icon: Boxes },
  { href: "/admin-demo/categorias/", label: "Categorías y personalización", icon: Shapes },
  { href: "/admin-demo/misiones/", label: "Misiones", icon: Target },
  { href: "/admin-demo/cupones/", label: "Cupones", icon: BadgePercent },
  { href: "/admin-demo/usuarios/", label: "Usuarios", icon: Users },
  { href: "/admin-demo/reclamos/", label: "Reclamos", icon: LifeBuoy },
  { href: "/admin-demo/contenido/", label: "Contenido", icon: Palette },
  { href: "/admin-demo/ajustes/", label: "Ajustes", icon: Settings },
] as const;
