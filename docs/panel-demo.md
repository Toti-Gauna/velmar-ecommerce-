# Panel de demostración (`/admin-demo/`)

> **Panel de demostración · datos ficticios.** Accesible sin login **a propósito** en la demo pública.
> No es seguro, no protege nada y **no se reutiliza como autorización productiva**. No hay login simulado.

## Cómo funciona
- Rutas estáticas (export de Next) bajo `app/admin-demo/`, con layout propio (`AdminShell`):
  - Escritorio: barra lateral fija a todo el alto (marca, secciones agrupadas en Ventas, Catálogo, Marketing y Ajustes,
    contadores de pedidos en marcha, comprobantes por revisar, reclamos abiertos y variantes para reponer, y la "cuenta" demo con acceso a la tienda)
    + barra superior con la señal "Panel de demostración · datos ficticios", migas (Panel › área › sección), **buscador global ⌘K / Ctrl+K**
    (secciones, acciones, pedidos, productos y clientes), "Ver tienda" y "Reiniciar demo".
  - Celular: la misma barra superior con **menú hamburguesa**, y **pestañas inferiores** (Inicio, Pedidos, Pagos, Productos, Más).
  - **Guía de primera sesión**: al entrar al inicio del panel por primera vez en el navegador aparece una guía de 7 pasos
    (recorte sobre cada zona, flecha, tarjeta con Anterior / Siguiente, Escape para cerrar). Se vuelve a ver con el botón "?"
    de la barra superior. Se recuerda en `velmar-tour:admin` (no se borra con "Reiniciar demo").
  - **Tablas de CRM** (`DataTable`, pedido de Ignacio, fuera de la spec): búsqueda sin tildes, orden por columna, pestañas de filtro con
    contador, selección múltiple con acciones en lote, columnas visibles y densidad (recordadas en `velmar-demo:tables`), vista rápida
    lateral, exportar a Excel (.xlsx real, lo filtrado o lo seleccionado) y tarjetas en el celular.
  Listas largas (pedidos, productos, clientes, reclamos, cupones) con **paginado** que vuelve a la página 1 al filtrar. Detalles y edición usan query params
  (`/admin-demo/pedidos/detalle/?codigo=`, `/admin-demo/productos/editar/?id=`) para que funcionen con datos creados
  en la demo y al refrescar.
- Estado: store Zustand `velmar-demo:admin` en localStorage **de este navegador**, sembrado desde fixtures
  (`src/demo/fixtures/admin-*.ts`). Cada cambio muestra "Cambio guardado solo en esta demo" y deja una línea de auditoría de muestra.
- La tienda y el panel comparten los datos editables (`src/demo/engine/source.ts`): catálogo, stock, plantillas,
  zonas de texto, cupones, misiones, zonas de envío, ajustes y contenido. Un cambio en el panel se ve en la tienda del mismo navegador.
- "Reiniciar demo" (banner del panel o de la tienda) vuelve tienda y panel a los fixtures.
- Acceso discreto desde la tienda: link "Ver panel demo" en el pie. No aparece en la navegación principal.

