"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/demo/engine/cart-types";
import type { Quote } from "@/demo/engine/pricing";
import { normalizeCards, type SavedCard } from "@/demo/engine/profile";
import type { FulfillmentType, PaymentMethod } from "@/demo/types";
import { demoStorage, STORAGE_PREFIX } from "./storage";
import { playSound } from "@/lib/sound";

export interface Contact {
  name: string;
  email: string;
  phone: string;
}

export interface Address {
  street: string;
  number: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface DemoOrder {
  code: string;
  token: string;
  createdAt: string;
  contact: Contact;
  fulfillment: FulfillmentType;
  paymentMethod: PaymentMethod;
  lines: CartLine[];
  quote: Omit<Quote, "lines">;
  asAccount: boolean;
  /** Códigos de los regalos de este pedido (ver stores/gifts). */
  gifts?: string[];
  /** Pago con tarjeta (8.4.22): solo marca y últimos 4, ej. "Visa terminada en 4242". */
  card?: string;
}

interface CheckoutState {
  contact: Contact;
  address: Address;
  fulfillment: FulfillmentType | null;
  paymentMethod: PaymentMethod | null;
  /** Tarjeta elegida (8.4.22): marca, últimos 4 y vencimiento; nunca el número completo ni el código. */
  card: SavedCard | null;
  acceptedTerms: boolean;
  lastOrder: DemoOrder | null;
  patch: (data: Partial<Omit<CheckoutState, "patch" | "reset" | "placeOrder">>) => void;
  placeOrder: (order: DemoOrder) => void;
  reset: () => void;
}

const empty = {
  contact: { name: "", email: "", phone: "" },
  address: { street: "", number: "", city: "Mar del Plata", province: "Buenos Aires", postalCode: "" },
  fulfillment: null,
  paymentMethod: null,
  card: null,
  acceptedTerms: false,
};

export const useCheckout = create<CheckoutState>()(
  persist(
    (set) => ({
      ...empty,
      lastOrder: null,
      patch: (data) => set(data),
      placeOrder: (order) => { set({ ...empty, lastOrder: order }); playSound("purchase"); },
      reset: () => set({ ...empty, lastOrder: null }),
    }),
    {
      name: `${STORAGE_PREFIX}checkout`, storage: demoStorage, skipHydration: true,
      // La tarjeta elegida (8.4.22) llegó después: si falta o viene rota, queda sin elegir.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<CheckoutState>;
        return { ...current, ...p, card: normalizeCards(p.card ? [p.card] : [])[0] ?? null };
      },
    },
  ),
);
