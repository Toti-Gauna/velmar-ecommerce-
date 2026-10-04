# Rutas y flujo de la demo

| Ruta | Qué muestra |
|---|---|
| `/` | Hero editorial, cómo funciona, personalizador en vivo de muestra, categorías en bento, rieles de más vendidos y novedades, banda del club, valores |
| `/buscar/?q=` | Búsqueda en vivo tolerante a acentos y errores ("comedro" → comederos), sugerencias si no hay resultados |
| `/categorias/` | Categorías con productos (las vacías no aparecen: "Tablas de madera") |
| `/c/[slug]/` | Grilla con orden (relevancia, precio, nuevos), recordado en localStorage |
| `/p/[slug]/` | Galería con zoom, color/tamaño, medidor de stock y cantidad (tope = stock), precio con transferencia, misión que suma, entrega estimada, acordeones, "Completá el set" y barra fija en el celular |
| `/crear/` y `/crear/[slug]/` | Personalizador: texto/fuente/color (SVG en vivo), foto con encuadre y zoom (Konva), foto de referencia + notas. Aprobación "Así lo quiero" obligatoria |
| `/carrito/` | Ítems con la vista previa aprobada, cantidades, barra de envío gratis, empujón de misión, recomendaciones, cupón y acceso a la ruleta. Al agregar se abre el **drawer** del carrito |
| `/checkout/` | Datos (invitado o cuenta demo) → entrega (retiro, cadete MdP por CP, nacional) → pago (Mercado Pago, transferencia, QR) → términos |
| `/checkout/confirmacion/` | "Pedido de demostración", instrucciones de pago de muestra, comprobante local |
| `/pedido/demo-velmar/` | Seguimiento con token fijo: estado actual, recorrido animado, etapas, ETA, productos, ayuda por WhatsApp y estados de muestra |
| `/club/` | Club Velmar: ruleta de cupones (un giro por navegador), camino de misiones y billetera de premios |
| `/cuenta/` | Cuenta demo: pedidos, misiones, premios (un uso), direcciones |
| `/preguntas/`, `/terminos/`, `/privacidad/`, `/arrepentimiento/` | Ayuda y legales (textos de muestra) |

## Ruleta de cupones (agregada a pedido de Ignacio, 04/10/2026)
- Fuera de la especificación original: se sumó como pedido explícito para la demo. Antes de llevarla a producción hay que
  incorporarla a la spec (límite por cliente, probabilidades, vigencia).
- 8 segmentos configurables en el panel (Cupones → Ruleta): premio, tipo, valor, mínimo y peso. El sorteo es una función
  pura (`src/demo/engine/wheel.ts`); el premio crea un cupón `RULETA…` de **un uso** con vencimiento (7 días por defecto)
  que aparece en el panel y se aplica en el carrito. En producción el sorteo y el cupón se generan en el servidor.

## Recomendaciones
`src/demo/engine/recommend.ts`: en la ficha prioriza misma categoría y complementos; en el carrito excluye lo ya agregado.
Reglas simples y deterministas, sin tracking del usuario.

## Datos de muestra
- Cupones: `BIENVENIDA10` (10%), `FERIA2000` (desde $20.000), `ENVIOGRATIS` (solo con cuenta), `INVIERNO` (vencido).
- Códigos postales con cadete: 7600–7612. Envío gratis desde $120.000. 10% off con transferencia/QR.
- Productos sin stock para demostrar el bloqueo: Comedero elevado "Nogal", Llavero NFC "Madera".
- Catálogo basado en las líneas vistas en el Instagram de Velmar, **sin productos con licencia**. Precios orientativos.

## Pagos (decisión confirmada 03/10/2026)
Checkout Pro para crédito/débito/dinero en cuenta (confirmación automática por webhook en producción);
transferencia y **QR estático** con comprobante y aprobación manual de Velmar. En la demo todo es pantalla de muestra:
no se pide tarjeta, no se redirige a Mercado Pago, el QR no es escaneable, el CBU/alias son ficticios y nunca se
afirma que un pago fue acreditado.

## Qué se guarda y dónde
Solo `localStorage` del navegador (`velmar-demo:cart`, `:checkout`, `:account`, `:admin`) y `sessionStorage` para no repetir el
splash. Las fotos se procesan con `URL.createObjectURL`/canvas; al carrito llega una miniatura JPEG generada en el
navegador. "Reiniciar demo" (banner y pie) borra todo.
