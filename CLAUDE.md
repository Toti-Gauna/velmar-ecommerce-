# CLAUDE.md

Leé y seguí `AGENTS.md` (reglas comunes) y `docs/README.md`.

- La especificación técnica de Notion es la fuente de verdad; no agregar funcionalidades fuera de ella.
- Montos en pesos enteros; precio, stock, pagos y misiones solo en el engine (demo) o `src/server/services` (producción).
- Ningún dato de un cliente en el código de UI: va en fixtures/seed o en el panel.
- Fase actual: demo estática para GitHub Pages. Ver `docs/demo-pages.md` antes de agregar cualquier API o Server Action.
- Ante una duda de alcance: parar y preguntar a Ignacio.
