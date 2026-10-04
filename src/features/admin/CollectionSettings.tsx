"use client";
import { useState } from "react";
import { Input } from "@/components/atoms/Field";
import { SampleQr } from "@/components/molecules/SampleQr";
import { fileToThumbnail } from "@/lib/image";
import { PhotoInput } from "../personalize/PhotoInput";
import { SettingsForm, useSettingsDraft } from "./SettingsSections";

/** Datos de cobro de MUESTRA. El QR cargado se previsualiza solo acá y la tienda demo sigue mostrando el QR de muestra. */
export function CollectionSettings() {
  const { settings, commit } = useSettingsDraft();
  const [d, setD] = useState({ alias: settings.transferAlias, cbu: settings.transferCbu, holder: settings.transferHolder });
  const [qr, setQr] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  return (
    <SettingsForm title="Datos de cobro (muestra)" error={error} onSave={() => {
      if (!/^[A-Za-z0-9.-]{6,20}$/.test(d.alias)) return setError("El alias tiene de 6 a 20 caracteres: letras, números, punto o guion.");
      if (!/^\d{22}$/.test(d.cbu)) return setError("El CBU/CVU tiene 22 dígitos.");
      if (d.holder.trim().length < 3) return setError("Escribí el titular.");
      setError(null);
      commit("Datos de cobro de muestra guardados", { transferAlias: d.alias, transferCbu: d.cbu, transferHolder: d.holder.trim() });
    }}>
      <p className="rounded-xl bg-warning-soft p-2 text-xs font-bold text-warning">No cargues datos bancarios reales en la demo: se muestran en el checkout de este navegador como “datos de muestra”.</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm font-bold">Alias<Input value={d.alias} onChange={(e) => setD({ ...d, alias: e.target.value })} /></label>
        <label className="flex flex-col gap-1 text-sm font-bold">CBU / CVU<Input value={d.cbu} inputMode="numeric" onChange={(e) => setD({ ...d, cbu: e.target.value.replace(/\D/g, "") })} /></label>
        <label className="flex flex-col gap-1 text-sm font-bold">Titular<Input value={d.holder} onChange={(e) => setD({ ...d, holder: e.target.value })} /></label>
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
    </SettingsForm>
  );
}
