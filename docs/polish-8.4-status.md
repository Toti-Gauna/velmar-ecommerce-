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
| 8.4.1 Nombre grabado/impreso premium | 3 | `organisms/TextPreview` (`NameMark`), `fixtures/templates` (`TEXT_FINISH`, zona de la vela), `illustrations/*` (`blank`), `stores/admin` (zonas nuevas sin pisar las editadas) | hecho (emulado) | `polish-84-product.spec.ts` (los 4 productos con texto, sin rectángulo ni nombre de muestra; la vela en el carrito), capturas | — |
| 8.4.2 Migas fijas con la galería | 3 | `product/ProductDetail` (`crumbs`), `/p/[slug]` | hecho (emulado) | `polish-84-product.spec.ts` (1440: después de bajar 700 px siguen arriba de la galería) | — |
| 8.4.3 Sin pantalla de carga al ir al checkout | 2 | `organisms/Splash` (`splashScript`), `themes/reloadWithTheme` | hecho | `polish-84-splash.spec.ts` (entrar y recargar la muestran; una carga completa desde adentro no; "Ver en la tienda" la pide) | — |
| 8.4.4 Paso Datos sin carrito | 3 | `checkout/CheckoutView` | hecho (emulado) | `polish-84-product.spec.ts` (1180, 820, 390), `shop-polish-checkout.spec.ts` | — |
| 8.4.5 Cupón y resumen arriba de los botones | 3 | `checkout/StepNav` (botones fuera del formulario, `form=`), pasos de Entrega, Pago y Confirmar | hecho (emulado) | `polish-84-product.spec.ts` (orden opciones → cupón → resumen → Atrás/Siguiente en cada paso; el botón de afuera envía el paso) | — |
| 8.4.6 Direcciones en Mi cuenta y checkout | 4 | `account/AddressesSection`, `AddressDialog`, `checkout/SavedAddresses`, `DeliveryStep`, `stores/profile`, `engine/profile` | hecho (emulado) | `polish-84-account.spec.ts` (alta con validación, principal, editar, quitar; elegirla en el checkout, "Otra dirección" y guardarla), `account-84.test.ts` | — |
| 8.4.7 Volver a Mis pedidos | 4 | `order/BackToOrders`, `/pedido/[token]` | hecho | `polish-84-account.spec.ts` | — |
| 8.4.8 Abrir regalo sin textos de fondo | 2 | `gifts/GiftExperience`, `motion/ImmersiveStage` (`instant`) | hecho (emulado) | `polish-84-splash.spec.ts` (fondo oscuro sin fundido; la página de atrás no se dibuja) | Confirmar en el iPhone real |
| 8.4.9 Regalo que no se reabre solo | 2 | `gifts/GiftExperience`, `AccountGifts` (`&desde=cuenta`) | hecho | `polish-84-splash.spec.ts`, `gifts.spec.ts` | — |
| 8.4.10 Modal de regalo vacío en iPad | 1 | `gifts/GiftModal`, `GiftPreview`, `motion/Sheet` | hecho (emulado) | `polish-84-modals.spec.ts` (820×1180, 1180×820, 375×812: campos y botones a la vista, sin hijos `flex-1`) | Confirmar en el iPad real (Safari) |
| 8.4.11 Scroll de fondo con modal abierto | 1 | `lib/scrollLock`, `motion/Sheet`, `motion/ImmersiveStage`, `molecules/ConfirmButton`, `globals.css` | hecho (emulado) | `polish-84-modals.spec.ts` (toques en el velo y el título se cancelan; el cuerpo del modal se desplaza; al cerrar vuelve) | Confirmar en iPhone y iPad reales |
| 8.4.12 Íconos del encabezado agrupados | 5 | `organisms/Header` | hecho (emulado) | `polish-84-header.spec.ts` (1440: cápsula de preferencias, separador y acciones; 390 y 320: sin desborde) | — |
| 8.4.13 Sin aviso de demo ni "Reiniciar demo" | 5 | `(shop)/layout` (sin `DemoBanner`), `Footer`, `AdminTopbar`, `stores/hydration` (sin `resetDemo`) | hecho | `polish-84-header.spec.ts`, `admin-flows.spec.ts`, `purchase-flow.spec.ts` | — |
| 8.4.14 Cumpleaños de mascotas del cliente | 4 | `account/PetsSection`, `admin/data-slice` (`syncShopAccount`), `molecules/BirthdayPicker` | hecho (emulado) | `polish-84-account.spec.ts` (la mascota aparece en la ficha del cliente en el panel) | — |
| 8.4.15 Transferir pedidos al cerrar un día | 6 | `calendar/TransferPanel`, `calendar/DayDialog`, `admin/workshop/transfer` (`planTransfer`, `upcomingWorkdays`) | hecho (emulado) | `polish-84-workshop.spec.ts` (próximos días, aviso de pedidos y de capacidad, domingo bloqueado, todos juntos o uno por uno, "Dejarlos para después"; 390 px), `workshop-84.test.ts` | — |
| 8.4.16 Entrega comprometida en modal | 1 | `calendar/ScheduleDialog` (antes `ScheduleSheet`) | hecho (emulado) | `polish-84-modals.spec.ts` (centrado a 1440), `admin-polish-workshop.spec.ts`, `admin-workshop.spec.ts` | — |
| 8.4.17 Botones de la cola de producción | 6 | `production/ProductionCard` | hecho (emulado) | `polish-84-workshop.spec.ts` (1440, 1024, 390: mismo alto y de borde a borde de la tarjeta) | — |
| 8.4.18 Costos alineados y explicados | 7 | `workshop/CostsSummary`, `workshop/CostsTable` | hecho (emulado) | `polish-84-costs.spec.ts` (1440 y 1180: los tres campos a la misma altura con etiquetas de una línea; indicadores aparte; "Cómo se calcula" se recalcula con el margen objetivo y se guarda; 390 sin desborde) | — |
| 8.4.19 Generador de emails con pasos | 8 | | pendiente | | |
| 8.4.20 Bandeja de salida arriba y en modal | 1 y 8 | `emails/OutboxDialog` (antes `OutboxSheet`) | parcial | `polish-84-modals.spec.ts` (el email abre en modal centrado) | Tarjeta arriba de "Emails automáticos" (Lote 8) |
| 8.4.21 Editor de Temáticas en modal | 1 | `themes/ThemeEditor`, `detail/EditDialog` (`saveLabel`) | hecho (emulado) | `polish-84-modals.spec.ts` (centrado, cerrar con cambios pide confirmar), `themes.spec.ts` | — |
| 8.4.22 Tarjetas: medio de pago y Mi cuenta | 4 y 9 | `account/CardsSection` (Lote 4) | parcial | `polish-84-account.spec.ts` (validación, tarjeta de prueba; en el almacenamiento solo marca, últimos 4 y vencimiento), `account-84.test.ts` | Medio de pago en Ajustes y en el checkout (Lote 9) |
| 8.4.23 Ilustración del comedero perro globo | 7 | `illustrations/pets` (`BowlDog`, `Balloon`), `fixtures/templates` (zona del texto en el plato), `stores/admin` (zona vieja sin pisar las editadas) | hecho (emulado) | `polish-84-costs.spec.ts`, `polish-84-product.spec.ts` (texto en relieve sobre el plato), capturas a 390 y 1440 | Comparar con la foto real del producto |
| 8.4.24 Arrepentimiento en tablet y escritorio | 7 | `(shop)/arrepentimiento`, `legal/WithdrawalForm` | hecho (emulado) | `polish-84-costs.spec.ts` (1280 y 820: formulario y "Cómo funciona" lado a lado; 375: uno debajo del otro; se envía y da el código) | — |
| 8.4.25 Pantalla de carga del link de regalo | 2 | `app/motion.css` (pausa de `stage-open`) | hecho (emulado) | `polish-84-splash.spec.ts` (los pétalos siguen animados con el escenario abierto), captura del Día de la Madre | Confirmar en el iPad real |
| 8.4.26 Página oculta bajo la pantalla de carga | 2 | `organisms/Splash` (`splash-hold`), `app/splash.css`, `app/motion.css` (transiciones sin animación durante el splash) | hecho (emulado) | `polish-84-splash.spec.ts` (página oculta y transición sin animación mientras se ve; aparece al subir el telón) | Confirmar en el iPad real |
| 8.4.27 Barra inferior sobre la transición | 2 | `app/motion.css` (capas `shop-header`, `shop-tabbar`, `shop-buybar`, botones flotantes) | hecho (emulado) | `polish-84-splash.spec.ts`, cuadro a cuadro de cupones → inicio a 390 px | Confirmar en el iPhone real |
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

