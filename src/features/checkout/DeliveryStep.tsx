"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bike, Store, Truck } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Field, Input } from "@/components/atoms/Field";
import { OptionCard } from "@/components/atoms/OptionCard";
import { isLocalPostalCode } from "@/demo/engine/shipping";
import { useAccount } from "@/stores/account";
import { useAccountProfile, useProfile } from "@/stores/profile";
import { useDemoData } from "@/stores/admin";
import type { FulfillmentType } from "@/demo/types";
import { formatARS } from "@/lib/money";
import { useCheckout } from "@/stores/checkout";
import { addressSchema, type AddressInput } from "./schemas";
import { newId } from "../account/AccountFormDialog";
import { OTHER_ADDRESS, SavedAddresses, sameAddress } from "./SavedAddresses";
import { STEP_FORM, StepNav } from "./StepNav";

const ICONS = { PICKUP: Store, LOCAL_DELIVERY: Bike, SHIPPING: Truck };
const FIELDS: { name: keyof AddressInput; label: string; auto: string; mode?: "numeric" }[] = [
  { name: "street", label: "Calle", auto: "address-line1" },
  { name: "number", label: "Altura", auto: "address-line2" },
  { name: "postalCode", label: "Código postal", auto: "postal-code", mode: "numeric" },
  { name: "city", label: "Ciudad", auto: "address-level2" },
  { name: "province", label: "Provincia", auto: "address-level1" },
];

export function DeliveryStep({ onNext, onBack, freeShipping, before }: { onNext: () => void; onBack: () => void; freeShipping: boolean; before?: ReactNode }) {
  const { fulfillment, address, patch } = useCheckout();
  const [choice, setChoice] = useState<FulfillmentType | null>(fulfillment);
  const [missing, setMissing] = useState(false);
  const allZones = useDemoData((d) => d.zones);
  const zones = allZones.filter((z) => z.active !== false);
  // 8.4.6: direcciones guardadas de la cuenta. Se propone la que ya estaba elegida o la principal.
  const user = useAccount((s) => s.user);
  const profile = useAccountProfile(user?.email ?? "");
  const saved = user ? profile.addresses : [];
  const [pick, setPick] = useState(() => saved.find((a) => sameAddress(a, address))?.id ?? (address.street ? OTHER_ADDRESS : profile.mainAddress ?? saved[0]?.id ?? OTHER_ADDRESS));
  const fields = (a: AddressInput) => ({ street: a.street, number: a.number, postalCode: a.postalCode, city: a.city, province: a.province });
  const form = useForm<AddressInput>({ resolver: zodResolver(addressSchema), defaultValues: fields(saved.find((a) => a.id === pick) ?? address) });
  const errors = form.formState.errors;
  const [keep, setKeep] = useState(false);
  const [keepLabel, setKeepLabel] = useState("");
  const choose = (id: string) => {
    setPick(id);
    const a = saved.find((x) => x.id === id);
    // "Otra dirección" arranca vacía si lo cargado era una guardada.
    form.reset(a ? fields(a) : saved.some((x) => sameAddress(x, form.getValues())) ? { street: "", number: "", postalCode: "", city: "", province: "" } : form.getValues());
  };
  const typing = !saved.length || pick === OTHER_ADDRESS;

  const submit = (data?: AddressInput) => {
    if (!choice) return setMissing(true);
    if (data && choice === "LOCAL_DELIVERY" && !isLocalPostalCode(data.postalCode)) {
      return form.setError("postalCode", { message: "Ese código postal no tiene cadete. Elegí envío al resto del país o retiro." });
    }
    patch({ fulfillment: choice, ...(data && { address: data }) });
    if (data && user && typing && keep) {
      useProfile.getState().saveAddress(user.email, { id: newId("dir"), label: keepLabel.trim() || (saved.length ? `Dirección ${saved.length + 1}` : "Casa"), ...data });
    }
    onNext();
  };

  return (
    <>
    <form id={STEP_FORM} noValidate onSubmit={choice && choice !== "PICKUP" ? form.handleSubmit(submit) : (e) => { e.preventDefault(); submit(); }} className="flex flex-col gap-5">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 font-bold">¿Cómo lo recibís?</legend>
        {zones.map((z) => {
          const Icon = ICONS[z.type];
          const price = z.price === 0 ? "Gratis" : freeShipping ? "Gratis" : z.price === null ? "A cotizar" : formatARS(z.price);
          return (
            <OptionCard key={z.id} name="fulfillment" value={z.type} checked={choice === z.type} onChange={(v) => { setChoice(v as FulfillmentType); setMissing(false); patch({ fulfillment: v as FulfillmentType }); }}
              title={z.name} description={z.etaText} aside={price} icon={<Icon size={20} aria-hidden="true" />} />
          );
        })}
        {missing && <p role="alert" className="text-sm font-semibold text-danger">Elegí una forma de entrega.</p>}
        <p className="text-xs text-muted">Zonas y precios de muestra. Retiro: dirección a confirmar por Velmar.</p>
      </fieldset>
      {choice && choice !== "PICKUP" && saved.length > 0 && <SavedAddresses addresses={saved} main={profile.mainAddress} value={pick} onChange={choose} />}
      {choice && choice !== "PICKUP" && !typing && errors.postalCode && <p role="alert" className="-mt-2 text-sm font-semibold text-danger">{errors.postalCode.message}</p>}
      {choice && choice !== "PICKUP" && typing && (
        <fieldset className="animate-fade-up grid gap-4 sm:grid-cols-2">
          <legend className="mb-2 font-bold">Dirección de entrega</legend>
          {FIELDS.map((f) => (
            <Field key={f.name} id={`a-${f.name}`} label={f.label} error={errors[f.name]?.message}>
              <Input id={`a-${f.name}`} autoComplete={f.auto} inputMode={f.mode} aria-invalid={Boolean(errors[f.name])} aria-describedby={errors[f.name] ? `a-${f.name}-error` : undefined} {...form.register(f.name)} />
            </Field>
          ))}
          {user && (
            <div className="flex flex-col gap-3 sm:col-span-2">
              <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={keep} onChange={(e) => setKeep(e.target.checked)} className="h-5 w-5" /> Guardarla en Mis direcciones</label>
              {keep && <Field id="a-label" label="Nombre de la dirección"><Input id="a-label" value={keepLabel} placeholder="Casa, Trabajo…" maxLength={30} onChange={(e) => setKeepLabel(e.target.value)} /></Field>}
            </div>
          )}
        </fieldset>
      )}
    </form>
    {before}
    <StepNav onBack={onBack} next="Continuar al pago" />
    </>
  );
}
