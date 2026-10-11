# Polish 8.4 · Checklist de QA para probar en los equipos

Todo lo que se arregló en el Polish 8.4 (ítems 8.4.1 a 8.4.28 y los bugs que aparecieron en el camino), para probar en
los equipos reales. Acá solo se pudo probar en Chromium emulando cada tamaño: **lo marcado con 📱 hay que confirmarlo
sí o sí en el iPhone/iPad** (Safari se comporta distinto y no se puede emular acá). Detalle técnico de cada ítem en
`polish-8.4-status.md`.

## Antes de empezar

- Abrí la demo en una **ventana privada** (sin "Reiniciar demo" desde 8.4.13, es la forma de arrancar con los datos de
  muestra). Para volver a empezar: cerrá la ventana privada y abrí otra.
- **Cuenta demo**: botón "Entrar a la cuenta demo" en Mi cuenta o "Ingresar con cuenta demo" en el checkout.
- **Tarjeta de prueba**: botón "Usar tarjeta de prueba" en el formulario (Visa 4242 4242 4242 4242, vence 12/29, código
  123). No cargues una tarjeta real.
- Panel: `/admin-demo/`. Tienda: la raíz.
- Equipos sugeridos: iPhone (Safari), iPad (Safari, vertical y horizontal), un Android y una compu.

## Tienda · inicio, encabezado y navegación

- [ ] **8.4.12** Encabezado: a la derecha, sonido y modo oscuro juntos en una cápsula, una rayita y después buscar,
  favoritos, cuenta y carrito (este con fondo de color). En el celular: sonido aparte y buscar + carrito juntos, sin que
  nada se corte.
- [ ] **8.4.13** No aparece el aviso "Demo de venta" arriba ni "Reiniciar demo" (ni en el pie ni en el panel). El
  checkout sigue diciendo que no se cobra nada; el panel sigue con "Panel de demostración · datos ficticios".
- [ ] **8.4.13 (bug encontrado)** 📱 En el celular, con la temática del Día de la Madre, la **cinta de la temática**
  ("Día de la Madre: 15% OFF…") se ve arriba del encabezado apenas carga, sin tener que scrollear.
- [ ] **8.4.27** 📱 Desde la barra de abajo, cambiá entre Inicio, Categorías, Cupones y Mi cuenta varias veces: la barra
  **nunca queda tapada** por las tarjetas o el fondo, y la pastilla del tab activo se desliza al nuevo.
- [ ] **8.4.28** 📱 Rendimiento en el celular: scrolleá el inicio de arriba abajo y dejalo quieto unos segundos; debería
  sentirse fluido (sin tirones). Cambiar de sección tiene un fundido corto (en el celular ya no es la transición de
  antes: es más liviana). Siguen las partículas de la temática, pero menos.
- [ ] **8.4.28** En la compu y el iPad horizontal, el cambio de página sigue con la transición de siempre (la página
  vieja se desvanece y la nueva sube) y la imagen del producto "vuela" de la tarjeta a la ficha.

## Pantalla de carga y regalos

- [ ] **8.4.3** Al entrar a la tienda y al recargar a mano sale la pantalla de carga. **Ir al checkout no la muestra**
  (ni otras navegaciones internas).
- [ ] **8.4.26** 📱 Recargá estando en una ficha de producto (y en otras páginas): mientras se ve la pantalla de carga
  **no asoma nada de la página encima**; la página aparece cuando sube el telón.
- [ ] **8.4.25** 📱 Abrí un link de regalo con la temática del Día de la Madre (los links de prueba están en
  `docs/regalos-de-prueba.md`): la pantalla de carga de la temática se ve completa y animada (pétalos), no rota.
- [ ] **8.4.8** 📱 Al abrir un regalo, el fondo ya está oscuro: **no se ven los textos de la página** detrás en ningún
  momento.
