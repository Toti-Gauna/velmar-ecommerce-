# Polish 8.4 · Pulido final de tienda y panel — estado por ID

Rama `claude/velmar-ecommerce-demo-1p0bjf` (reiniciada desde `main` después del PR #24), un commit por lote y un PR
único al final. Pedido de Ignacio (fuera de la especificación de Notion salvo donde se indica). Decisiones de Ignacio del
11/10: **8.4.13 opción B** (se quitan el aviso de demo de la tienda y "Reiniciar demo"), **8.4.1 para todos los productos
con texto**, **8.4.6 las direcciones se eligen en el checkout** y **8.4.22 la tarjeta es un medio de pago propio** con las
tarjetas guardadas.

Estados: **hecho** (criterio cumplido y con evidencia) · **hecho (emulado)** (probado en Chromium emulando el dispositivo;
falta el equipo real) · **pendiente**.

| ID | Lote | Ruta / componente | Estado | Evidencia | Pendiente |
|---|---|---|---|---|---|
| 8.4.1 Nombre grabado/impreso premium | 3 | | pendiente | | |
| 8.4.2 Migas fijas con la galería | 3 | | pendiente | | |
| 8.4.3 Sin pantalla de carga al ir al checkout | 2 | | pendiente | | |
| 8.4.4 Paso Datos sin carrito | 3 | | pendiente | | |
| 8.4.5 Pago y resumen arriba de los botones | 3 | | pendiente | | |
| 8.4.6 Direcciones en Mi cuenta y checkout | 4 | | pendiente | | |
| 8.4.7 Volver a Mis pedidos | 4 | | pendiente | | |
| 8.4.8 Abrir regalo sin textos de fondo | 2 | | pendiente | | |
| 8.4.9 Regalo que no se reabre solo | 2 | | pendiente | | |
| 8.4.10 Modal de regalo vacío en iPad | 1 | `gifts/GiftModal`, `GiftPreview`, `motion/Sheet` | hecho (emulado) | `polish-84-modals.spec.ts` (820×1180, 1180×820, 375×812: campos y botones a la vista, sin hijos `flex-1`) | Confirmar en el iPad real (Safari) |
| 8.4.11 Scroll de fondo con modal abierto | 1 | `lib/scrollLock`, `motion/Sheet`, `motion/ImmersiveStage`, `molecules/ConfirmButton`, `globals.css` | hecho (emulado) | `polish-84-modals.spec.ts` (toques en el velo y el título se cancelan; el cuerpo del modal se desplaza; al cerrar vuelve) | Confirmar en iPhone y iPad reales |
| 8.4.12 Íconos del encabezado agrupados | 5 | | pendiente | | |
| 8.4.13 Sin aviso de demo ni "Reiniciar demo" | 5 | | pendiente | | |
| 8.4.14 Cumpleaños de mascotas del cliente | 4 | | pendiente | | |
| 8.4.15 Transferir pedidos al cerrar un día | 6 | | pendiente | | |
| 8.4.16 Entrega comprometida en modal | 1 | `calendar/ScheduleDialog` (antes `ScheduleSheet`) | hecho (emulado) | `polish-84-modals.spec.ts` (centrado a 1440), `admin-polish-workshop.spec.ts`, `admin-workshop.spec.ts` | — |
| 8.4.17 Botones de la cola de producción | 6 | | pendiente | | |
| 8.4.18 Costos alineados y explicados | 7 | | pendiente | | |
| 8.4.19 Generador de emails con pasos | 8 | | pendiente | | |
| 8.4.20 Bandeja de salida arriba y en modal | 1 y 8 | `emails/OutboxDialog` (antes `OutboxSheet`) | parcial | `polish-84-modals.spec.ts` (el email abre en modal centrado) | Tarjeta arriba de "Emails automáticos" (Lote 8) |
| 8.4.21 Editor de Temáticas en modal | 1 | `themes/ThemeEditor`, `detail/EditDialog` (`saveLabel`) | hecho (emulado) | `polish-84-modals.spec.ts` (centrado, cerrar con cambios pide confirmar), `themes.spec.ts` | — |
| 8.4.22 Tarjetas: medio de pago y Mi cuenta | 4 y 9 | | pendiente | | |
| 8.4.23 Ilustración del comedero perro globo | 7 | | pendiente | | |
| 8.4.24 Arrepentimiento en tablet y escritorio | 7 | | pendiente | | |
| 8.4.25 Pantalla de carga del link de regalo | 2 | | pendiente | | |
| 8.4.26 Esqueleto bajo la pantalla de carga | 2 | | pendiente | | |
| 8.4.27 Barra inferior sobre la transición | 2 | | pendiente | | |
| 8.4.28 Rendimiento en mobile (≥ 50 fps) | 10 | | pendiente | Línea de base abajo | |

## Lote 1 · registro

- **8.4.11** Causa: el bloqueo era `overflow: hidden` en `<html>`, que Safari de iPhone y iPad ignora al arrastrar con el
  dedo. `lib/scrollLock` agrega una pila de modales y cancela el `touchmove` que no cae en algo que todavía pueda
  desplazarse dentro del modal de arriba; no usa `position: fixed` en `<body>` (movería el header y la galería fijos). Lo
  usan `Sheet` (todos los modales y paneles), `ImmersiveStage` (ruleta y regalo) y la confirmación nativa
  (`ConfirmButton`, que antes no bloqueaba nada). Además, `overscroll-behavior: contain` adentro de los modales.
- **8.4.10** Causa: el modal de regalo era el único con hijos `flex-1 min-h-0` dentro de un modal cuyo alto sale del
  contenido (`fit-content`); Safari calcula ese alto con base 0 y lo colapsa, así que solo se veía el velo. Los demás
  modales (que sí se veían en el iPad) usan un hijo con `max-h` y scroll propio: el regalo ahora también. Se quitó además
  el desenfoque de la vista previa. No se pudo reproducir en Safari acá (solo hay Chromium).
- **8.4.16 / 8.4.20 / 8.4.21** Los tres paneles laterales del panel pasan a modales centrados: la entrega del calendario
  (dos columnas en escritorio), el email de la bandeja (con su asunto como título) y el editor de Temáticas (sobre
  `EditDialog`: vista previa fija a la izquierda, confirma antes de descartar).
- **Bug encontrado (8.3)**: en `EditDialog`, "Seguir editando" guardaba y cerraba. React reusaba el botón tocado como el
  de guardar (`type="submit"`) y el mismo toque enviaba el formulario. Se separaron las dos botoneras con claves.
- **8.4.28 línea de base** (`main` antes de 8.4; Chromium, 390×844 táctil, CPU frenada 4×, temática del día: Día de la
  Madre). fps promedio / % de cuadros de más de 20 ms:

  | Página | Desplazar | Quieta | Cambiar de sección | Bloqueo al cargar |
  |---|---|---|---|---|
  | Inicio | 31,9 / 48 % | 30,9 / 79 % | 24,0 / 46 % | 2,4 s |
  | Categorías | 59,6 / 1 % | 59,7 / 0 % | 50,8 / 16 % | 0,9 s |
  | Colección | 59,3 / 1 % | 58,7 / 1 % | 38,0 / 24 % | 1,0 s |
  | Producto | 59,0 / 2 % | 58,2 / 3 % | 18,7 / 82 % | 1,2 s |
  | Cupones | 58,9 / 2 % | 59,2 / 1 % | 31,7 / 31 % | 0,8 s |
  | Club | 59,7 / 1 % | 58,0 / 4 % | 35,4 / 25 % | 0,8 s |

  Lo que más pesa: el inicio (animado aun quieto) y cada cambio de sección.
