"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FlaskConical } from "lucide-react";
import { LogoMark } from "@/components/atoms/Logo";
import { resetDemo } from "@/stores/hydration";
import { useToasts } from "@/stores/toast";

/** Señal persistente: el panel es una demo abierta a propósito, con datos ficticios y sin seguridad real. */
export function AdminBanner() {
  const router = useRouter();
  const toast = useToasts((s) => s.push);
  return (
    <header className="sticky top-0 z-40 border-b-2 border-dashed border-warning bg-warning-soft">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2">
        <Link href="/admin-demo/" className="flex items-center gap-2" aria-label="Panel demo, inicio"><LogoMark className="h-6 w-6" /></Link>
        <p className="min-w-0 flex-1 text-sm font-extrabold text-warning">
          <FlaskConical size={16} aria-hidden="true" className="mr-1.5 inline align-[-3px]" />
          Panel de demostración · datos ficticios
          <span className="hidden font-semibold lg:inline"> · Sin login a propósito: no es seguro ni sirve como acceso real.</span>
        </p>
        <div className="flex items-center gap-3 text-sm font-bold">
          <Link href="/" className="text-primary underline underline-offset-2">Ver tienda</Link>
          <button type="button" className="text-primary underline underline-offset-2" onClick={() => {
            if (!window.confirm("¿Reiniciar la demo? Panel y tienda vuelven a los datos ficticios iniciales en este navegador.")) return;
            resetDemo();
            toast({ tone: "info", title: "Demo reiniciada", description: "Panel y tienda volvieron a los datos de muestra." });
            router.push("/admin-demo/");
          }}>Reiniciar demo</button>
        </div>
      </div>
    </header>
  );
}