## Implementado (demostrable)
| Sección | Qué se puede hacer |
|---|---|
| Inicio | KPIs con variación contra la semana anterior y sparkline (ventas 7 días, ticket promedio, pedidos, comprobantes por revisar), embudo de pedidos por estado (cada etapa abre la lista filtrada), gráfico con tabla, productos más vendidos, rendimiento del club (misiones y ruleta), actividad reciente, últimos pedidos y reclamos. Fecha de referencia fija: 4/10/2026 |
| Pedidos | Tabla con pestañas por etapa (por cobrar, para producir, en producción…), búsqueda, rango de fechas, orden por cualquier columna, cambio de estado **en lote** (solo los que la transición permite), vista rápida lateral, fecha comprometida con aviso de atraso y exportar a Excel; detalle con productos, variante, personalización aprobada, comprobante de muestra, historial, notas internas, fecha comprometida y cambio de estado **solo por transiciones válidas** (spec 5.2) |
| Pagos manuales | Cola de transferencia/QR: aprobar (con confirmación) o rechazar **con motivo obligatorio**. Comprobante subido → "en revisión", nunca pagado. Auditoría de muestra |
| Productos | Tabla con filtros por categoría y stock (bajo, sin stock, a pedido, pausados), aviso de reposición, pausar/mostrar y mover de categoría en lote, exportar. Crear (queda pausado), editar nombre/descripción/categoría/precio ilustrativo/plazo/destacado/nuevo/activo, ilustración o foto local + alt, variantes con color/tamaño/recargo/stock (−1 = a pedido), medidas de envío y plantilla |
| Stock | Una fila por variante: sumar/restar o marcar “a pedido” en la tabla, umbral de aviso configurable, filtro “Para reponer”, acciones en lote (sumar 5/10, a pedido, dejar en 0), unidades y valor del inventario al pie |
| Planilla | Planilla nativa de productos y variantes: celdas editables con teclado, validación (pesos enteros, stock ≥ 0 o a pedido), orden por columna, filtros, columna fija, copiar y pegar con Excel (TSV), deshacer/rehacer, cambios marcados hasta guardar y totales |
| Importar desde Excel | .xlsx (todas las hojas) o .csv leído en el navegador: plantilla con el catálogo actual (con columna Código), planilla de ejemplo, mapeo de columnas automático (sinónimos como Rubro, Artículo, Cantidad) y editable, vista previa por fila (nuevo, variante nueva, se actualiza, sin cambios, error con motivo), importar lo válido y **deshacer** (con confirmación) |
| Categorías y personalización | Crear, renombrar en la tabla, ordenar, destacar, ver productos activos y variantes para reponer; plantillas de texto (máx. caracteres, tipografías, colores, recargo), foto (máscara arco/círculo/rectángulo) y referencia (texto de ayuda); zona de texto con vista previa en vivo |
| Misiones | Crear, editar, encadenar, activar/pausar, completados de muestra y simulador de progreso con premio de ejemplo al llegar al umbral. Sin referidos |
| Cupones | Crear (porcentaje, monto, envío gratis, mínimo, usos, vencimiento, solo con cuenta), pausar, usos simulados. Funcionan en el carrito demo. **Ruleta**: editar premios, pesos (con probabilidad resultante) y días de vigencia; los cupones ganados figuran con la etiqueta "Ruleta" |
| Clientes | Cuentas e invitados unidos por email, segmentos (VIP desde $100.000 pagados, recurrente, nuevo, sin compras), total pagado, ticket promedio, última compra, ficha lateral con compras, misiones, premios y bloqueo visual, copiar emails en lote y exportar. Sin contraseñas ni datos de pago |
| Reclamos | Pendientes/cerrados; marcar en curso, resolver o rechazar con motivo. Los arrepentimientos enviados desde la tienda demo llegan acá |
| Temáticas | **Agregado pedido por Ignacio (fuera de la especificación).** 13 fechas comerciales (Día de la Madre, Halloween, Black Friday, Navidad, Año Nuevo, San Valentín, San Patricio, Pascuas, Día del Animal, Hot Sale, Día del Padre, del Amigo y del Niño). Modo automático por fecha, fija o ninguna; habilitar/deshabilitar; editar fechas (calendario nativo, se repiten cada año), titular, bajada, cinta, cupón de la oferta y productos en oferta; "Ver" la abre en la tienda; mostrar u ocultar el botón "Probar temáticas". Los cupones de temática figuran en Cupones con la etiqueta "Temática" |
| Contenido | Carrusel (orden, visibilidad, textos, destino), textos de inicio y preguntas frecuentes |
| Ajustes | Colores de marca (con chequeo de contraste AA), WhatsApp, alias/CBU/titular **de muestra**, QR con marca de agua (solo vista local), medios activos, descuento transferencia/QR, horas de reserva, zonas de envío y umbral de envío gratis |

## Simulado (no existe en la demo)
- Ningún login, rol, sesión, cookie, API, Server Action, webhook, base de datos, archivo privado ni email.
- "Aprobar comprobante" no verifica ningún ingreso: solo cambia el estado local. "Simular confirmación de Mercado Pago" reemplaza al webhook.
- Fotos de producto y QR se reducen en el navegador y no se suben. Las fotos originales de pedidos son ficticias.
- Ventas, usos de cupones, completados de misiones y perfiles son cifras de muestra.

## Diferencias obligatorias con producción (post-seña)
1. `/admin` con **Better Auth**, rol `ADMIN` verificado en el servidor en cada ruta y acción; sesión de admin más corta; límite de intentos.
2. Todas las mutaciones por Server Actions con Zod + permisos, en `src/server/services`; transiciones por una sola `transition()` en transacción, con `OrderStatusLog` y `AuditLog` persistentes.
3. Pagos: `PAID` solo por webhook firmado y verificado (monto, moneda, referencia) o por aprobación manual de un admin autenticado tras verificar el ingreso real.
4. Comprobantes y fotos de clientes en FileStorage privado fuera de `public/`, servidos por `/api/files/[id]` con autorización.
5. Stock con reservas transaccionales (`reserved`), vencimiento por job y "a pedido" sin cupo.
6. Datos multiusuario en PostgreSQL: lo que se edita en un navegador lo ven todos; nada en localStorage salvo el carrito.
7. Emails reales en cada cambio de estado, reclamo y premio.
8. Este panel demo **no se migra**: se reemplaza por el panel real. Solo se reutilizan componentes visuales.
