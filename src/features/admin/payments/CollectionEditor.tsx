"use client";
import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { describedBy, Field, Input } from "@/components/atoms/Field";
import { SampleQr } from "@/components/molecules/SampleQr";
import { collectionErrors, type CollectionKey } from "@/demo/admin/collection";
import { fileToThumbnail } from "@/lib/image";
import { PhotoInput } from "../../personalize/PhotoInput";
import { useSettingsDraft } from "../SettingsSections";

type Key = CollectionKey;

/**
 * Editor de datos de cobro (8.3.30): alias, CBU/CVU, titular y QR estático de muestra. Una sola fuente (los ajustes de
 * la demo), la usan Ajustes y el modal de Pagos. Guardar no aprueba pagos ni toca pedidos: cambia las instrucciones de
 * las compras nuevas del checkout. Cancelar no guarda nada.
 */
export function CollectionEditor({ onDone, onCancel }: { onDone?: () => void; onCancel?: () => void }) {
  const { settings, commit } = useSettingsDraft();
  const [d, setD] = useState<Record<Key, string>>({ alias: settings.transferAlias, cbu: settings.transferCbu, holder: settings.transferHolder });
  const [qr, setQr] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const set = (k: Key, v: string) => { setD({ ...d, [k]: v }); setErrors({ ...errors, [k]: undefined }); };
  const field = (k: Key, label: string, props: Partial<React.ComponentProps<"input">> = {}) => (
    <Field id={`col-${k}`} label={label} error={errors[k]}>
      <Input id={`col-${k}`} value={d[k]} onChange={(e) => set(k, props.inputMode === "numeric" ? e.target.value.replace(/\D/g, "") : e.target.value)} aria-invalid={!!errors[k]} aria-describedby={describedBy(`col-${k}`, errors[k])} {...props} />
    </Field>
  );
  return (
    <form noValidate className="flex flex-col gap-4" onSubmit={(e) => {
      e.preventDefault();
      const found = collectionErrors(d);
      if (Object.keys(found).length) { setErrors(found); return; }
      commit("Datos de cobro de muestra guardados", { transferAlias: d.alias, transferCbu: d.cbu, transferHolder: d.holder.trim() });
      onDone?.();
    }}>
      <p className="rounded-xl bg-warning-soft p-2.5 text-xs font-bold text-warning">Solo datos ficticios: se muestran en el checkout de este navegador como “datos de muestra”. No cargues datos bancarios reales.</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {field("alias", "Alias", { autoComplete: "off" })}
        {field("cbu", "CBU / CVU", { inputMode: "numeric", maxLength: 22 })}
        {field("holder", "Titular", { autoComplete: "off" })}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {qr ? (
          <figure className="relative w-44">
            {/* eslint-disable-next-line @next/next/no-img-element -- vista previa local */}
            <img src={qr} alt="QR cargado (vista previa local)" className="w-44 rounded-2xl border border-line opacity-60" />
            <span className="absolute inset-0 grid place-items-center"><span className="rotate-[-12deg] rounded-lg bg-warning px-2 py-1 text-sm font-extrabold text-white">MUESTRA</span></span>
          </figure>
        ) : <SampleQr />}
        <div className="flex-1">
          <PhotoInput label="QR estático del vendedor" hint="Vista previa local con marca de agua. No se guarda ni se muestra en la tienda demo. En producción es un archivo del panel."
            onFile={async (f) => setQr(await fileToThumbnail(f, 400))} />
        </div>
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        {onCancel && <Button variant="ghost" onClick={onCancel}>Cancelar</Button>}
        <Button type="submit" size={onCancel ? "md" : "sm"} className={onCancel ? "" : "self-start"}>Guardar datos de cobro</Button>
      </div>
    </form>
  );
}
