# Polish 8.3 · Panel admin — estado por ID

Rama `claude/polish-8-3-admin`, un commit por lote y un PR al final (pedido de Ignacio, fuera de la especificación). Plan de
8 lotes consolidado; los números de lote de las fichas de Notion son históricos. Cierre solo al final del Lote 8 con los 30
IDs verificados.

Estados: **hecho** (criterio cumplido y con evidencia) · **parcial** (existe algo, falta parte) · **pendiente** (no
implementado) · **no verificable** (no se puede probar acá).

| ID | Lote | Ruta / componente | Estado | Evidencia | Pendiente |
|---|---|---|---|---|---|
| 8.3.1 Gráfico de ventas interactivo | 1 | `/admin-demo/` · `SalesByDay`, `SalesChart`, `salesSummary` | hecho | `admin-polish-dashboard.spec.ts`, `admin.test.ts` (barras, tabla y KPI concilian) | — |
| 8.3.2 Sidebar responsive | 1 | `AdminShell`, `AdminSidebar`, `AdminTabBar`, variante `desk:` | hecho (emulado) | `admin-polish-shell.spec.ts` (1440, 1280, 1024 con mouse; 1024, 768, 390, 360 táctil) | Probar en iPad real |
| 8.3.3 Cards verticales en home | 1 | `Dashboard`, `OrderCard`, `DashboardInsights` | hecho (emulado) | `admin-polish-dashboard.spec.ts` (1440, 1024, 390, 360) | Probar en iPad real |
| 8.3.4 Filtros universales y vista Excel | 2 | `data-table/*`, `useTableState`, `sheet/*`, las 6 tablas | hecho (emulado) | `admin-polish-tables.spec.ts`, `admin-tables-83.test.ts` | Fichas completas de pago y reclamo (Lote 3); iPad real |
| 8.3.5 Detalles full-page y estados | 3 | `OrderDetail`, Pagos, Reclamos | parcial | Desde el Lote 2 la fila de pedido y la de cliente abren su página completa; se retiraron los paneles laterales | Encabezado con estados autorizados; rutas de página para pago y reclamo |
| 8.3.6 Organización premium de detalles | 3 | `OrderDetail` | parcial | — | Jerarquía y columnas |
| 8.3.7 Comprobantes: layout y estados | 3 | `ProofReview`, `PaymentsQueue` | parcial | Imagen a la izquierda desde 640 px | Cabecera mínima, chips, apilado |
| 8.3.8 Quitar Auditoría de muestra | 3 | `PaymentsQueue` | pendiente | — | — |
| 8.3.9 Clientes sin "Para escribirles" | 3 | `CustomersTable` | pendiente | — | — |
| 8.3.10 Explicar estados y segmentos | 3 | `CustomersTable`, `customers.ts` | pendiente | — | — |
| 8.3.11 Quitar guía inicial | 1 | `AdminShell` (sin `tour/`) | hecho | `admin-flows.spec.ts` (sin guía la primera vez ni después de reiniciar) | — |
| 8.3.12 Fila Cliente → ficha completa | 3 | `CustomersTable`, `CustomerProfile` | parcial | La fila abre directo la ficha (Lote 2) | Volver con filtros desde la ficha; composición (8.3.13) |
| 8.3.13 Composición de ficha Cliente | 3 | `CustomerProfile` | parcial | — | Rediseño |
| 8.3.14 Modal de capacidad y feriados | 5 | `WorkshopSettingsSheet` | parcial | Dos bloques en un panel lateral | Modal, feriados de a 10 |
| 8.3.15 Calendario editable y DnD | 5 | `DeliveryCalendar`, `MonthView` | parcial | Arrastrar y "Mover" existen | Crear/editar al tocar un día |
| 8.3.16 Kanban responsive | 5 | `ProductionBoard` | parcial | Arrastrar y botón de etapa siguiente | Columnas legibles, "Mover etapa" |
| 8.3.17 Modales Costos e Insumos | 3 | `RecipeSheet`, `MaterialsTable` | pendiente | — | — |
| 8.3.18 Insumos con tabla universal | 2 | `MaterialsTable`, `materialSheetSpec` | hecho (emulado) | `admin-polish-catalog.spec.ts`, `admin-tables-83.test.ts` | La fila abre el panel actual; pasa a modal con 8.3.17 (Lote 3) |
| 8.3.19 Productos y stock; sin Planilla | 2 | `nav.ts`, `ProductsTable`, `catalogTable`, `ModuleMoved` | hecho (emulado) | `admin-polish-tables.spec.ts`, `admin-crm.spec.ts`, `admin-routes.spec.ts` | — |
| 8.3.20 Editor con imagen primero y stepper | 4 | `ProductEditor` | pendiente | — | — |
| 8.3.21 Vista previa con regreso | 4 | `ProductEditor` | pendiente | — | — |
| 8.3.22 Categorías: tabla y modal | 2 | `categories/*` (tabla, modal, detalle) | hecho (emulado) | `admin-polish-catalog.spec.ts`, `admin-tables-83.test.ts` | — |
| 8.3.23 Nueva misión en modal | 6 | `MissionsAdmin` | pendiente | — | — |
| 8.3.24 Marketing por cards | 6 | `nav.ts`, `EmailEditor`, `CouponsAdmin` | parcial | Emails ya en tarjetas | Entrada por cards y subpáginas |
| 8.3.25 Ruleta arriba y premios | 6 | `WheelAdmin` | parcial | Arriba solo en el celular | Select por ID, plantillas |
| 8.3.26 Header de Temáticas | 7 | `ThemesAdmin`, `ThemeMode` | parcial | — | Revisar en tablet |
| 8.3.27 Oferta en Estudio | 7 | `studio/render/templates.ts` | pendiente | — | — |
| 8.3.28 Contenido por cards y carrusel | 7 | `ContentAdmin`, `SlidesEditor` | parcial | — | Cards, preview, subida de imagen |
| 8.3.29 Ajustes por cards; sin Marca | 8 | `SettingsAdmin`, `SettingsSections` | parcial | — | Cards y retirar Marca |
| 8.3.30 Datos de cobro desde Pagos | 3 | `PaymentsQueue`, `CollectionSettings` | pendiente | — | — |

