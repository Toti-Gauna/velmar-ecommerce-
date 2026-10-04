"use client";
import { AdminPageHeader } from "./AdminPageHeader";
import { CollectionSettings } from "./CollectionSettings";
import { BrandSettings, ContactSettings, PaymentSettings } from "./SettingsSections";
import { ShippingSettings } from "./ShippingSettings";

export function SettingsAdmin() {
  return (
    <>
      <AdminPageHeader title="Ajustes">Marca, contacto, cobro de muestra, medios de pago y envíos. Los cambios se ven en la tienda de este navegador sin deploy.</AdminPageHeader>
      <div className="grid gap-4 xl:grid-cols-2">
        <BrandSettings />
        <ContactSettings />
        <PaymentSettings />
        <CollectionSettings />
        <div className="xl:col-span-2"><h2 className="mb-3 mt-2 text-lg font-extrabold">Envíos y retiro</h2><ShippingSettings /></div>
      </div>
    </>
  );
}
