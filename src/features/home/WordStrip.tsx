import { ScrollStrip } from "@/components/motion/ScrollStrip";

const WORDS = ["Comederos", "Collares con nombre", "Llaveros NFC", "Veladores con foto", "Velas", "Hecho a pedido", "Mar del Plata"];

export function WordStrip() {
  return (
    <div aria-hidden="true" className="-mx-4 border-y border-line py-6 sm:-mx-6">
      <ScrollStrip>
        {[...WORDS, ...WORDS].map((w, i) => (
          <span key={i} className="font-display flex items-center gap-10 text-4xl text-ink/80 sm:text-6xl">
            <span className={i % 2 ? "italic text-primary" : undefined}>{w}</span>
            <svg viewBox="0 0 48 44" className="h-6 w-6 text-brass"><path d="M8 22 24 8l16 14M8 36 24 22l16 14" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        ))}
      </ScrollStrip>
    </div>
  );
}
