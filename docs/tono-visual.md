# Tono visual (PROVISIONAL)

No hay paleta ni tipografía confirmadas por Velmar. Lo siguiente se derivó del logo descrito (dos chevrones verde
oliva sobre blanco) y de sus fotos (madera clara, plantas, estética hogareña). **No es la identidad final.**

| Token | Valor | Uso |
|---|---|---|
| `--brand-primary` | `#3d4a2a` verde oliva oscuro | Botones, links, foco (9,5:1 sobre blanco; 8,96:1 sobre el fondo) |
| `--brand-primary-hover` | `#2c361e` | Hover |
| `--brand-accent` | `#ede0c6` | Fondos suaves, chips |
| `--brand-wood` | `#c9a77a` madera clara | Decoración (no texto) |
| `--brand-background` | `#fbf8f2` | Fondo general |
| `--brand-text` / `--brand-muted` | `#23251d` / `#5b5e4f` | Texto: 14,6:1 y 6,3:1 sobre el fondo (AA) |
| `--brand-font` | Nunito (variable, self-hosted vía @fontsource) | Toda la UI; Caveat solo como fuente "Manuscrita" del personalizador |

- Se definen en `src/config/brand.ts` → variables CSS en `<html>` → tokens `@theme` de Tailwind (`app/globals.css`).
  En producción vienen de la tabla `Setting` y se cambian sin deploy.
- Imágenes: no hay fotos reales de Velmar en el repo. Se usan ilustraciones vectoriales propias, rotuladas
  "Imagen ilustrativa". Reemplazarlas por fotos reales cuando Velmar las entregue.

## Motion
- Splash de marca (HTML+CSS, sin JS): los dos chevrones se dibujan y aparece "Velmar"; se oculta solo a los ~800 ms,
  `pointer-events: none` (nunca bloquea), una vez por sesión.
- Skeletons (catálogo, carrito, checkout, editor de foto), transiciones cortas entre pasos, galería con fundido,
  "pop" del contador del carrito y toast al agregar, barra de misión animada, confeti de 900 ms al completar misión.
- `prefers-reduced-motion: reduce` desactiva splash, confeti y reduce toda animación a 1 ms. Sin autoplay ni audio.
