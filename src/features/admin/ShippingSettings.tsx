"use client";
import { useState } from "react";
import { Input } from "@/components/atoms/Field";
import { Switch } from "@/components/atoms/Switch";
import type { ShippingZone } from "@/demo/types";
import { useAdmin } from "@/stores/admin";
import { NumberField } from "./NumberField";
import { SettingsForm, useSettingsDraft } from "./SettingsSections";
import { useDemoSave } from "./useDemoSave";

function ZoneForm({ zone }: { zone: ShippingZone }) {
  const saveZone = useAdmin((s) => s.saveZone);
  const save = useDemoSave();
  const [z, setZ] = useState(zone);
  const [cps, setCps] = useState((zone.postalCodes ?? []).join(", "));
  return (
    <SettingsForm title={z.name} onSave={() => save(`Zona “${z.name}” guardada`, () => saveZone({ ...z, postalCodes: z.type === "LOCAL_DELIVERY" ? cps.split(/[\s,]+/).filter((c) => /^\d{4}$/.test(c)) : z.postalCodes }))}>
      <Switch checked={z.active !== false} onChange={(v) => setZ({ ...z, active: v })} label={z.active === false ? "No disponible en el checkout" : "Disponible en el checkout"} />
      <div className="grid gap-3 sm:grid-cols-2">
        {z.type !== "PICKUP" && <NumberField id={`${z.id}-price`} label="Precio" suffix="ARS" value={z.price ?? 0} onChange={(n) => setZ({ ...z, price: n })} />}
        <label className="flex flex-col gap-1 text-sm font-bold">Plazo que ve el comprador<Input value={z.etaText} onChange={(e) => setZ({ ...z, etaText: e.target.value })} /></label>
      </div>
      {z.type === "LOCAL_DELIVERY" && (
        <label className="flex flex-col gap-1 text-sm font-bold">Códigos postales con cadete
          <Input value={cps} onChange={(e) => setCps(e.target.value)} />
          <span className="text-xs font-normal text-muted">Separados por coma, 4 dígitos.</span>
        </label>
      )}
    </SettingsForm>
  );
}

export function ShippingSettings() {
  const zones = useAdmin((s) => s.data.zones);
  const { settings, commit } = useSettingsDraft();
  const [free, setFree] = useState(settings.freeShippingFrom);
  return (
    <div className="flex flex-col gap-3">
      <SettingsForm title="Envío gratis" onSave={() => commit("Umbral de envío gratis guardado", { freeShippingFrom: free })}>
        <NumberField id="free" label="Envío gratis desde" suffix="ARS" value={free} onChange={setFree} hint="El carrito muestra cuánto falta." />
      </SettingsForm>
      {zones.map((z) => <ZoneForm key={`${z.id}-${JSON.stringify(z)}`} zone={z} />)}
    </div>
  );
}
