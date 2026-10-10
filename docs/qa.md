# QA de la demo y riesgos conocidos

## Checklist (automatizado en `tests/`)
| Verificación | Cómo | Estado |
|---|---|---|
| Build limpio (lint, tipos, unit, export) | `pages.yml` / `npm run check && npm run build` | ✅ |
| Rutas directas y refresh bajo subpath, 16 rutas | `tests/e2e/routes.spec.ts` con servidor que imita Pages | ✅ |
| Sin barra final → 301; ruta inexistente → 404 | idem | ✅ |
| Assets, sitemap y `og.png` (image/png) bajo basePath | idem | ✅ |
| Sin scroll horizontal a 375 px en todas las rutas | idem | ✅ |
| Viewports 375 / 768 / 1440 (capturas en `test-results/`) | `motion-viewports.spec.ts` | ✅ |
| Flujo móvil completo: búsqueda con error → ficha → texto (rechaza emoji) → aprobar → carrito → cupón vencido/válido → checkout invitado → cadete por CP → transferencia → términos obligatorios → confirmación demo → comprobante → seguimiento → reiniciar | `purchase-flow.spec.ts` | ✅ |
| Cuenta demo + retiro + Mercado Pago simulado + misión completada con celebración | idem | ✅ |
| Foto: PDF falso y 11 MB rechazados; encuadre/zoom; vista previa JPEG local; llega al carrito | `personalize-photo.spec.ts` | ✅ |
| **La foto no sale del navegador**: ningún request no-GET/HEAD ni a otro origen en todo el flujo | `guardNetwork()` en los e2e | ✅ |
| Ningún CTA aparenta cobrar: rótulos "demo/muestra", QR no escaneable, CBU ficticio, sin "acreditado" | asserts en e2e + revisión | ✅ |
| Movimiento reducido: sin splash, animaciones a 1 ms | `motion-viewports.spec.ts` | ✅ |
| Pantalla de carga en cada recarga, Escape la cierra y se va sola a los 5 s | idem | ✅ |
| Contraste AA de los tokens | cálculo WCAG (ver `tono-visual.md`) | ✅ |
| Reglas: precio, cupones, envío gratis, total ≥ 0, misiones, stock, validaciones, recomendaciones, ruleta | `tests/unit` (Vitest) | ✅ |
| Ruleta con movimiento reducido → cupón `RULETA…` → se aplica en el carrito → aparece en el panel | `gamification.spec.ts` | ✅ |
| Ficha todo en uno: "Comprar ahora" sin texto lleva el foco al campo; con aprobación va al checkout con la cantidad elegida | idem | ✅ |
| Carrito: elegir cupón de "Mis cupones" sin escribir el código; ruleta al ir a pagar con "Guardar para más tarde"; ya girada va directo | idem | ✅ |
| Buscador superpuesto: foco en el campo, resultados en vivo con error de tipeo, búsqueda reciente, Escape cierra | idem | ✅ |
| Seguimiento: pedido arriba, "Ver 1 producto más" abre el modal, comprobante al elegir el estado pendiente | idem | ✅ |
| Panel en el celular: menú hamburguesa y paginado de pedidos (se reinicia al filtrar) | `admin-flows.spec.ts` | ✅ |
| Guía del panel: aparece una vez, Siguiente / Anterior, no reaparece, se reabre con "?" | idem | ✅ |
| Ficha: cantidad desplegable, diseño requerido antes de agregar, favoritos en su pantalla `/favoritos/` | `gamification.spec.ts` | ✅ |
| Barra inferior de la tienda (Inicio, Categorías, Favoritos, Cupones, Mi cuenta) y botón de pausa del carrusel | idem | ✅ |
| Temáticas: "Probar temáticas" cambia cinta, sombrero del logo, primera diapositiva y ofertas; "Usar código" lo deja en el carrito; se recuerda al recargar y se sale desde la cinta | `themes.spec.ts`, `tests/unit/themes.test.ts` | ✅ |
| Temáticas premium: paleta de temporada en `data-season`, pausa de animaciones, opción "Original" | `themes.spec.ts`, `tests/unit/palettes.test.ts` (AA de las 13 paletas en claro y oscuro) | ✅ |
| Temáticas en el panel: editar titular, modo fija/ninguna y ocultar el botón se refleja en la tienda | idem | ✅ |
| Modo oscuro: se activa desde el menú, se recuerda al recargar y llega al panel | idem | ✅ |
| Menú móvil y drawer del carrito: abren, atrapan el foco y cierran con Escape | idem | ✅ |
| Sin desborde a 375 px con el carrito lleno (recomendaciones desplazables) | idem | ✅ |

