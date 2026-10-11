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
| 8.3.5 Detalles full-page y estados | 3 | `detail/DetailHeader`, `OrderDetail`, `payments/PaymentDetail`, `claims/ClaimDetail`, `order-tracks` | hecho (emulado) | `admin-polish-details.spec.ts`, `admin-details-83.test.ts` | — |
| 8.3.6 Organización premium de detalles | 3 | `OrderDetail`, `detail/Panel` | hecho (emulado) | `admin-polish-details.spec.ts` (1280, 768, 390) | Probar en iPad real |
| 8.3.7 Comprobantes: layout y estados | 3 | `payments/PaymentCard`, `PaymentDetail`, `ProofActions` | hecho (emulado) | `admin-polish-details.spec.ts`, `admin-flows.spec.ts` | Probar en iPad real |
| 8.3.8 Quitar Auditoría de muestra | 3 | `payments/PaymentsQueue` | hecho | `admin-polish-details.spec.ts`, `admin-flows.spec.ts` | — |
| 8.3.9 Clientes sin "Para escribirles" | 3 | `CustomersTable`, `WorkshopStrip` | hecho | `admin-polish-customers.spec.ts`, `admin-workshop.spec.ts` | QA global provisional: cierre en el Lote 8 |
| 8.3.10 Explicar estados y segmentos | 3 | `Help`, `help.ts`, filtros de Clientes, Pedidos, Insumos, Costos y Pagos | hecho | `admin-polish-customers.spec.ts`, `admin-details-83.test.ts` | Estados del taller (calendario y producción) en el Lote 5 |
| 8.3.11 Quitar guía inicial | 1 | `AdminShell` (sin `tour/`) | hecho | `admin-flows.spec.ts` (sin guía la primera vez ni después de reiniciar) | — |
| 8.3.12 Fila Cliente → ficha completa | 3 | `CustomersTable`, `CustomerProfile`, `listReturn` | hecho | `admin-polish-customers.spec.ts` | — |
| 8.3.13 Composición de ficha Cliente | 3 | `CustomerProfile`, `PetsCard`, `ClubCard`, `Reminders` | hecho (emulado) | `admin-polish-customers.spec.ts` (1280, 768, 390) | Probar en iPad real |
| 8.3.14 Modal de capacidad y feriados | 5 | `WorkshopSettingsSheet` | parcial | Dos bloques en un panel lateral | Modal, feriados de a 10 |
| 8.3.15 Calendario editable y DnD | 5 | `DeliveryCalendar`, `MonthView` | parcial | Arrastrar y "Mover" existen | Crear/editar al tocar un día |
| 8.3.16 Kanban responsive | 5 | `ProductionBoard` | parcial | Arrastrar y botón de etapa siguiente | Columnas legibles, "Mover etapa" |
| 8.3.17 Modales Costos e Insumos | 3 | `detail/EditDialog`, `RecipeSheet`, `MaterialDialog`, `edit-forms` | hecho (emulado) | `admin-polish-customers.spec.ts`, `admin-workshop.spec.ts`, `admin-details-83.test.ts` | — |
| 8.3.18 Insumos con tabla universal | 2 | `MaterialsTable`, `materialSheetSpec` | hecho (emulado) | `admin-polish-catalog.spec.ts`, `admin-tables-83.test.ts` | — (la fila abre el modal de 8.3.17) |
| 8.3.19 Productos y stock; sin Planilla | 2 | `nav.ts`, `ProductsTable`, `catalogTable`, `ModuleMoved` | hecho (emulado) | `admin-polish-tables.spec.ts`, `admin-crm.spec.ts`, `admin-routes.spec.ts` | — |
| 8.3.20 Editor con imagen primero y stepper | 4 | `ProductEditor`, `products/EditorSections`, `EditorStepper`, `EditorBar`, `useEditorNav`, `product-steps` | hecho (emulado) | `admin-polish-editor.spec.ts` (1440, 1024 con mouse; 768, 390 táctil), `admin-editor-83.test.ts` | Probar en iPad e iPhone reales (teclado en pantalla con la barra fija) |
| 8.3.21 Vista previa con regreso | 4 | `/vista-previa/` · `ProductPreview`, `ProductDetail` (`preview`), `products/editorDrafts` | hecho (emulado) | `admin-polish-editor.spec.ts`, `admin-editor-83.test.ts` | Probar Atrás con gesto en iPhone real |
| 8.3.22 Categorías: tabla y modal | 2 | `categories/*` (tabla, modal, detalle) | hecho (emulado) | `admin-polish-catalog.spec.ts`, `admin-tables-83.test.ts` | — |
| 8.3.23 Nueva misión en modal | 6 | `MissionsAdmin` | pendiente | — | — |
| 8.3.24 Marketing por cards | 6 | `nav.ts`, `EmailEditor`, `CouponsAdmin` | parcial | Emails ya en tarjetas | Entrada por cards y subpáginas |
| 8.3.25 Ruleta arriba y premios | 6 | `WheelAdmin` | parcial | Arriba solo en el celular | Select por ID, plantillas |
| 8.3.26 Header de Temáticas | 7 | `ThemesAdmin`, `ThemeMode` | parcial | — | Revisar en tablet |
| 8.3.27 Oferta en Estudio | 7 | `studio/render/templates.ts` | pendiente | — | — |
| 8.3.28 Contenido por cards y carrusel | 7 | `ContentAdmin`, `SlidesEditor` | parcial | — | Cards, preview, subida de imagen |
| 8.3.29 Ajustes por cards; sin Marca | 8 | `SettingsAdmin`, `SettingsSections` | parcial | — | Cards y retirar Marca |
| 8.3.30 Datos de cobro desde Pagos | 3 | `payments/CollectionEditor`, `CollectionDialog`, `CollectionSettings` | hecho | `admin-polish-details.spec.ts`, `admin-details-83.test.ts` | Ajustes por cards en el Lote 8 reutiliza este editor |

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

