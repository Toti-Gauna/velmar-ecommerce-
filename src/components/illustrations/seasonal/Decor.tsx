import type { ComponentType } from "react";
import { Balloon, Bag, Bone, Fedora, Flame, Kite, Mate, Mustache, Paw, PriceTag, Tie, Tulip } from "./everyday";
import { BunnyEars, Champagne, EasterEgg, Firework, Heart, LeprechaunHat, LoveLetter, PartyHat, PotOfGold, Shamrock, Star } from "./celebrate";
import { Bat, Ghost, Gift, Ornament, Pumpkin, SantaHat, Snowflake, Tree, WitchHat } from "./halloween-navidad";
import type { DecorProps } from "./types";

/** Decoraciones de temáticas (SVG propios, sin imágenes externas). */
export const DECOR = {
  "witch-hat": WitchHat, pumpkin: Pumpkin, bat: Bat, ghost: Ghost,
  "santa-hat": SantaHat, tree: Tree, ornament: Ornament, gift: Gift, snowflake: Snowflake,
  champagne: Champagne, firework: Firework, "party-hat": PartyHat, star: Star,
  heart: Heart, "love-letter": LoveLetter, shamrock: Shamrock, "leprechaun-hat": LeprechaunHat, "pot-of-gold": PotOfGold,
  "easter-egg": EasterEgg, "bunny-ears": BunnyEars,
  tulip: Tulip, paw: Paw, bone: Bone, flame: Flame, "price-tag": PriceTag, bag: Bag,
  tie: Tie, mustache: Mustache, fedora: Fedora, mate: Mate, balloon: Balloon, kite: Kite,
} satisfies Record<string, ComponentType<DecorProps>>;

export type DecorKind = keyof typeof DECOR;

export function Decor({ kind, className }: { kind: DecorKind } & DecorProps) {
  const Component = DECOR[kind];
  return <Component className={className} />;
}