## Tienda · Fase 4 (`tests/e2e/shop-fase4.spec.ts`, `tests/unit/collar.test.ts`)
| Verificación | Estado |
|---|---|
| Collar: letras sueltas una por pieza, de corrido en una, cordón, material y talle por cuello cambian vista previa y precio; fuera de talle avisa; la configuración llega al carrito | ✅ |
| Combinación lista carga nombre, cordón y vista previa | ✅ |
| Ruleta arrastrada con el mouse/dedo da premio con clic de gajos, giro y fanfarria; también con Enter | ✅ |
| Sonidos al agregar y en favoritos; silencio recordado al recargar | ✅ |
| Recargos del collar en pesos enteros, talle por cm, descripción, piezas y combinaciones válidas | ✅ unit |

## Temáticas y motion · Fase 5 (`tests/e2e/shop-fase5.spec.ts`, `tests/unit/themes.test.ts`, `tests/unit/palettes.test.ts`)
| Verificación | Estado |
|---|---|
| Orgullo, 25 de Mayo, Día de la Bandera y 9 de Julio: pantalla de carga con su escena, paleta, banner y cinta | ✅ |
| Día del Amigo y del Padre: los personajes aparecen en la escena y en el banner | ✅ |
| Con movimiento reducido no queda ninguna animación CSS corriendo (personajes, fondo, partículas) | ✅ |
| Navegar usa View Transitions y solo la tarjeta tocada lleva el nombre de la imagen que vuela a la ficha | ✅ |
| La cantidad rueda sin duplicar el número (lector de pantalla y tests leen un solo valor); favoritos destella | ✅ |
| Contraste AA de las paletas nuevas en claro y oscuro (texto, apagado, primario, dorado, acento) | ✅ unit |
| Fechas: Orgullo el 7/11, 25 de Mayo, Padre hasta el 17/6, Bandera el 20/6, 9 de Julio; ninguna superposición en el año | ✅ unit |

**Rendimiento medido** (Chromium sin GPU, Pixel 7 emulado a 390 px, después de las optimizaciones): sin frenar la CPU, la
tienda Original va a 52–53 cuadros por segundo y las temáticas nuevas a 39–50 (la del 9 de Julio pasó de 28 a 45 al sacar
los fuegos del fondo). Con la CPU frenada 4× todo cae a 10–25, también la tienda sin temática: el dibujo por software de
este entorno no representa a un iPhone, que compone `transform` y `opacity` en la GPU. **Falta la prueba en un iPhone real**
(Safari, 60 fps y sin saltos): pantalla de carga de cada temática nueva, scroll del inicio con temática y tocar una tarjeta.

## Estudio de contenido · Fase 6 (`tests/e2e/admin-studio.spec.ts`, `tests/unit/studio.test.ts`)
| Verificación | Estado |
|---|---|
| Elegir la fecha muestra post, historia y carrusel con los textos, 3 productos y el cupón de la temática; cambiar de fecha los reemplaza | ✅ |
| El texto sugerido trae el gancho del producto, la oferta, una palabra para comentar y el hashtag de la fecha; "Otra idea" cambia el gancho | ✅ |
| PNG del post con el titular editado y una foto propia (archivo PNG válido) | ✅ |
| Carrusel: una imagen por diapositiva (6 con 3 productos) | ✅ |
| Video de la historia de 6 s con música (MP4 o WebM según el navegador) | ✅ |
| Precio y precio con cupón del engine en pesos enteros; ganchos por producto; duración 6–15 s; formato de video y nombres de archivo | ✅ unit |

**Video**: se graba en tiempo real con `MediaRecorder` desde el canvas a 1080 × 1080 o 1080 × 1920. Para que cada cuadro
sea liviano, ilustraciones, tarjetas con sombra, fondo, auroras y sello se pasan a mapa de bits una sola vez y la vista
previa se pausa mientras graba. En el Chromium de pruebas (sin GPU) el post graba a ~19 cuadros por segundo y la historia a
~12; en un navegador con GPU (Chrome o Safari en el teléfono) se espera más. **Falta probar en Safari de iPhone** que el
video salga en MP4 (H.264) y que "Compartir" guarde en Fotos.

