"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEMO_ADDRESS, normalizeAddresses, normalizeCards, type SavedAddress, type SavedCard } from "@/demo/engine/profile";
import { DEMO_USER } from "@/demo/fixtures/commerce";
import { demoStorage, STORAGE_PREFIX } from "./storage";

/** Direcciones y tarjetas de una cuenta (8.4.6 y 8.4.22). De las tarjetas, solo marca, últimos 4 y vencimiento. */
export interface AccountProfile {
  addresses: SavedAddress[];
  /** Dirección principal (la que se propone primero en el checkout). */
  mainAddress?: string;
  cards: SavedCard[];
}

interface ProfileState {
  byEmail: Record<string, AccountProfile>;
  saveAddress: (email: string, address: SavedAddress) => void;
  removeAddress: (email: string, id: string) => void;
  setMainAddress: (email: string, id: string) => void;
  saveCard: (email: string, card: SavedCard) => void;
  removeCard: (email: string, id: string) => void;
}

const key = (email: string) => email.trim().toLowerCase();
/** La cuenta demo arranca con la dirección de muestra que se veía antes; las demás, vacías. */
export const emptyProfile = (email: string): AccountProfile =>
  key(email) === key(DEMO_USER.email) ? { addresses: [DEMO_ADDRESS], mainAddress: DEMO_ADDRESS.id, cards: [] } : { addresses: [], cards: [] };

/** Perfil de un email (con los valores iniciales si todavía no se tocó). */
export const profileOf = (byEmail: Record<string, AccountProfile>, email: string): AccountProfile => byEmail[key(email)] ?? emptyProfile(email);

export const useProfile = create<ProfileState>()(
  persist(
    (set) => {
      const edit = (email: string, fn: (p: AccountProfile) => AccountProfile) =>
        set((s) => ({ byEmail: { ...s.byEmail, [key(email)]: fn(profileOf(s.byEmail, email)) } }));
      return {
        byEmail: {},
        saveAddress: (email, a) => edit(email, (p) => {
          const addresses = p.addresses.some((x) => x.id === a.id) ? p.addresses.map((x) => (x.id === a.id ? a : x)) : [...p.addresses, a];
          return { ...p, addresses, mainAddress: p.mainAddress && addresses.some((x) => x.id === p.mainAddress) ? p.mainAddress : a.id };
        }),
        removeAddress: (email, id) => edit(email, (p) => {
          const addresses = p.addresses.filter((x) => x.id !== id);
          return { ...p, addresses, mainAddress: p.mainAddress === id ? addresses[0]?.id : p.mainAddress };
        }),
        setMainAddress: (email, id) => edit(email, (p) => ({ ...p, mainAddress: id })),
        saveCard: (email, c) => edit(email, (p) => ({ ...p, cards: [...p.cards.filter((x) => x.id !== c.id), c] })),
        removeCard: (email, id) => edit(email, (p) => ({ ...p, cards: p.cards.filter((x) => x.id !== id) })),
      };
    },
    {
      name: `${STORAGE_PREFIX}profile`, storage: demoStorage, skipHydration: true,
      partialize: ({ byEmail }) => ({ byEmail }),
      // Lo guardado pasa por los mismos filtros: una dirección rota se descarta y de las tarjetas quedan solo los campos
      // permitidos (aunque alguien haya escrito a mano un número completo en el almacenamiento).
      merge: (persisted, current) => {
        const raw = (persisted as { byEmail?: Record<string, Partial<AccountProfile>> } | undefined)?.byEmail;
        const byEmail: Record<string, AccountProfile> = {};
        if (raw && typeof raw === "object") {
          for (const [email, p] of Object.entries(raw)) {
            const addresses = normalizeAddresses(p?.addresses);
            byEmail[email] = { addresses, cards: normalizeCards(p?.cards), mainAddress: addresses.some((a) => a.id === p?.mainAddress) ? p!.mainAddress : addresses[0]?.id };
          }
        }
        return { ...current, byEmail };
      },
    },
  ),
);

/** Perfil reactivo de la cuenta abierta. */
export function useAccountProfile(email: string): AccountProfile {
  const stored = useProfile((s) => s.byEmail[key(email)]);
  return stored ?? emptyProfile(email);
}