## Lote 2 · registro

- **8.4.26** Causa encontrada: React arranca una View Transition al hidratar la página, y las capas de una transición se
  dibujan por encima de todo, también del splash en la capa superior: por eso la ficha asomaba sobre la pantalla de carga
  al recargar. Mientras se ve el splash, las transiciones terminan en el acto (sin animación; no se cancelan con
  `skipTransition` porque Next espera esas promesas y una cancelada termina en un error de la página) y la página queda
  oculta (`splash-hold`) hasta que sube el telón a los 4,35 s; sin JS no hay clase y la página se ve igual.
- **8.4.3** El splash sale al entrar desde afuera o al recargar a mano. Una carga completa que viene de adentro de la
  tienda (lo que pasa cuando se publica una versión nueva a mitad de la visita y el navegador pide la página entera, que
  es lo más probable del checkout) entra directo. "Ver en la tienda" del panel la sigue pidiendo (`velmar:splash`).
- **8.4.25** Causa: al abrir el link, el escenario del regalo pone `stage-open` en `<html>`, que pausaba también la escena
  de la pantalla de carga (quedaba congelada a medio armar). La pausa ahora excluye al splash.
- **8.4.27** Causa: la barra inferior y el header quedaban en la captura de fondo y la página que entra y sale se dibujaba
  encima. Ahora van en su propia capa, quieta y arriba (también la barra de compra y los botones flotantes). El fondo del
  header que sube a tapar la hora no se dibuja durante la transición (si no, tapaba la cinta de la temática).