## Lote 1 · registro

- **Base:** `main` en `9e9f828` (merge de Polish 8.2). Baseline: lint ✅, tipos ✅, 185 unit ✅; build y 218 e2e ✅ sobre el
  mismo árbol (corrida del cierre de 8.2).
- **Notion leído:** Contexto Eclipse, Eclipse Agency, Ficha Velmar, Roadmap demo v2, Polish 8.3, Prompt maestro 8.3, las
  30 fichas, Especificación técnica, Pagos y conciliación, Agentes. No existe una página "Referencia Notion": el estándar de
  tablas es el de 8.3.4.
- **Agentes:** `.claude/agents/velmar.md` y `frontend-architect` (local y en `Toti-Gauna/agents`); `cybersecurity-arquitect`
  disponible para el cierre. No existen en el repo de agentes Design-Architect, Documentador ni Ecommerce-Agent.
- **Decisión 8.3.2:** "escritorio" = desde 1024 px **y** mouse (puntero fino con hover). Así el iPad (táctil) usa
  hamburguesa y pestañas aunque mida 1024 o 1180 px, y nada depende del hover en pantallas táctiles. El riel se despliega
  encima del contenido (no lo corre); fijarlo sí lo corre, porque lo pide la persona.
- **Tiempo observado (automatizado):** lectura e inventario ~25 min; Lote 1 implementación y verificación ~70 min (incluye
  el arreglo del CI del PR #22). No incluye la revisión de Ignacio.

## Lote 2 · registro

- **Base:** commit del Lote 1 (`5306a8c`).
- **Tabla común (8.3.4):** filtros declarativos (`FilterSpec`) con el conteo de cada opción; el estado es un filtro más (sin
  filas de pestañas). Los que entran en el ancho real de la tabla quedan en la barra y el resto en "Más filtros" (container
  queries, sin medir con JS). Buscar, "Reiniciar filtros", 10 por página con número de página y total. Búsqueda, filtros,
  página y vista viven en la URL, así Atrás desde una ficha vuelve con el filtro puesto. Toda la fila abre su entidad; lo que
  tiene acción propia (checkbox, switch, stock, enlaces, botones) no navega. Pedidos y clientes abren su página completa y se
  retiraron sus paneles laterales (el patrón de navegación que pide el Lote 2; el resto de 8.3.5 y 8.3.12 sigue en el Lote 3).
- **Vista Excel:** la grilla de la ex Planilla se generalizó (`SheetGrid`, `useSheetGrid`, `SheetSpec`) y se abre al pie de
  las 6 tablas con los mismos filtros. Editan Productos y stock, Insumos y Categorías, con validación y un solo guardado por
  el engine (`updateProducts`, `updateMaterials`, `updateCategories`). Pedidos, Clientes y Costos son de solo lectura: estados y
  pagos no se tocan desde celdas. El borrador queda en `sessionStorage` hasta guardar o descartar. El `.xlsx` lleva todo lo
  filtrado, no solo la página, y lo dice al lado del botón.
- **Productos y stock (8.3.19):** una entrada en el menú; vista Productos | Variantes con los mismos filtros; Stock, Planilla e
  Importar salen del menú (Importar queda como acción del módulo y en ⌘K). `/admin-demo/stock/` y `/admin-demo/planilla/`
  redirigen conservando `?vista=reponer` y la búsqueda. Sin cambios en el formato guardado: lo de antes de 8.3 sigue igual.
- **Decisión a confirmar:** "Importar desde Excel" también salió del menú, porque la ficha pide que el menú tenga
  únicamente "Productos y stock" para este módulo. La ruta y el botón del módulo siguen.
- **Categorías (8.3.22):** tabla común, modal de alta (nombre, descripción, destacada; el nombre repetido se permite como
  antes y se avisa), detalle en `/admin-demo/categorias/detalle/?slug=`. El orden de la tienda es global: Subir/Bajar solo con
  la tabla en ese orden y sin filtros.
- **Fuera de las tablas:** Pagos, Reclamos y Cupones son listas de tarjetas; se revisan en los Lotes 3 y 6.
- **Tiempo observado (automatizado):** ~2 h 40 min de implementación y verificación. No incluye la revisión de Ignacio.
