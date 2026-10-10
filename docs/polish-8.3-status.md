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
| 8.3.4 Filtros universales y vista Excel | 2 | `data-table/*`, todas las tablas | pendiente | — | Más filtros, Buscar/Reiniciar, 10 por página, fila → ficha, "Ver en formato Excel" |
| 8.3.5 Detalles full-page y estados | 3 | `OrderDetail`, `OrderPeek`, Pagos, Reclamos | parcial | Ficha de pedido existe; las filas abren un panel lateral | Rutas de página para cliente, pago y reclamo |
| 8.3.6 Organización premium de detalles | 3 | `OrderDetail` | parcial | — | Jerarquía y columnas |
| 8.3.7 Comprobantes: layout y estados | 3 | `ProofReview`, `PaymentsQueue` | parcial | Imagen a la izquierda desde 640 px | Cabecera mínima, chips, apilado |
| 8.3.8 Quitar Auditoría de muestra | 3 | `PaymentsQueue` | pendiente | — | — |
| 8.3.9 Clientes sin "Para escribirles" | 3 | `CustomersTable` | pendiente | — | — |
| 8.3.10 Explicar estados y segmentos | 3 | `CustomersTable`, `customers.ts` | pendiente | — | — |
| 8.3.11 Quitar guía inicial | 1 | `AdminShell` (sin `tour/`) | hecho | `admin-flows.spec.ts` (sin guía la primera vez ni después de reiniciar) | — |
| 8.3.12 Fila Cliente → ficha completa | 3 | `CustomersTable`, `CustomerProfile` | parcial | La fila abre un panel lateral con link a la ficha | Abrir directo |
| 8.3.13 Composición de ficha Cliente | 3 | `CustomerProfile` | parcial | — | Rediseño |
| 8.3.14 Modal de capacidad y feriados | 5 | `WorkshopSettingsSheet` | parcial | Dos bloques en un panel lateral | Modal, feriados de a 10 |
| 8.3.15 Calendario editable y DnD | 5 | `DeliveryCalendar`, `MonthView` | parcial | Arrastrar y "Mover" existen | Crear/editar al tocar un día |
| 8.3.16 Kanban responsive | 5 | `ProductionBoard` | parcial | Arrastrar y botón de etapa siguiente | Columnas legibles, "Mover etapa" |
| 8.3.17 Modales Costos e Insumos | 3 | `RecipeSheet`, `MaterialsTable` | pendiente | — | — |
| 8.3.18 Insumos con tabla universal | 2 | `MaterialsTable` | parcial | Ya usa `DataTable` | Hereda lo de 8.3.4 |
| 8.3.19 Productos y stock; sin Planilla | 2 | `nav.ts`, `ProductsTable`, `StockTable`, `SpreadsheetView` | pendiente | — | — |
| 8.3.20 Editor con imagen primero y stepper | 4 | `ProductEditor` | pendiente | — | — |
| 8.3.21 Vista previa con regreso | 4 | `ProductEditor` | pendiente | — | — |
| 8.3.22 Categorías: tabla y modal | 2 | `CategoriesOrder` | pendiente | — | — |
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
