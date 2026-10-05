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

## Motion
- Librería: `motion` (`motion/react`), envuelta en `MotionRoot` con `reducedMotion="user"`. Se eligió porque da
  transiciones con resorte, `layoutId` (selector de variantes, pestañas) y `AnimatePresence` (galería, drawer, ruleta)
  sin escribir física a mano. Lo crítico para la primera impresión (splash, hero, entrada de página) es **CSS puro**:
  se ve sin JS y no depende del bundle.
- Splash de marca (HTML+CSS): fondo noche, los dos chevrones se dibujan, "Velmar" aparece con un barrido y una línea
  dorada; una cortina lo retira entre los 620 y 1040 ms. `pointer-events: none` (nunca bloquea), una vez por sesión.
- Tienda: header con vidrio que se compacta al hacer scroll, aparición escalonada al entrar en pantalla (`Reveal`),
  contadores, tarjetas con segunda vista al hover y "agregar rápido", drawer del carrito, galería con zoom por cursor,
  medidor de stock, barra de envío gratis y misión, ruleta del club con giro desacelerado, check animado en la confirmación
  y recorrido animado en el seguimiento.
- Íconos de premios propios en SVG (`RewardGlyph`: porcentaje, camión, regalo, grabado, moneda) con degradé dorado: se usan en los gajos de la ruleta y en los cupones con forma de ticket (talón con guilloché SVG y perforación).
- Sin animaciones permanentes: nada queda en bucle (se quitó el marquee); todo termina en < 1,5 s salvo el giro de la ruleta (4,8 s, iniciado por el usuario).
- `prefers-reduced-motion: reduce` desactiva splash y confeti, la ruleta salta al resultado y toda transición pasa a 1 ms. Sin autoplay ni audio.