## QA cruzado · Fase 7 (`tests/e2e/cross-device.spec.ts`)
| Verificación | Estado |
|---|---|
| Las 20 rutas de la tienda y las 22 del panel abren en iPhone SE (375), iPhone 15 (393), Android (412) y escritorio (1440) sin error de página ni de consola, con su título, sin scroll horizontal, sin «acreditado» y con la señal de demo en el panel | ✅ |
| Con «reducir movimiento» activado la portada no falla al hidratar (el botón del carrusel mostraba otro ícono en el servidor y en el cliente) | ✅ corregido |

Es emulación en Chromium: **no reemplaza** la prueba en un iPhone y un Android reales. Checklist y registro en
`docs/qa-dispositivos.md`.

## Regalos, ruleta y rendimiento · Fase 8 (`tests/e2e/gifts.spec.ts`, `shop-fase4.spec.ts`, `gamification.spec.ts`, `tests/unit/gifts.test.ts`)
| Verificación | Estado |
|---|---|
| Regalar desde la ficha: sin "para quién" no sigue y lleva el foco; la ocasión dice cómo se abre; el carrito marca "Regalo para…" | ✅ |
| Al confirmar: código `REGALO-XXXX-XXXX`, WhatsApp con el código y el link, "Ver cómo lo recibe" | ✅ |
| Otro navegador abre el link: escenario oscuro, "Golpeá el regalo para abrirlo", cinco golpes, producto y mensaje **sin precio**, guardar en mis regalos, sin scroll horizontal | ✅ |
| Cuenta demo: el regalo de muestra aparece sin abrir, se abre ("Abrirlo de una vez" con movimiento reducido) y queda "Abierto" | ✅ |
| Código escrito a mano (minúsculas, sin guiones) abre; uno inventado avisa; un link cortado o editado no abre nada | ✅ |
| Código con dígito verificador, link sin email ni precio, límites de texto, regalos por cuenta y por pedido | ✅ unit |
| Ruleta a pantalla completa: el disco entra entero en la pantalla, el fondo no scrollea, gira con el centro, con toque, arrastre o teclado; al ganar, cupón de la festividad con "Aplicar ahora", "Guardar para después" y "Salir" a la vista | ✅ |
| Las 17 escenas de regalo: cada golpe deja huella, la apertura termina y el estado final queda armado (capturas golpe a golpe y con movimiento reducido) | ✅ revisión visual |

**Rendimiento medido** (Chromium sin GPU, Pixel 7 emulado a 390 px, CPU frenada 4×, promedio de 2 cargas; antes → después):

| Página | Bloqueo del hilo (TBT) | Tarea más larga | Nodos | Scroll |
|---|---|---|---|---|
| Inicio (Original) | 3474 → 1727 ms | 624 → 450 ms | 3243 → 2588 | 54 → 60 fps, saltos 2% → 0% |
| Ficha del collar | 2424 → 1888 ms | 487 → 417 ms | 1544 → 1428 | 22 → 36 fps, saltos 52% → 15% |
| Inicio (Navidad) | 2901 → 2350 ms | 569 → 398 ms | 4002 → 3228 | sin frenar la CPU: 53–56 fps (en la Fase 5, 39–50) |

JavaScript del inicio: 341 → 322 KB comprimido y HTML 449 → 398 KB, con regalos y ruleta nueva incluidos. Con la CPU
frenada, el scroll de las temáticas varía mucho entre corridas (lo domina el dibujo por software de este entorno); la
prueba que vale es la del teléfono real (`docs/qa-dispositivos.md`).

## Pantallas de carga · Polish 8.1 (`tests/e2e/splash-polish.spec.ts`, `motion-viewports.spec.ts`, `shop-fase5.spec.ts`)
| Verificación | Estado |
|---|---|
| Original: un solo aro, concéntrico con la pantalla y con el logo (±2 px), y las cinco piezas montadas sobre él (±3 px) | ✅ |
| Mientras se ve el splash el lienzo es oscuro (no asoma la tienda clara en el primer cuadro) y vuelve a la normalidad al cerrarse | ✅ |
| Día de la Madre: 20 pétalos; las esquinas del logo quedan dentro de la ronda de estambres (ningún pétalo lo pisa) | ✅ |
| San Valentín: Lola y Pancho en la cena; corazón y cena centrados, el logo dentro del corazón y arriba de la cena, todo dentro de la pantalla | ✅ |
| Con «reducir movimiento» no hay splash ni animaciones corriendo | ✅ |
| Cuadro a cuadro en 390 × 844, 820 × 1180, 1440 × 900 y 844 × 390; video en tiempo real (el logo y el aro se animan aunque la página esté cargando) y cuadros reales del compositor alrededor del telón (sin cuadros oscuros sueltos) | ✅ revisión visual |