- [ ] **8.4.9** Abrí un regalo desde Mi cuenta → Mis regalos y salí: volvés a Mis regalos, no a otra pantalla que te pide
  abrirlo de nuevo. Por link: después de abrirlo, al salir dice "ya lo abriste" y "Ver mi regalo" muestra lo de adentro.
- [ ] **8.4.10** 📱 En el **iPad**, en una ficha, tocá "¿Es para regalo?": el modal muestra los campos y los botones (no
  queda vacío). Probalo vertical y horizontal.

## Modales (en toda la tienda y el panel)

- [ ] **8.4.11** 📱 Con cualquier modal abierto (regalo, carrito, búsqueda, direcciones, tarjetas, emails del panel),
  arrastrá el dedo sobre el fondo: **la página de atrás no se mueve**. Adentro del modal sí se puede scrollear. Al
  cerrarlo, la página vuelve a scrollear normal.
- [ ] **Bug encontrado (foco)** Abrí "Agregar dirección" (o cualquier modal con campos) y tocá enseguida otro campo que
  no sea el primero y escribí rápido: lo escrito queda en ese campo (antes saltaba al primero).
- [ ] **Bug encontrado (8.3)** En el panel, editá una temática, cambiá algo y tocá cerrar → "Seguir editando": el modal
  **sigue abierto** sin guardar (antes guardaba y cerraba).

## Ficha de producto y personalización

- [ ] **8.4.1** En los productos con nombre (vela, comedero de madera, colgador de correa, comedero perro globo), el
  nombre que escribís se ve **grabado o en relieve sobre la pieza**, sin cartel blanco ni el nombre de muestra. En el
  carrito, la vela muestra tu nombre (no el de muestra).
- [ ] **8.4.2** En la compu, en una ficha, bajá por las opciones de compra: las migas de pan (Inicio › Categoría)
  **quedan fijas arriba de la galería**.
- [ ] **8.4.23** El **comedero perro globo** ahora es un perro de globos rosa con cuatro patas y el plato con alimento
  en el lomo. Compará con la foto real del producto.

## Checkout

- [ ] **8.4.4** En el paso **Datos** no aparece el carrito.
- [ ] **8.4.5** En Entrega, Pago y Confirmar: el **cupón y el resumen van arriba de "Atrás / Siguiente"**, y los botones
  avanzan el paso igual.
- [ ] **8.4.6** Con la cuenta demo, en Entrega → Cadete: aparece "¿A qué dirección?" con **Casa** elegida. Elegí "Otra
  dirección", completala, tildá "Guardarla en Mis direcciones" con un nombre: queda guardada y elegida.
- [ ] **8.4.22** Pago → **"Tarjeta de crédito o débito"** (primera opción):
  - con la cuenta demo, "Agregar tarjeta" → "Usar tarjeta de prueba" → "Guardar y usar": queda elegida "Visa terminada
    en 4242". Sin elegir tarjeta, "Revisar pedido" avisa.
  - en Confirmar dice "Tarjeta de crédito o débito (muestra) · Visa terminada en 4242"; al confirmar, la pantalla de
    pago muestra la tarjeta y que no se cobró nada.
  - en la próxima compra la tarjeta ya aparece elegida.
  - sin cuenta (otra ventana privada), la tarjeta se usa "solo para esta compra" y no queda guardada.
- [ ] **8.4.22** "Mercado Pago" (antes "Tarjetas de débito, crédito y prepagas") sigue con su pantalla de muestra;
  Transferencia y QR siguen con comprobante y aprobación manual.

## Mi cuenta

- [ ] **8.4.6** **Mis direcciones**: agregar en un modal (avisa si falta algo o el código postal está mal), elegir la
  principal, editar y quitar (pide confirmar). Queda guardado al recargar.
- [ ] **8.4.7** Desde Mis pedidos, entrá a un pedido: el botón **"Volver a Mis pedidos"** te devuelve a la lista.
- [ ] **8.4.14** **Mis mascotas**: cargá una con su cumpleaños (día y mes). En el panel, en la ficha de ese cliente
  (Clientes → Sofía Demo) aparece la mascota con su cumpleaños.
