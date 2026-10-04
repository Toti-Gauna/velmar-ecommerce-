import { ResetDemoButton } from "./ResetDemoButton";

export function DemoBanner() {
  return (
    <div role="note" className="bg-primary text-on-primary">
      <p className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center text-xs font-semibold sm:text-sm">
        <span><strong>Demo de venta.</strong> No se cobra nada ni se guarda ningún pedido real. Precios y stock de muestra.</span>
        <ResetDemoButton className="underline underline-offset-2 hover:no-underline" />
      </p>
    </div>
  );
}