Qué se hizo:
- Las escenas de la pantalla de carga (16 temáticas) se descargan de a una: solo la de la fecha.
- La ruleta, los cupones y el buscador se descargan al abrirlos (el carrito no: es lo que más se abre y tiene que responder al instante).
- Las escenas de regalo, de a una, al abrir un regalo.
- La segunda vista de cada tarjeta (al pasar el mouse) se dibuja recién cuando entra el mouse: en el celular era un SVG
  entero de más por tarjeta.
- Las secciones de más abajo del inicio, las recomendaciones de la ficha y el pie usan `content-visibility: auto`.
- Las letras del collar se balancean tres veces y quedan quietas (un balanceo sin fin redibujaba el SVG en cada cuadro).
- Se probó pausar el fondo de la temática durante el scroll: no mejoró nada medible y se descartó.

## Panel demo (`tests/e2e/admin-*.spec.ts`, `tests/unit/admin*.test.ts`)
| Verificación | Estado |
|---|---|
| 16 rutas del panel abren directo y al refrescar bajo subpath, con la señal de demo y sin "acreditado" | ✅ |
| Sin desborde horizontal a 375 px (el chequeo compara contra el ancho del viewport configurado) | ✅ |
| Cambiar stock a 0 → la ficha muestra "Sin stock" y bloquea el agregado; pausar productos oculta la categoría vacía | ✅ |
| Aprobar comprobante pide confirmación y deja auditoría; rechazar exige motivo; nada dice "pago acreditado" | ✅ |
| Comprobante subido en la tienda → "Comprobante en revisión" en el panel, nunca "Pagado" | ✅ |
| Cupón creado en el panel funciona en el carrito; misión creada aparece en la cuenta demo | ✅ |
| Reiniciar demo vuelve a los fixtures | ✅ |
| Teclado: diálogo de confirmación abre con Enter, cierra con Escape, se opera con Tab | ✅ |
| Movimiento reducido en el panel | ✅ |
| Transiciones de pedido válidas/ inválidas (spec 5.2) y acciones del store | ✅ unit |
| Importar Excel: columnas con otros nombres se reconocen, vista previa marca errores (centavos), importa, la categoría nueva abre en la tienda y se deshace con aviso | ✅ |
| Importar CSV con `;` y montos con `$` actualiza precio y stock | ✅ |
| Pedidos: pestañas por etapa, cambio de estado en lote (solo transiciones válidas), vista rápida y exportar `.xlsx` | ✅ |
| Stock: sumar en la tabla se refleja en la ficha de la tienda | ✅ |
| ⌘K / Ctrl+K abre un pedido por código | ✅ |
| Planilla (escritorio): validar al escribir, pegar celdas de Excel, Ctrl+Z / Ctrl+Y, guardar y ver en la tienda | ✅ |
| Lectura de celdas (montos, stock, sí/no, CSV), mapeo de columnas, plan de importación, orden, búsqueda, stock en lote, clientes y TSV | ✅ unit |
| 21 rutas del panel (con calendario, producción, costos, insumos y ficha de cliente) abren directo y al refrescar | ✅ |
| Calendario (escritorio): arrastrar un pedido a un feriado no se aplica; a un día hábil sí; a un día completo avisa "sobrecargado"; el .ics se descarga | ✅ |
| Reprogramar sin arrastrar (agenda → ficha de entrega → primera fecha libre) saca al pedido de atrasados | ✅ |
| Capacidad: con 8 y 9/10 completos y el 12/10 feriado, la placa NFC muestra el 13/10; con capacidad 4, el 8/10 | ✅ |
| Cola de producción: pasar a máquina descuenta insumos (cera 5000 → 3920 g), terminación → Listo | ✅ |
| Costos: margen de la receta y "Usar precio sugerido" cambia el precio en la tienda | ✅ |
| Ficha de cliente: mascota con cumpleaños crea recordatorio; notas persisten al recargar | ✅ |
| Días hábiles y feriados, plazos por variante/producto, capacidad, reprogramación, costos en pesos enteros, insumos comprometidos, tablero, recordatorios, .ics | ✅ unit |
| Compra en la tienda → "Gracias por tu compra" y "Recibimos tu diseño" en la bandeja, con productos y personalización | ✅ |
| Pasar a producción manda su email; una plantilla pausada no sale | ✅ |
| Editor (escritorio): insertar ficha con un toque, vista previa con datos reales sin llaves, guardar, recargar y enviar prueba | ✅ |
| Cumpleaños de mascota: "Enviar email" desde los recordatorios de Clientes | ✅ |
| Fichas resueltas, montos y fechas, datos faltantes con texto natural, bloques sin pedido omitidos, disparadores, pausa, límite de la bandeja, prueba, restaurar | ✅ unit |

