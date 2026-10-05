# Tono visual (PROVISIONAL)

No hay paleta ni tipografía confirmadas por Velmar. Lo siguiente se derivó del logo descrito (dos chevrones verde
oliva sobre blanco) y de sus fotos (madera clara, plantas, estética hogareña). **No es la identidad final.**

| Token | Valor | Uso |
|---|---|---|
| `--brand-primary` | `#3a4527` verde oliva profundo | Botones, links, foco (10,2:1 sobre blanco; 9,1:1 sobre el fondo) |
| `--brand-primary-hover` | `#283019` | Hover |
| `--brand-accent` | `#ece2cf` | Fondos suaves, chips |
| `--brand-wood` | `#b98b5c` madera | Decoración (no texto) |
| `--brand-background` / `--brand-surface` | `#f6f1e8` / `#fffdf8` | Fondo papel y tarjetas |
| `--brand-text` / `--brand-muted` | `#1c2016` / `#5d6050` | Texto: 14,7:1 y 5,7:1 sobre el fondo (AA) |
| `night` / `night-2` | `#1c2016` / variante | Bandas oscuras (hero del seguimiento, club, pie, menú del panel) |
| `brass` / `brass-ink` | `#d2ad69` / `#7a5c26` | Detalle dorado: `brass` solo sobre `night` (7,8:1); `brass-ink` como texto sobre fondo claro (5,5:1) |
| `--brand-display` | Fraunces (variable, opsz, self-hosted) | Titulares (`font-display`) |
| `--brand-font` | Manrope (variable, self-hosted) | Texto de UI; Caveat solo como fuente "Manuscrita" del personalizador |

- Se definen en `src/config/brand.ts` → variables CSS en `<html>` → tokens `@theme` de Tailwind (`app/globals.css`).
  En producción vienen de la tabla `Setting` y se cambian sin deploy.
- Imágenes: no hay fotos reales de Velmar en el repo. Se usan ilustraciones vectoriales propias, rotuladas
  "Imagen ilustrativa". Reemplazarlas por fotos reales cuando Velmar las entregue.

## Modo oscuro (05/10)
- Claro / oscuro con el botón de sol/luna (header, menú móvil y barra del panel). La primera vez sigue al sistema; la
  elección se guarda en `velmar-theme`. Un script en `<head>` pone `data-theme` antes de pintar (sin destello).
- Tokens oscuros en `app/globals.css` (`html[data-theme="dark"]`): fondo `#121510`, superficie `#1b1f17`, texto `#ece6d8`
  (14,8:1), secundario `#a9a591` (≥ 5,8:1), primario salvia `#c5d19e` con texto `#151910`, dorado de texto `#d9b878`.
  Todos AA. Las bandas "noche" pasan a un negro más profundo con filo dorado sutil.
- Los colores de marca editados en el panel aplican al modo claro; el oscuro usa su propia paleta.

## Temáticas (05/10, pedido de Ignacio, fuera de la especificación)
- Cada fecha comercial tiene su "piel" fija en `src/features/themes/skins.ts`: degradado oscuro o saturado con texto claro
  (AA en modo claro y oscuro), un color de acento para el cupón y el botón, un sombrero para el logo y cinco decoraciones.
- Decoraciones: SVG propios en `src/components/illustrations/seasonal/` (sombrero de bruja, calabaza, murciélago, fantasma,
  gorro y árbol de Navidad, adorno, regalo, copo, copas, fuegos, gorro de fiesta, trébol, sombrero de duende, olla de oro,
  corazón, carta, huevo, orejas de conejo, tulipán, patita, hueso, llama, etiqueta, bolsa, corbata, bigote, sombrero, mate,
  globo y barrilete). Sin imágenes externas.
- Dónde aparece: cinta debajo de la barra de demo, sombrero sobre el logo, **primera diapositiva del carrusel** y riel
  "Ofertas de …" con el precio con cupón (calculado en `src/demo/engine/themes.ts`). Entradas de una sola vez, sin
  animaciones permanentes; con "reducir movimiento" aparecen quietas.
- "Probar temáticas" (botón flotante a la izquierda; WhatsApp queda a la derecha) cambia solo la vista de ese navegador.
  Incluye **Automática** (la del cliente) y **Original** (Velmar sin temática). Elegir recarga la página a propósito:
  vuelve a salir la pantalla de carga, ahora de temporada.
