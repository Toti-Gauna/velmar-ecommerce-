# Velmar · demo de tienda online

Demo frontend **clickeable de punta a punta** de la tienda de Velmar (Mar del Plata), para mostrar antes de la seña.
**No procesa pagos, no crea pedidos reales y no llama a servicios externos.** Precios, stock y textos son de muestra.

- Stack: Next.js 16 (App Router, export estático) · React 19 · TypeScript estricto · Tailwind CSS 4 · Zustand · React Hook Form + Zod · react-konva · Lucide.
- Publicación: GitHub Pages vía `.github/workflows/pages.yml`.

```bash
npm ci
npm run dev                # http://localhost:3000 (basePath vacío)
npm run check              # lint + typecheck + unit
npm run build              # export estático en out/
PAGES_BASE_PATH=/velmar-ecommerce- npm run build && PAGES_BASE_PATH=/velmar-ecommerce- npm run e2e
```

Documentación: [`docs/README.md`](docs/README.md).