## Lote 3 · registro

- **Base:** commit del Lote 2 (`bb26d8e`).
- **Fichas completas (8.3.5, 8.3.6):** encabezado común (`DetailHeader`) con migas de pan, Volver a la lista con sus filtros
  y página, ID, estados y dato destacado. El estado de pago y el de producción y entrega se muestran por separado; los dos
  salen del estado único del engine (`order-tracks.ts`). Pedido reorganizado: próxima acción con los botones permitidos
  (con confirmación); después cliente, productos, pago y entrega; a la derecha historial, notas y emails. Pagos y reclamos
  tienen su ficha propia (`/admin-demo/pagos/detalle/`, `/admin-demo/reclamos/detalle/`).
- **Comprobantes (8.3.7, 8.3.8):** cola con filtro por estado en la URL, diez por página y tarjetas con el comprobante a la
  izquierda y los datos a la derecha. Sin "Auditoría de muestra" en pantalla: el store y el historial la conservan.
- **Clientes (8.3.9, 8.3.10, 8.3.12, 8.3.13):** sin el bloque "Para escribirles"; para no perder lo que avisaba hay un filtro
  "Para escribir" y el inicio enlaza a él. Botón "i" con las definiciones del engine (también en Pedidos, Insumos, Costos y
  Pagos). La ficha suma Club (misiones y premios que ya guardaba el usuario) y se arma con columnas solo cuando entran.
- **Modales (8.3.17):** Costos e Insumos se editan en un modal con frase inicial, bloques, validación y un solo guardado;
  cerrar con cambios pide confirmar. "Nuevo insumo" ya no crea uno vacío antes de guardar.
- **Datos de cobro (8.3.30):** un editor (`CollectionEditor`) con una sola fuente, usado en Ajustes y en el modal de Pagos.
- **Tiempo observado (automatizado):** ~2 h 30 min de implementación y verificación. No incluye la revisión de Ignacio.

## Lote 4 · registro

- **Base:** commit del Lote 3 (`41354f5`).
- **Editor por pasos (8.3.20):** alta y edición usan los mismos bloques, en este orden: foto y texto alternativo, datos
  generales, categoría/precio/plazo/visibilidad, variantes, medidas de envío, personalización y revisión. Nada del formulario
  anterior se perdió. Los pasos van en una columna a la derecha cuando el editor tiene lugar (container query, desde ~900 px
  de ancho útil) y en una fila compacta fija arriba en tablet y celular. El estado de cada paso sale de validar
  (`product-steps.ts`), no de haberlo visitado: los errores se marcan después de intentar guardar; las medidas faltantes
  avisan pero no bloquean. Tocar un paso lleva al bloque debajo de lo fijo y enfoca su título, sin guardar ni descartar.
  La barra de guardado flota encima de las pestañas del celular y, al final, ocupa su propio lugar; lo fijo de arriba y de
  abajo se mide y pasa a `scroll-padding`, así un campo enfocado con Tab no queda tapado.
- **Texto alternativo obligatorio:** pasa a ser requisito para guardar (lo pide el bloque de foto). Todos los productos de
  la demo ya tienen uno (el nombre), así que lo guardado antes de 8.3 sigue guardándose igual.
- **Vista previa (8.3.21):** "Ver en tienda" guarda un borrador de la pestaña (campos, foto, variantes, personalización,
  paso y scroll) y abre `/vista-previa/?borrador=…`, que usa la misma ficha de la tienda con ese borrador: sin comprar,
  regalar ni favoritos, sin recomendaciones, sin WhatsApp ni "Probar temáticas", y una franja fija con "Volver al editor" o
  "Volver a la creación". Volver usa Atrás cuando se llegó desde el editor (y Atrás del navegador hace lo mismo); si no,
  navega al editor y al paso. La ruta no se indexa y no se agregó ningún endpoint.
- **Alta sin productos fantasma:** "Nuevo producto" (y el atajo de ⌘K) abre `/admin-demo/productos/editar/?nuevo=1` con un
  borrador de id temporal (`producto-nuevo-…`) que no existe en el catálogo hasta "Guardar" (antes se creaba un "Producto
  nuevo de ejemplo" pausado al tocar el botón). Ir y volver de la vista previa no crea nada; guardar crea uno solo, pausado
  salvo que se active.
- **Borrador:** vive en memoria y en `sessionStorage` (`velmar-ui:product-draft:<clave>`), solo mientras hay cambios; si se
  sale del editor sin guardar, al volver se recupera con aviso y opción de descartar (con confirmación). Un borrador roto o
  de otra versión se ignora. No se toca `localStorage` ni el formato de los datos guardados.
- **Tiempo observado (automatizado):** ~3 h de implementación y verificación. No incluye la revisión de Ignacio.