Nota: con emulación móvil, Chrome agranda el viewport de layout si algo desborda. El chequeo anterior
(`scrollWidth - innerWidth`) podía dar falso negativo; ahora se compara contra el ancho configurado.
Los e2e corren con `reducedMotion: "reduce"` por defecto (sin pantalla de carga ni autoplay) y con la guía del panel
marcada como vista; los tests de pantalla de carga y de guía lo cambian explícitamente.

Reglas aprendidas (05/10):
- Con "reducir movimiento", un `motion.span` con `layoutId` dentro de un `Sheet` trababa la animación de salida y el menú
  del panel no se cerraba. El indicador de sección activa ahora es un `span` común.
- Los `fieldset` tienen `min-width: min-content`: en grilla, usar `min-w-0` y `grid-cols-[minmax(0,1fr)]`.
- iOS (Safari 26): `viewport-fit=cover` + rellenos `env(safe-area-inset-*)`; una franja fija tapa la barra de estado y
  las barras inferiores llegan al borde real de la pantalla.
- iOS 26 (09/10): Safari no dibuja nada `fixed` por detrás de su barra de direcciones (bug reportado a Apple), así que una
  barra pegada al borde deja ver la página debajo. Las barras de compra (ficha, carrito) y las pestañas del panel son
  cápsulas flotantes (`FLOATING_BAR` en `bottomBars.ts`), como la navegación inferior de la tienda.
- Los carriles horizontales usan `overflow-y-hidden overscroll-x-contain` y aparición sin desplazamiento vertical.

Reglas aprendidas en la ronda anterior:
- Los modales (`Sheet`) se montan en `<body>` por portal: el header usa `backdrop-filter`, que convierte al ancestro en
  contenedor de los `position: fixed` y dejaba el menú móvil recortado al alto del header.
- `onClose` llega como función nueva en cada render; el efecto de foco del `Sheet` depende solo de `open` (si no, cada
  tecla devolvía el foco al botón que abrió el modal).
- La animación de entrada de página usa `animation-fill-mode: backwards`: con `both` quedaba un `transform` aplicado y las
  barras fijas de compra no se pegaban al fondo de la pantalla.

Regla aprendida antes: toda grilla que contenga un carril desplazable usa `grid-cols-[minmax(0,1fr)]` de base; sin eso
el carril estira la columna y desborda solo en el celular (lo detectó el test de carrito lleno).

## Revisión manual sugerida antes de mostrar
- Recorrer en un celular real (iOS Safari y Android Chrome), en especial arrastrar la foto en el velador.
- Lector de pantalla (VoiceOver/TalkBack) en personalizador y checkout.

