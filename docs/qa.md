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
| Splash no bloquea clics y desaparece en < 1 s | idem | ✅ |
| Contraste AA de los tokens | cálculo WCAG (ver `tono-visual.md`) | ✅ |
| Reglas: precio, cupones, envío gratis, total ≥ 0, misiones, stock, validaciones | `tests/unit` (Vitest) | ✅ |

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
- **Accesibilidad**: no hay auditoría automática con axe todavía (se evitó sumar dependencia); revisión manual recomendada.
- El prefetch del router de Next hace `HEAD` al mismo origen; es lectura y no envía datos.