- **8.4.8 / 8.4.9** El escenario abierto al entrar ya está oscuro desde el primer cuadro y la página de atrás no se dibuja
  mientras está abierto. Al salir: desde Mis regalos vuelve a la cuenta (reemplaza la página, Atrás no lo reabre); por
  link o código queda "Tu regalo de…" con "Ver mi regalo" (lo de adentro, sin volver a golpearlo) o, si no se abrió,
  la invitación a abrirlo.

## Lote 3 · registro

- **8.4.1** (para todos los productos con texto, decisión de Ignacio) Antes, la vela no tenía zona de texto y caía en un
  rectángulo blanco en el medio; el resto tapaba el nombre de muestra con un rectángulo del color de la pieza. Ahora la
  ilustración deja libre el lugar del nombre (`blank`) y el texto se dibuja como parte del producto: grabado láser
  hundido (vela, comedero de madera, colgador) o letras impresas en relieve (comedero perro globo), siguiendo la curva del
  frente. La vela tiene su zona en el frente del cuenco y su nombre de muestra también grabado. Las zonas que el dueño
  editó en el panel se conservan; las nuevas se suman al cargar datos guardados antes de 8.4.
- **8.4.2** Las migas se pasan a la ficha y van arriba de la galería, dentro de la columna fija en escritorio.
- **8.4.4 / 8.4.5** (revierte 8.2.9, pedido de Ignacio) En "Datos" no se ven el carrito ni el total. Desde "Entrega",
  el orden es: opciones del paso, cupón, resumen y recién después Atrás/Siguiente. Los botones quedaron afuera del
  formulario del paso (el cupón es su propio formulario y no puede ir anidado) y lo envían con `form="checkout-paso"`.

## Lote 4 · registro

- **8.4.6** (las direcciones también se eligen en el checkout, decisión de Ignacio) Mis direcciones pasó de una tarjeta
  fija de muestra a una lista con alta y edición en un modal, principal y quitar con confirmación. Se guardan en
  `velmar-demo:profile` por email; la cuenta demo arranca con la dirección de muestra de siempre. En el paso Entrega, con
  sesión, se eligen con un toque (se propone la principal) y "Otra dirección" abre los campos, con la opción de guardarla.
  Las reglas son las mismas que el checkout; lo guardado roto se descarta al cargar.
- **8.4.7** El detalle del pedido tiene "Volver a Mis pedidos" (con la sesión abierta) y abre esa sección de la cuenta.
- **8.4.14** Mis mascotas: alta y edición con cumpleaños sin año. Usa la misma ficha del cliente que ve el dueño en el
  panel, así que el recordatorio y el email de cumpleaños salen igual; la cuenta de la tienda se suma a Clientes
  (`syncShopAccount`) para que el dueño la encuentre.
