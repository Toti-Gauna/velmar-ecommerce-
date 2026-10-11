"use client";
import { Gift as GiftIcon, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImmersiveStage } from "@/components/motion/ImmersiveStage";
import type { Gift } from "@/demo/engine/gifts";
import { useAccount } from "@/stores/account";
import { useGifts } from "@/stores/gifts";
import { GiftCard } from "./GiftCard";
import { GiftOpener } from "./GiftOpener";
import { occasionColors } from "./occasion";

interface Props {
  gift: Gift;
  preview: boolean;
  /** Se abrió desde "Mis regalos": al salir vuelve ahí. */
  fromAccount: boolean;
}

const action = "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-bold";

/**
 * Un regalo en el escenario. Con `key` por código: otro regalo arranca de cero (golpes y escenario).
 * - 8.4.8: al entrar, el escenario ya está oscuro desde el primer cuadro y la página de atrás no se dibuja mientras
 *   está abierto (asomaban sus textos un segundo).
 * - 8.4.9: al salir no vuelve a aparecer "tenés un regalo" para abrir otra vez el mismo: desde Mis regalos vuelve a
 *   la cuenta; por link o código, queda una página de "ya lo abriste" con el regalo a mano.
 */
export function GiftExperience({ gift, preview, fromAccount }: Props) {
  const { saved, opened, save, markOpened } = useGifts();
  const user = useAccount((s) => s.user);
  const router = useRouter();
  const [stage, setStage] = useState(true);
  const [instant, setInstant] = useState(true);
  // La apertura a golpes es la primera vez; después se ve directo lo de adentro ("Abrirlo otra vez" la repite).
  const [open, setOpen] = useState<boolean | null>(null);
  const wasOpened = opened.includes(gift.code);
  const isOpen = open ?? (wasOpened && !preview);
  // Ya está en la cuenta si se guardó o si llegó al email de la cuenta abierta.
  const isSaved = saved.some((g) => g.code === gift.code) || (Boolean(user && gift.toEmail) && user!.email.toLowerCase() === gift.toEmail);
  const colors = occasionColors(gift.occasion);
  const done = () => { setOpen(true); if (!preview) markOpened(gift.code); };
  const leave = () => {
    // Reemplaza la página del regalo: con Atrás no se vuelve a abrir el escenario.
    if (fromAccount && user) router.replace("/cuenta/#regalos");
    else setStage(false);
  };
  const show = () => { setInstant(false); setStage(true); };
  return (
    <section aria-label={stage ? undefined : "Tu regalo"} className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center gap-5 py-6 text-center">
      {!stage && (isOpen ? (
        <>
          <span className="grid h-16 w-16 place-items-center rounded-full bg-night text-brass"><GiftIcon size={28} aria-hidden="true" /></span>
          <div>
            <h1 className="font-display text-4xl sm:text-5xl">Tu regalo de {gift.from}</h1>
            <p className="mt-3 text-muted">Ya lo abriste: {gift.item.name}. Podés volver a verlo, con su mensaje, cuando quieras.</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <button type="button" onClick={show} className={`${action} bg-primary text-on-primary`}>Ver mi regalo</button>
            {user ? <Link href="/cuenta/#regalos" className={`${action} border border-ink/15`}>Ir a Mis regalos</Link>
              : <Link href="/" className={`${action} border border-ink/15`}><ShoppingBag size={18} aria-hidden="true" /> Ir a la tienda</Link>}
          </div>
        </>
      ) : (
        <>
          <span className="grid h-16 w-16 place-items-center rounded-full bg-night text-brass"><GiftIcon size={28} aria-hidden="true" /></span>
          <h1 className="font-display text-4xl sm:text-5xl">{gift.to}, tenés un regalo de {gift.from}</h1>
          <p className="text-muted">Todavía no lo abriste.</p>
          <button type="button" onClick={show} className={`${action} bg-primary text-on-primary`}>Abrir mi regalo</button>
        </>
      ))}
      <ImmersiveStage open={stage} onClose={leave} instant={instant} label={`Regalo de ${gift.from} para ${gift.to}`} glow={[colors.from, colors.to]}
        exitLabel={fromAccount && user ? "Volver a Mis regalos" : "Salir"}>
        {isOpen ? (
          <GiftCard gift={gift} saved={isSaved} preview={preview} onSave={() => save(gift)} onReplay={() => setOpen(false)} />
        ) : (
          <>
            <p className="font-display mb-4 max-w-sm text-center text-[clamp(1.5rem,6vw,2.1rem)] leading-tight">{gift.to}, {gift.from} te mandó un regalo</p>
            <GiftOpener key={String(open)} scene={gift.occasion} accent={colors.accent} onOpened={done} autoFocus={open === false} />
          </>
        )}
      </ImmersiveStage>
    </section>
  );
}
