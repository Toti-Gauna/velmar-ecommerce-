"use client";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/atoms/Button";
import { Reveal } from "@/components/motion/Reveal";
import { TextPreview } from "@/components/organisms/TextPreview";
import { validateText } from "@/demo/engine/personalization";
import { FONT_FAMILIES, fonts } from "@/demo/fixtures/templates";
import { cn } from "@/lib/cn";
import { useDemoData } from "@/stores/admin";

const COLORS = [{ name: "Verde oliva", hex: "#3a4527" }, { name: "Rosa", hex: "#d9667f" }, { name: "Celeste", hex: "#3f7fb5" }, { name: "Negro", hex: "#1f1f1f" }];

/** Probador en vivo en el inicio: escribís y el collar cambia al instante. */
export function LiveCustomizer({ eyebrow }: { eyebrow: string }) {
  const zone = useDemoData((d) => d.textZones.collar);
  const [text, setText] = useState("Lola");
  const [font, setFont] = useState<string>("Redondeada");
  const [color, setColor] = useState(COLORS[0]!);
  const error = text ? validateText(text, 10) : null;
  return (
    <section aria-labelledby="probalo" className="overflow-hidden rounded-[2.5rem] bg-surface shadow-[var(--shadow-card)]">
      <div className="grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-14">
        <Reveal>
          <p className="eyebrow text-brass-ink">{eyebrow}</p>
          <h2 id="probalo" className="font-display mt-3 text-4xl leading-tight sm:text-5xl">Escribí el nombre. <span className="italic text-primary">Miralo al instante.</span></h2>
          <p className="mt-4 max-w-md text-muted">Así funciona el personalizador de cada producto: lo que ves es lo que aprobás.</p>
          <label htmlFor="live-name" className="mt-8 block text-sm font-bold">Nombre de tu mascota</label>
          <input id="live-name" value={text} maxLength={12} onChange={(e) => setText(e.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? "live-error" : undefined}
            className="font-display mt-2 w-full border-b-2 border-ink/20 bg-transparent pb-2 text-4xl outline-none transition-colors focus:border-primary" />
          {error && <p id="live-error" role="alert" className="mt-2 text-sm font-semibold text-danger">{error}</p>}
          <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Tipografía">
            {fonts.map((f) => (
              <button key={f} type="button" aria-pressed={font === f} onClick={() => setFont(f)} style={{ fontFamily: FONT_FAMILIES[f] }}
                className={cn("min-h-11 rounded-full border px-4 text-lg transition-colors", font === f ? "border-primary bg-primary text-on-primary" : "border-line hover:border-ink/30")}>{f}</button>
            ))}
          </div>
          <div className="mt-4 flex gap-2" role="group" aria-label="Color">
            {COLORS.map((c) => (
              <button key={c.hex} type="button" aria-pressed={color.hex === c.hex} aria-label={c.name} onClick={() => setColor(c)}
                className={cn("grid h-11 w-11 place-items-center rounded-full border-2 transition-transform hover:scale-105", color.hex === c.hex ? "border-primary" : "border-transparent")}>
                <span className="h-8 w-8 rounded-full" style={{ background: c.hex }} />
              </button>
            ))}
          </div>
          <div className="mt-8 grid gap-3 xl:grid-cols-2">
            <ButtonLink href="/crear/" size="lg" variant="dark" className="w-full px-4 text-[15px]"><Sparkles size={18} aria-hidden="true" className="shrink-0 text-brass" />Quiero mi producto personalizado</ButtonLink>
            <ButtonLink href="/p/collar-con-nombre/#personalizar" size="lg" variant="secondary" className="w-full px-4 text-[15px]">Personalizar este collar <ArrowRight size={18} aria-hidden="true" className="shrink-0 transition-transform group-hover/btn:translate-x-1" /></ButtonLink>
          </div>
        </Reveal>
        <div className="relative order-first lg:order-last">
          <div aria-hidden="true" className="absolute -inset-6 rounded-full bg-[radial-gradient(closest-side,#efe3cb,transparent)]" />
          {zone && <TextPreview art="collar" text={text || "Tu nombre"} fontFamily={FONT_FAMILIES[font]!} color={color.hex} zone={zone} label={`Vista previa del collar con “${text}”`} className="relative mx-auto w-full max-w-md overflow-hidden rounded-[2rem] shadow-[var(--shadow-lift)]" />}
        </div>
      </div>
    </section>
  );
}
