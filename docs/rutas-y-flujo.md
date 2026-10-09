# Rutas y flujo de la demo

| Ruta | Qué muestra |
|---|---|
| `/` | Inicio de tienda: carrusel de banners (editable, avanza cada 4 s con pausa), beneficios, categorías en círculos, recomendados, probador en vivo con "Quiero mi producto personalizado", más vendidos, "Productos que cuentan historias", novedades, banda del club |
| `/buscar/?q=` | Resultados completos. El ícono de búsqueda abre un **buscador superpuesto** con búsquedas recientes, lo más buscado, recomendados y resultados en vivo (tolerante a acentos y errores: "comedro" → comederos) |
| `/categorias/` | Categorías con productos (las vacías no aparecen: "Tablas de madera") |
| `/c/[slug]/` | Grilla con orden (relevancia, precio, nuevos), recordado en localStorage |
| `/p/[slug]/` | **Ficha todo en uno**: galería con "Tu diseño" (vista previa en vivo) y el **stock debajo de la imagen**; una sola tarjeta para elegir opción/color, personalizar (texto, foto o referencia) y la **cantidad** (desplegable "Cantidad: 1 unidad ⌄ (N disponibles)"). Sin casilla: **agregar al carrito equivale a "Así lo quiero"** (queda explicado en la tarjeta y se guarda `approvedAt`). Favoritos (corazón). En el celular, barra fija con corazón + "Agregar al carrito · total"; en escritorio también "Comprar ahora" |
| `/crear/` | Productos personalizables por tipo; cada uno abre su ficha. `/crear/[slug]/` se mantiene (enlaces viejos) y muestra la misma ficha todo en uno |
| `/carrito/` | Envío gratis → productos → cupón ("Elegir de mis cupones" o código) → resumen y pago; abajo, misión y recomendaciones. En el celular, barra fija con total e "Ir a pagar". Al ir a pagar aparece la **ruleta** si todavía no se giró. Al agregar desde una ficha se abre el **drawer** |
| `/checkout/` | Datos (invitado o cuenta demo) → entrega (retiro, cadete MdP por CP, nacional) → pago (Mercado Pago, transferencia, QR) → términos |
| `/checkout/confirmacion/` | "Pedido de demostración", instrucciones de pago de muestra, comprobante local |
| `/pedido/demo-velmar/` | Seguimiento con token fijo: **el pedido arriba** (en el celular 3 productos y "Ver N más" en un modal), "Falta el comprobante" debajo de los productos, estado actual con recorrido animado, estados de muestra, etapas y ayuda por WhatsApp |
| `/club/` | Club Velmar: ruleta de cupones (un giro por navegador), camino de misiones y billetera de premios |
| Barra inferior (celular) | Cápsula flotante de vidrio con Inicio, Categorías, Favoritos, Cupones y Mi cuenta. No aparece en ficha, carrito ni checkout (tienen su propia barra) |
| `/cupones/` | Mis cupones: el ganado en la ruleta y los vigentes de la tienda como tickets, con "Aplicar"; estado vencido / mínimo / solo con cuenta; cómo ganar más |
| `/favoritos/` | Pantalla de favoritos (guardados con el corazón de cada ficha, en este navegador); vacía invita a explorar la tienda. Pedido de Ignacio, fuera de la spec |
| `/cuenta/` | Cuenta demo: pedidos, misiones, premios (un uso), direcciones |
| `/preguntas/`, `/terminos/`, `/privacidad/`, `/arrepentimiento/` | Ayuda y legales (textos de muestra) |

## Agregados a pedido de Ignacio (04-05/10/2026, fuera de la spec original)
Ruleta de cupones, página y selector de "Mis cupones", buscador superpuesto con búsquedas recientes, "Comprar ahora",
historias de producto en el inicio (ilustrativas, `src/demo/fixtures/stories.ts`), paginado del panel, favoritos,
barra inferior, autoplay del carrusel, pantalla de carga de 5 s, guía del panel y confeti de compra. **Cambio a revisar en la
spec:** la aprobación "Así lo quiero" ya no es una casilla; se confirma al agregar al carrito. Antes de llevarlos a
producción hay que sumarlos a la especificación de Notion.

## Ruleta de cupones
- Fuera de la especificación original: se sumó como pedido explícito para la demo. Antes de llevarla a producción hay que
  incorporarla a la spec (límite por cliente, probabilidades, vigencia).
- 8 segmentos configurables en el panel (Cupones → Ruleta): premio, tipo, valor, mínimo y peso. Cada gajo se dibuja con un ícono SVG (porcentaje, camión, regalo, grabado, moneda) y el valor corto. El sorteo es una función
  pura (`src/demo/engine/wheel.ts`); el premio crea un cupón `RULETA…` de **un uso** con vencimiento (7 días por defecto)
  que aparece en el panel y se aplica en el carrito. En producción el sorteo y el cupón se generan en el servidor.

## Recomendaciones
`src/demo/engine/recommend.ts`: en la ficha prioriza misma categoría y complementos; en el carrito excluye lo ya agregado.
Reglas simples y deterministas, sin tracking del usuario.

## Datos de muestra
- Cupones: `BIENVENIDA10` (10%), `FERIA2000` (desde $20.000), `ENVIOGRATIS` (solo con cuenta), `INVIERNO` (vencido).
- Códigos postales con cadete: 7600–7612. Envío gratis desde $120.000. 10% off con transferencia/QR.
- Productos sin stock para demostrar el bloqueo: Comedero elevado "Nogal", Placa NFC Instagram "Madera".
- Catálogo basado en las líneas vistas en el Instagram de Velmar, **sin productos con licencia**. Precios orientativos.

## Pagos (decisión confirmada 03/10/2026)
Checkout Pro para crédito/débito/dinero en cuenta (confirmación automática por webhook en producción);
transferencia y **QR estático** con comprobante y aprobación manual de Velmar. En la demo todo es pantalla de muestra:
no se pide tarjeta, no se redirige a Mercado Pago, el QR no es escaneable, el CBU/alias son ficticios y nunca se
afirma que un pago fue acreditado.

## Qué se guarda y dónde
Solo `localStorage` del navegador (`velmar-demo:cart`, `:checkout`, `:account`, `:admin`, `:search`, `:favorites`; y
`velmar-tour:admin` para no repetir la guía del panel) y `sessionStorage` para no repetir el confeti de un pedido. Las fotos se procesan con `URL.createObjectURL`/canvas; al carrito llega una miniatura JPEG generada en el
navegador. "Reiniciar demo" (banner y pie) borra todo.