- **Paleta de temporada** (`src/features/themes/palettes.ts`): cada temática pisa los tokens de marca en claro y oscuro con
  `html[data-season]`. El contraste AA de cada par se prueba en `tests/unit/palettes.test.ts`. El panel no cambia.
- **Pantalla de carga de temporada**: el script del `<head>` (`seasonScript.ts`) decide la temática antes de pintar y
  marca `data-season`; el fondo toma los colores de la festividad y `ThemeSplashScene` suma la escena: Papá Noel con su
  trineo cruzando la luna y arbolitos (Navidad), luna naranja, bruja en escoba, niebla y calabazas que brillan
  (Halloween), fuegos artificiales y copas (Año Nuevo); el resto, sus decoraciones en órbita. Más el fondo animado.
- **Fondos animados** (`ambient.ts`, `AmbientField`): nieve, murciélagos, papelitos, corazones, tréboles, chispas, globos…
  detrás del contenido, en el banner y en el splash. Solo `transform`/`opacity` y unidades del contenedor.
  **Excepción a "sin animaciones permanentes"** pedida por Ignacio: con "reducir movimiento" no se muestran y la cinta
  tiene un botón para pausarlas (se recuerda en el navegador).
- **Guirnalda** bajo el header: luces que titilan (Navidad, Año Nuevo, Halloween, Black Friday, Hot Sale) o banderines.

## Controles de formulario
Todos son **nativos** (`select`, `input type="date"`, `number`, `color`, `range`, `checkbox`, `radio`, `file`): el
navegador abre su propia lista, calendario o rueda (accesible y familiar en el celular), con la estética de la tienda:
mismos radios, bordes, foco y chevron, `accent-color` de marca y `color-scheme` claro/oscuro para que los selectores
del sistema sigan el tema. La cantidad de la ficha también es un `select` nativo ("Cantidad: 1 unidad ⌄").
Fechas: siempre con `DateInput`. En Safari de iPhone/iPad el `date` nativo ignora el alto, se desborda y vacío no
muestra nada; ahí se le quita la apariencia del sistema, se dibuja el ícono de calendario y se muestra "dd/mm/aaaa".

## Motion
- Librería: `motion` (`motion/react`), envuelta en `MotionRoot` con `reducedMotion="user"`. Se eligió porque da
  transiciones con resorte, `layoutId` (selector de variantes, pestañas) y `AnimatePresence` (galería, drawer, ruleta)
  sin escribir física a mano. Lo crítico para la primera impresión (splash, hero, entrada de página) es **CSS puro**:
  se ve sin JS y no depende del bundle.
- Pantalla de carga (HTML+CSS, pedida por Ignacio el 05/10): aparece en **cada recarga** y dura **5 s**. Fondo noche con
  halo dorado, los chevrones se trazan, "Velmar" se revela con un barrido, cinco piezas del taller entran en órbita una
  por una y un telón la retira. Sin barra de carga ni botón "Saltar" (lo pidió Ignacio): Escape la cierra antes;
  sin JS se va sola. No reaparece al navegar dentro del sitio.
- Tienda: header con vidrio que se compacta al hacer scroll, aparición escalonada al entrar en pantalla (`Reveal`),
  contadores, tarjetas con segunda vista al hover y "agregar rápido", drawer del carrito, galería con zoom por cursor,
  medidor de stock, barra de envío gratis y misión, ruleta del club con giro desacelerado, check animado en la confirmación
  y recorrido animado en el seguimiento.
- Íconos de premios propios en SVG (`RewardGlyph`: porcentaje, camión, regalo, grabado, moneda) con degradé dorado: se usan en los gajos de la ruleta y en los cupones con forma de ticket (talón con guilloché SVG y perforación).
- Confeti a pantalla completa (~3 s) la primera vez que se ve la confirmación de cada pedido.
- Sin animaciones permanentes, con dos excepciones pedidas: la pantalla de carga (5 s, se puede saltar) y el **carrusel
  del inicio, que avanza cada 4 s** (se frena al tocarlo, al pasar el mouse o con foco, y tiene botón de pausa). La
  ruleta gira 4,8 s solo cuando la persona la inicia.
- `prefers-reduced-motion: reduce` desactiva pantalla de carga, confeti y autoplay del carrusel; la ruleta salta al resultado y toda transición pasa a 1 ms. Sin audio.