- **8.4.22 (primera parte)** Mis tarjetas: formulario de demostración con detección de marca, Luhn, vencimiento y
  código, y "Usar tarjeta de prueba". Se guarda solo marca, últimos 4 y vencimiento; el número completo, el código y el
  titular no salen del formulario, y al cargar datos guardados se descarta cualquier otro campo. Los campos no usan el
  autocompletado de tarjetas del navegador, para que nadie cargue una real por costumbre.

## Lote 5 · registro

- **8.4.12** A la derecha del encabezado: una cápsula con las preferencias (sonido y modo oscuro), un separador y las
  acciones de la tienda (buscar, favoritos, cuenta y carrito, este último con su fondo de color). En el celular quedan
  el sonido aparte y buscar y carrito juntos; el modo oscuro sigue en el menú. Probado a 1440, 390 y 320 px.
- **8.4.13** (opción B, decisión de Ignacio) Se quitaron el aviso "Demo de venta" de arriba de la tienda y "Reiniciar
  demo" del panel, del aviso y del pie. Se mantienen la señal del panel ("Panel de demostración · datos ficticios",
  porque el panel no tiene login) y los avisos del checkout de que no se cobra nada. Para volver a los datos de muestra:
  ventana privada o borrar los datos del sitio. Esto deja sin efecto la regla "el aviso de demo ficticia permanece"
  para la tienda (registrado en `fuera-de-especificacion.md`).

## Lote 6 · registro

- **8.4.15** Al cerrar un día con entregas desde el modal del día ("Cerrar el taller este día" → "Cerrar igual"), el
  mismo modal pregunta "¿Querés transferir los pedidos de este día a otro?". Propone los próximos 5 días con taller (sin
  domingos, feriados ni cierres) con cuántos pedidos tienen, y deja elegir cualquier otra fecha; todos al mismo día o
  uno por pedido. Avisa si el día elegido ya tiene pedidos, si se pasa de la capacidad ("Transferir igual") o si queda
  antes del plazo de fabricación, y no deja elegir un día pasado o sin taller. Usa las mismas reglas que reprogramar un
  pedido (`checkReschedule`). "Dejarlos para después" deja las entregas marcadas en el día cerrado, como antes. El cierre
  desde "Capacidad y feriados" sigue igual (avisa y las deja marcadas para reprogramar).
- **8.4.17** En cada tarjeta de la cola, el paso siguiente (botón principal) y "Mover etapa" tienen el mismo alto (40 px)
  y van de borde a borde: lado a lado si la tarjeta es ancha, uno arriba del otro (el principal primero) si es angosta.
- **Bug encontrado en el chequeo completo**: al abrir un modal, el foco iba a su primer campo 40 ms después; si en ese
  momento ya se estaba escribiendo en otro campo, el foco saltaba y lo escrito terminaba en el primero (en la prueba de
  Mis direcciones, "2600" quedó en el nombre). `Sheet` ya no mueve el foco si ya está adentro del modal.

## Lote 7 · registro

- **8.4.18** Los valores del taller (hora de máquina, hora a mano y margen objetivo) van en una fila, con etiquetas de
  una línea y la unidad aparte ("$/h", "%"), así los tres campos quedan a la misma altura. El margen promedio y "Para
  revisar" pasan a ser indicadores (sin campos). Debajo, "Cómo se calcula y para qué sirve": qué es el costo, la
  ganancia y el margen (con un ejemplo), el precio sugerido (se recalcula con el margen objetivo) y "Para revisar".
- **8.4.23** Nuevo dibujo del comedero: un perro de globos rosa brillante (cuatro patas, cola, cuello, cabeza con hocico
  y orejas, nudos) con el plato con alimento sobre el lomo, como el producto real. El nombre va en relieve sobre el
  plato. Una zona de texto guardada igual a la vieja se reemplaza por la nueva; si el dueño la había movido, se respeta.
- **8.4.24** Arrepentimiento en tablet y escritorio: formulario ancho a la izquierda (dos columnas cuando hay lugar) y a
  la derecha "Cómo funciona" en tres pasos más el plazo de 10 días corridos, con enlaces a términos y preguntas. En el
  celular, uno debajo del otro.
