# Rutas y flujo de la demo

| Ruta | Qué muestra |
|---|---|
| `/` | Carrusel (sin autoplay), categorías destacadas + "Buscar más cosas", CTA crear, más vendidos, novedades, misiones |
| `/buscar/?q=` | Búsqueda en vivo tolerante a acentos y errores ("comedro" → comederos), sugerencias si no hay resultados |
| `/categorias/` | Categorías con productos (las vacías no aparecen: "Tablas de madera") |
| `/c/[slug]/` | Grilla con orden (relevancia, precio, nuevos), recordado en localStorage |
| `/p/[slug]/` | Galería, color/tamaño, stock / a pedido / sin stock, plazo, precio sin impuestos nacionales, FAQ |
| `/crear/` y `/crear/[slug]/` | Personalizador: texto/fuente/color (SVG en vivo), foto con encuadre y zoom (Konva), foto de referencia + notas. Aprobación "Así lo quiero" obligatoria |
| `/carrito/` | Ítems con la vista previa aprobada, cantidades, cupón, misión ilustrativa, envío gratis |
| `/checkout/` | Datos (invitado o cuenta demo) → entrega (retiro, cadete MdP por CP, nacional) → pago (Mercado Pago, transferencia, QR) → términos |
| `/checkout/confirmacion/` | "Pedido de demostración", instrucciones de pago de muestra, comprobante local |
| `/pedido/demo-velmar/` | Seguimiento con token fijo y estados de muestra |
| `/cuenta/` | Cuenta demo: pedidos, misiones, premios (un uso), direcciones |
| `/preguntas/`, `/terminos/`, `/privacidad/`, `/arrepentimiento/` | Ayuda y legales (textos de muestra) |

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
Solo `localStorage` del navegador (`velmar-demo:cart`, `:checkout`, `:account`) y `sessionStorage` para no repetir el
splash. Las fotos se procesan con `URL.createObjectURL`/canvas; al carrito llega una miniatura JPEG generada en el
navegador. "Reiniciar demo" (banner y pie) borra todo.
