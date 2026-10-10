# Lo agregado fuera de la especificación técnica

Pedido de Ignacio, Fase 7 (VEL-73). La especificación técnica de Notion es la fuente de verdad; todo lo de esta lista
se construyó en la demo **a pedido de Ignacio** y no está en ella. Sirve para decidir **qué entra en producción y a qué
precio**. Esta página es la copia del repo; la misma lista está en Notion, dentro de la especificación.

**Cómo leerla**
- **Tamaño** es criterio nuestro, relativo y sin precio: **S** (pantalla o ajuste, sin datos nuevos), **M** (datos nuevos
  y reglas en el servidor) y **L** (varios modelos, reglas y pantallas). No es una cotización.
- **En producción necesita** dice qué pasa de ser del navegador a ser del servidor. En la demo todo vive en el navegador
  (`localStorage`); en producción precio, stock, pagos y misiones los decide solo `src/server/services`.
- **Decisión** la completa Ignacio con el cliente: entra · después · no.

## Tienda

| Agregado | Fase | En producción necesita | Tamaño | Decisión |
|---|---|---|---|---|
| Ruleta de cupones (física, con gajos, sonido y confeti) | previa y 4 | Sorteo ponderado y cupón `RULETA…` de un uso, con vencimiento y un giro por cuenta, decididos en el servidor | M | |
| Mis cupones (pantalla y selector en el carrito) | previa | Cupones por cuenta, estados (vencido, mínimo, solo con cuenta) | S | |
| Buscador superpuesto (recientes, lo más buscado, tolerante a errores) | previa | Índice de búsqueda sin tildes; recientes por dispositivo | S | |
| Favoritos y su pantalla | previa | Tabla de favoritos por cuenta (hoy por navegador) | S | |
| "Comprar ahora", barra inferior de vidrio, carrusel con pausa, historias de producto | previa y 0 | Solo contenido editable | S | |
| Ficha todo en uno y **aprobación al agregar al carrito** | previa | **Cambio a la spec:** "Así lo quiero" ya no es una casilla; se guarda `approvedAt` al agregar | S | |
| ¿Cuándo llega? (usa el calendario del taller) | 2 | Plazos y capacidad del taller en el servidor | M | |
| Configurador del collar (letras, cordón, material, dije, talle por cuello) | 4 | Opciones y recargos como datos; precio calculado en el servidor | L | |
| Sonidos sintetizados con botón de silencio | 4 | Nada (navegador) | S | |
| Pantalla de carga de 5 s y confeti de compra | previa | Nada (navegador) | S | |
| Temáticas (16 fechas con paleta, fondo, pantalla de carga, cinta, cupón y ofertas) | previa, 5 | Tabla de temporadas con fechas y cupón; vigencia validada en el servidor | M | |
| Personajes Pancho y Lola, transiciones entre páginas y microinteracciones | 5 | Nada (navegador) | S | |

## Panel

| Agregado | Fase | En producción necesita | Tamaño | Decisión |
|---|---|---|---|---|
| Tablas de CRM (filtros, lotes, vista rápida, columnas, exportar `.xlsx`) y ⌘K | 1 | Paginado, filtros y exportación en el servidor | M | |
| Importar desde Excel y Planilla editable | 1 | Validación en el servidor, auditoría y deshacer | M | |
| Calendario de entregas (capacidad por día, feriados, reprogramar, `.ics`) | 2 | Capacidad, feriados y fechas comprometidas como datos | M | |
| Cola de producción, insumos y costos con margen | 2 | Insumos, recetas y trabajos de producción como modelos | L | |
| Ficha de cliente con mascotas y recordatorios de cumpleaños | 2 | Mascotas y recordatorios como modelos | M | |
| Emails automáticos (editor por bloques con fichas de datos, bandeja) | 3 | Plantillas en la base, disparadores por estado y envío con React Email + Nodemailer (ya en la spec para los emails transaccionales) | L | |
| Estudio de contenido para Instagram (post, historia, carrusel, PNG y video, texto sugerido) | 6 | Nada de servidor: se dibuja y graba en el navegador | M | |
| Guía de primera sesión, buscador global y paginado | previa, 1 | Nada de servidor | S | |

## Cambios a la spec que hay que decidir
1. **Aprobación del diseño**: ya no es una casilla; se confirma al agregar al carrito.
2. **Placas NFC**: Velmar vende placas con la imagen que elija el cliente, no chapitas identificatorias (confirmado por
   Ignacio el 09/10/2026).
3. **Panel sin login**: es a propósito y solo de la demo. En producción el panel va con autenticación y roles.
4. **Temáticas**: las fechas móviles (Día de la Madre, Pascuas, Orgullo) se ajustan cada año desde el panel.

## Lo que la demo no resuelve (aunque se vea)
- Cobros reales, webhooks de Mercado Pago, envío real de emails y datos compartidos entre dispositivos.
- Validar en el servidor: precios, stock, cupones, vigencias, límites de la ruleta y transiciones de estado.
- Fotos y productos reales del cliente (hoy son ilustraciones de muestra).
- La prueba en teléfonos reales: ver `docs/qa-dispositivos.md`.