- [ ] **8.4.22** **Mis tarjetas**: agregar (número inválido avisa; "Usar tarjeta de prueba" la completa), se muestra
  "Visa terminada en 4242 · Vence 12/29" y se puede quitar. Solo se guardan marca, últimos 4 y vencimiento.
- [ ] **8.4.6 / 8.4.22** 📱 En el iPad (vertical y horizontal) y el celular, los modales de dirección y tarjeta entran
  enteros, con el botón de guardar a la vista.

## Arrepentimiento

- [ ] **8.4.24** En la compu y el iPad: el formulario y "Cómo funciona" (tres pasos y el plazo de 10 días) van **lado a
  lado** y se ven prolijos. En el celular, uno debajo del otro. Enviá una solicitud: da el código ARR-DEMO-….

## Panel · taller

- [ ] **8.4.15** Calendario → tocá un día con entregas (ej. viernes 9 de octubre) → "Cerrar el taller este día" →
  "Cerrar igual": aparece **"¿Querés transferir los pedidos de este día a otro?"** con los próximos días con taller y
  su carga. Probá:
  - un día que ya tiene pedidos (avisa cuántos y si se pasa de la capacidad: el botón dice "Transferir igual");
  - "O elegí cualquier otra fecha" con un domingo o feriado (no deja);
  - "Un día por pedido" con fechas distintas;
  - "Transferir los pedidos" (aparecen en el día nuevo) y, en otro día, "Dejarlos para después" (quedan marcados).
- [ ] **8.4.16** En el calendario, la ficha de una entrega se abre como **modal centrado** (no panel lateral).
- [ ] **8.4.17** Cola de producción: en cada tarjeta, el botón de la etapa siguiente y "Mover etapa" tienen **el mismo
  alto y ocupan el ancho** de la tarjeta (en tarjetas angostas, uno arriba del otro). Probalo en la compu, el iPad y el
  celular.
- [ ] **8.4.18** Costos y margen: hora de máquina, hora a mano y margen objetivo **alineados en una fila**; al lado, el
  margen promedio y "Para revisar". Abajo, **"Cómo se calcula y para qué sirve"**: cambiá el margen objetivo y el
  ejemplo del precio sugerido se actualiza.

## Panel · marketing y ajustes

- [ ] **8.4.19** Emails automáticos → Editar una plantilla: el editor va en **cuatro pasos** (Cuándo se envía, Asunto,
  Contenido, Revisar y probar):
  - en la compu, la vista previa va al costado todo el tiempo; en el iPad/celular, "Ver cómo queda" la abre en un
    modal y en el último paso se ve entera;
  - en Asunto, el contador de letras y cómo se ve en la bandeja del celular;
  - en Revisar, los avisos (ej. un asunto muy largo) con "Ir a…" que lleva al paso; "Enviar prueba" (con todo
    guardado), "Restaurar la original" y "Guardar y volver a Emails";
  - salir sin guardar y volver: recupera los cambios ("Descartar cambios" los tira).
- [ ] **8.4.20** En Emails automáticos, la **bandeja de salida va arriba de todo** como tarjeta con los últimos emails;
  tocá uno: se abre en un **modal centrado**. "Ver toda la bandeja" lleva a la página completa.
- [ ] **8.4.21** Temáticas → Editar una temática: se abre como **modal** (no panel lateral); cerrar con cambios pide
  confirmar.
- [ ] **8.4.22** Ajustes → Medios de pago: aparece **"Tarjetas de crédito y débito"** tildada. Destildala y guardá: en
  el checkout ya no aparece la opción de tarjeta. En el panel, un pedido pagado con tarjeta dice "Tarjeta · Visa
  terminada en 4242", no pasa por Pagos manuales y se aprueba con "Simular aprobación de la tarjeta".

## Si algo falla

Anotá el equipo (modelo y navegador), la pantalla y qué hiciste, y si podés una captura o video. Lo marcado con 📱 es lo
más probable de comportarse distinto en Safari.
