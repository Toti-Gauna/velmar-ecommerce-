import type { ArtKey, ArtView } from "@/demo/types";
import { cn } from "@/lib/cn";
import { BowlDog, BowlWood, Collar, LeashHanger, NfcKeychain, NfcTag } from "./pets";
import { CandlePoodle, Dachshund, Diffuser, FigurePair, HomeSpray, LampPainted, LampPhoto, MdpSign } from "./home";

type ArtComponent = (props: { tint?: string }) => React.JSX.Element;

const ART: Record<ArtKey, ArtComponent> = {
  "bowl-dog": BowlDog, "bowl-wood": BowlWood, collar: Collar, "nfc-tag": NfcTag, "nfc-keychain": NfcKeychain,
  "lamp-photo": LampPhoto, "lamp-painted": LampPainted, "leash-hanger": LeashHanger, dachshund: Dachshund,
  "figure-pair": FigurePair, "candle-poodle": CandlePoodle, "home-spray": HomeSpray, diffuser: Diffuser, "mdp-sign": MdpSign,
};

const BACKGROUNDS: Record<ArtView, string> = { front: "#f3ead9", detail: "#efe3cc", context: "#e9efe3" };

function ContextScene() {
  return (
    <g aria-hidden="true">
      <rect x="0" y="0" width="400" height="300" fill="#f4efe6" />
      <rect x="0" y="300" width="400" height="100" fill="#d9bf98" />
      <path d="M0 300h400" stroke="#c9a77a" strokeWidth="6" />
      <path d="M346 300c-4-40 4-80 24-110M346 300c-20-30-40-46-64-50M350 300c10-34 30-52 44-56" stroke="#6f8f5a" strokeWidth="8" fill="none" strokeLinecap="round" />
      <ellipse cx="370" cy="190" rx="14" ry="26" fill="#6f8f5a" transform="rotate(30 370 190)" />
      <ellipse cx="284" cy="250" rx="12" ry="24" fill="#86a56f" transform="rotate(-60 284 250)" />
    </g>
  );
}

export interface ProductArtProps {
  art: ArtKey;
  view?: ArtView;
  tint?: string;
  label: string;
  className?: string;
  showBadge?: boolean;
}

/** Imagen ilustrativa de producto (placeholder vectorial hasta tener fotos reales de Velmar). */
export function ProductArt({ art, view = "front", tint, label, className, showBadge = true }: ProductArtProps) {
  const Art = ART[art];
  const transform = view === "detail" ? "translate(-140 -120) scale(1.7)" : view === "context" ? "translate(40 40) scale(0.8)" : undefined;
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <svg viewBox="0 0 400 400" role="img" aria-label={`${label} (imagen ilustrativa)`} className="block h-full w-full">
        <rect width="400" height="400" fill={BACKGROUNDS[view]} />
        {view === "context" ? <ContextScene /> : <ellipse cx="200" cy="336" rx="140" ry="16" fill="#23251d" opacity=".07" />}
        <g transform={transform}>
          <Art tint={tint} />
        </g>
      </svg>
      {showBadge && (
        <span className="absolute bottom-2 left-2 rounded-full bg-white/85 px-2 py-0.5 text-[11px] font-semibold text-muted">
          Imagen ilustrativa
        </span>
      )}
    </div>
  );
}
