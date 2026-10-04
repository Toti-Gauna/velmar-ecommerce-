# Reglas para agentes (Claude Code, Codex)

Fuente de verdad: **Especificación técnica — Velmar Ecommerce** (Notion). Lo que no está ahí no se construye.
Ante una duda de alcance: parar y preguntar a Ignacio, no decidir.

## Fase actual: demo frontend estática (pre-seña)
- Se publica en GitHub Pages con `output: "export"`. **Prohibido** en esta fase: Server Actions, Route Handlers que lean el request,
  cookies, headers, middleware/proxy, ISR, rutas dinámicas sin `generateStaticParams` + `dynamicParams = false`, `next/image` con loader default.
- Nada de pagos, pedidos reales, credenciales, tokens ni llamadas a servicios externos. Todo estado vive en React + localStorage.
- Ningún QR, CBU o alias real. Nunca escribir "pago acreditado". Las fotos del comprador no salen del navegador.

## Panel demo (`/admin-demo/`)
- Abierto sin login a propósito, datos ficticios, estado solo en localStorage. Siempre con la señal "Panel de demostración · datos ficticios".
- Nunca presentarlo como seguro ni reutilizarlo como autorización. Ver `docs/panel-demo.md`.
- Subir un comprobante nunca pasa un pedido a PAID; las transiciones salen de `src/demo/engine/orders.ts`.

## Capas
- `src/config/` marca configurable (en producción: tabla `Setting`). Paleta provisional.
- `src/demo/fixtures/` datos de muestra del cliente. **Ningún dato de cliente en componentes.**
- `src/demo/engine/` reglas simuladas (precio, cupones, misiones, búsqueda, catálogo). Puras y testeadas.
  En producción estas reglas viven en `src/server/services` y el servidor recalcula todo.
- `src/components/{atoms,molecules,organisms,templates}` Atomic Design: solo props tipadas, sin reglas de negocio.
- `src/features/` contenedores cliente que conectan stores + engine con componentes.
- `src/stores/` Zustand persistido (`velmar-demo:*`), con rehidratación después del primer render.

## Calidad
- TypeScript estricto. Montos en pesos enteros.
- Archivos escritos a mano: objetivo ≤150 líneas, >250 bloquea (excluye fixtures).
- Antes de commitear: `npm run lint && npm run typecheck && npm test && npm run build`.
- E2E: `PAGES_BASE_PATH=/velmar-ecommerce- npm run build && PAGES_BASE_PATH=/velmar-ecommerce- npm run e2e`.
- Accesibilidad AA, foco visible, `prefers-reduced-motion`, sin animaciones permanentes ni audio.
- Cada tarea declara archivos tocados, comportamiento, prueba ejecutada y decisiones abiertas.
