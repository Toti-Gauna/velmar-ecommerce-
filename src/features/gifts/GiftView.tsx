"use client";
import { Gift as GiftIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { HeroSkeleton } from "@/components/atoms/Skeleton";
import { decodeGift } from "@/demo/engine/gift-link";
import { normalizeGiftCode, type Gift } from "@/demo/engine/gifts";
import { demoGifts, sampleGifts } from "@/demo/fixtures/gifts";
import { useGifts } from "@/stores/gifts";
import { useHydrated } from "@/stores/hydration";
import { GiftExperience } from "./GiftExperience";
import { RedeemForm } from "./RedeemForm";

/** Busca un código en este navegador: regalos de muestra, comprados acá o guardados. */
function findByCode(code: string, pools: Gift[][]): Gift | null {
  for (const pool of pools) { const g = pool.find((x) => x.code === code); if (g) return g; }
  return null;
}

/**
 * /regalo/: abre un regalo con el link (?g=), con el código (?c=) o pide el código. Al entrar todo se oscurece y
 * aparece el regalo para abrir a golpes; adentro está el producto (sin precio) y el mensaje.
 */
export function GiftView() {
  const params = useSearchParams();
  const hydrated = useHydrated();
  const { sent, saved } = useGifts();
  const preview = params.get("vista") === "previa";
  const param = params.get("g");
  const codeParam = params.get("c");
  const code = codeParam ? normalizeGiftCode(codeParam) : null;
  const gift = param ? decodeGift(param) : code ? findByCode(code, [demoGifts, sampleGifts, sent, saved]) : null;
  if (!hydrated) return <HeroSkeleton label="Cargando regalo" />;

  const failed = (param && !gift) || (codeParam && !gift);
  if (!gift) {
    return (
      <section className="mx-auto flex max-w-xl flex-col items-center gap-6 py-6 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-night text-brass"><GiftIcon size={28} aria-hidden="true" /></span>
        <div>
          <h1 className="font-display text-4xl sm:text-5xl">{failed ? "No pudimos abrir ese regalo" : "¿Te hicieron un regalo?"}</h1>
          <p className="mt-3 text-muted">
            {failed
              ? param ? "El link está incompleto o se modificó. Pedile a quien te lo mandó que te lo reenvíe, o escribí el código."
                : "Ese código no está en este navegador. En la demo los códigos se abren donde se compraron; el link funciona en cualquier teléfono."
              : "Escribí el código que te mandaron o abrí el link. Si tenés cuenta, también lo ves en Mis regalos."}
          </p>
        </div>
        <RedeemForm initial={codeParam ?? ""} />
      </section>
    );
  }

  return <GiftExperience key={gift.code} gift={gift} preview={preview} fromAccount={params.get("desde") === "cuenta"} />;
}
