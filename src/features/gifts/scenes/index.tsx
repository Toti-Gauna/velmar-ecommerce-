"use client";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { GiftSceneId, GiftSceneProps } from "./types";

/** Mientras baja la escena (pocos KB): un brillo quieto en su lugar, sin saltos de tamaño. */
function Loading() {
  return <div aria-hidden="true" className="h-full w-full rounded-full bg-[radial-gradient(closest-side,rgb(243_220_166/0.25),transparent)]" />;
}

/**
 * Una escena por festividad, cada una en su propio archivo: se descarga solo la del regalo que se abre.
 * (next/dynamic necesita el import literal en cada entrada.)
 */
export const GIFT_SCENES: Record<GiftSceneId, ComponentType<GiftSceneProps>> = {
  velmar: dynamic(() => import("./velmar"), { ssr: false, loading: Loading }),
  "dia-de-la-madre": dynamic(() => import("./madre"), { ssr: false, loading: Loading }),
  pascuas: dynamic(() => import("./pascuas"), { ssr: false, loading: Loading }),
  navidad: dynamic(() => import("./navidad"), { ssr: false, loading: Loading }),
  halloween: dynamic(() => import("./halloween"), { ssr: false, loading: Loading }),
  orgullo: dynamic(() => import("./orgullo"), { ssr: false, loading: Loading }),
  "black-friday": dynamic(() => import("./black-friday"), { ssr: false, loading: Loading }),
  "ano-nuevo": dynamic(() => import("./ano-nuevo"), { ssr: false, loading: Loading }),
  "san-valentin": dynamic(() => import("./san-valentin"), { ssr: false, loading: Loading }),
  "dia-del-animal": dynamic(() => import("./animal"), { ssr: false, loading: Loading }),
  "hot-sale": dynamic(() => import("./hot-sale"), { ssr: false, loading: Loading }),
  "revolucion-de-mayo": dynamic(() => import("./mayo"), { ssr: false, loading: Loading }),
  "dia-del-padre": dynamic(() => import("./padre"), { ssr: false, loading: Loading }),
  "dia-de-la-bandera": dynamic(() => import("./bandera"), { ssr: false, loading: Loading }),
  "dia-de-la-independencia": dynamic(() => import("./independencia"), { ssr: false, loading: Loading }),
  "dia-del-amigo": dynamic(() => import("./amigo"), { ssr: false, loading: Loading }),
  "dia-del-nino": dynamic(() => import("./nino"), { ssr: false, loading: Loading }),
};

/** Nombre corto de lo que se abre en cada escena (para el texto de la apertura y el lector de pantalla). */
export const GIFT_SCENE_NAMES: Record<GiftSceneId, string> = {
  velmar: "Caja de regalo de Velmar",
  "dia-de-la-madre": "Una flor que se abre pétalo a pétalo",
  pascuas: "Un huevo de Pascua",
  navidad: "El regalo de Papá Noel",
  halloween: "Una calabaza encantada",
  orgullo: "Un prisma de luz",
  "black-friday": "Una caja fuerte",
  "ano-nuevo": "Una botella de sidra",
  "san-valentin": "Una carta de amor",
  "dia-del-animal": "La cucha de Pancho",
  "hot-sale": "Una caja con mecha",
  "revolucion-de-mayo": "Un paraguas del Cabildo",
  "dia-del-padre": "Una caja de herramientas",
  "dia-de-la-bandera": "La bandera en su mástil",
  "dia-de-la-independencia": "Las puertas de la Casa de Tucumán",
  "dia-del-amigo": "El regalo de Pancho y Lola",
  "dia-del-nino": "Una piñata",
};