## Riesgos conocidos
- **Pages no habilitado**: si Settings → Pages no está en "GitHub Actions", `configure-pages` falla con un mensaje claro. No se habilita desde el workflow.
- **Ambiente `github-pages`**: solo permite deploy desde `main`. La demo se publica cuando esta rama se mergea a `main` (o al correr el workflow a mano desde `main`).
- **Contenido no confirmado**: precios, stock, plazos, zonas de envío, textos legales, datos del vendedor, número de WhatsApp (el CTA abre WhatsApp sin destinatario) y paleta son de muestra.
- **Imágenes**: ilustraciones propias rotuladas; faltan fotos reales del cliente.
- **Personalizador de foto**: la máscara del velador es genérica; la real sale de la plantilla de cada producto.
- **localStorage**: en modo privado o con cuota llena la demo sigue funcionando en memoria, pero no recuerda entre recargas.
- **`npm audit`**: 5 avisos *high* en `braces` vía `eslint-config-next` (solo herramienta de lint en desarrollo; no llega al sitio publicado). El "fix" propuesto baja a `eslint-config-next@14` y rompe Next 16; se deja hasta que Next publique la actualización.
- **Ruleta**: el "un giro por navegador" vive en localStorage; borrarlo permite volver a girar. Es aceptable en la demo; en producción el límite es por cuenta y lo valida el servidor.
- **Peso del bundle**: `motion` agrega JavaScript a la tienda; se carga en la tienda, no bloquea el splash ni el primer render (CSS).
- **Accesibilidad**: no hay auditoría automática con axe todavía (se evitó sumar dependencia); revisión manual recomendada.
- El prefetch del router de Next hace `HEAD` al mismo origen; es lectura y no envía datos.
- **Panel demo abierto**: cualquiera con el link puede abrirlo y "editar" su propia copia local. No hay datos reales ni persistencia compartida; no es un panel seguro.
- **Temáticas**: fechas aproximadas (las móviles, como Pascuas o Día de la Madre, hay que ajustarlas cada año en el panel). El cupón de una temática se puede escribir a mano fuera de temporada; en producción el servidor validaría la vigencia.
- **Excel**: se lee y escribe en el navegador con `read-excel-file` y `write-excel-file` (MIT, carga bajo demanda). El CDN de SheetJS está bloqueado desde la sesión de desarrollo. Fórmulas y formatos de celda de la planilla del cliente no se leen: entra el valor calculado.
- **Deshacer importación**: vuelve al catálogo previo a la importación; lo cambiado después también se revierte (se avisa antes de confirmar).
- **Feriados**: 2026 según Ley 27.399 y Resolución 164/2025; 2027 sin los días turísticos (se decretan cada año). Se pueden agregar o quitar en "Capacidad y feriados". Verificar contra el calendario oficial antes de producción.
- **Arrastrar en el celular**: el arrastre es de escritorio (HTML5); en el celular se reprograma desde la ficha de entrega o con los botones del tablero.
- **Sonidos**: el primer sonido llega recién después del primer toque (regla de los navegadores). Las pruebas
  verifican qué sonido se pidió (`window.__velmarSounds`), no el audio. Probar en el iPhone que el silencio del
  sistema y el botón de la tienda se respetan.
- **Collar**: vista previa ilustrativa (SVG), no un render 3D; materiales y recargos de muestra.
- **Regalos (demo)**: el link lleva el regalo adentro (cualquiera con el link lo ve; no lleva email ni precio) y el código
  solo se resuelve en el navegador donde se compró o en la cuenta demo. En producción ambos son una clave al azar
  guardada en el servidor, que también manda el email y controla el canje.
- **Estudio de contenido**: la grabación usa el reloj real; si se cambia de pestaña, el navegador pausa la animación, así
  que la grabación se cancela con un aviso y se vuelve a grabar. La vista previa se reproduce una vez y queda en el cuadro
  final ("Ver animación" la repite). En el post y la historia, si el cupón tiene mínimo, la condición va debajo del sello.
  Los fondos se guardan solo para la temática actual (Safari de iPhone limita la memoria de canvas). El Chromium de pruebas (sin códecs propietarios) graba VP9 aunque el archivo
  diga .mp4; Chrome y Safari reales graban H.264, que es lo que acepta Instagram. Las ilustraciones son de muestra: con
  fotos reales del producto (cargadas en el panel o subidas en el estudio) las piezas rinden más.
- **Temáticas de la Fase 5**: la fecha de la Marcha del Orgullo se confirma cada año (2026: sábado 7 de noviembre). Las
  escenas de la pantalla de carga empiezan cuando hidrata la página; si el teléfono tarda más de 2,6 s, la escena arranca
  por la mitad para llegar a su final antes del telón. Las transiciones entre páginas usan View Transitions: en navegadores
  sin soporte la página entra con el fundido de antes, y el gesto de "atrás" del navegador no anima la imagen del producto.
- **Ruleta en el celular**: el disco deja pasar el scroll vertical (`pan-y`); el giro se toma del arrastre
  lateral o del toque. El premio se guarda al empezar el giro (cerrar la ruleta a mitad no da otro giro).
- **Emails**: no sale ninguno. La bandeja guarda hasta 60 en este navegador. El editor de fichas usa `contentEditable`; en producción el HTML lo arma React Email (con tablas y estilos en línea para clientes de correo).
- **Capacidad**: se mide en pedidos por día, no en horas de máquina; un pedido grande ocupa lo mismo que uno chico.
- **Datos del panel por navegador**: lo que Velmar cambie en su celular no lo ve otra persona; cada navegador arranca de los fixtures.
