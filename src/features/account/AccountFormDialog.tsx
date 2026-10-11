"use client";
import type { ReactNode } from "react";
import { Button } from "@/components/atoms/Button";
import { Sheet } from "@/components/motion/Sheet";

interface Props {
  open: boolean;
  title: string;
  intro?: ReactNode;
  saveLabel: string;
  onSave: () => void;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Modal de alta o edición de Mi cuenta (8.4.6, 8.4.14 y 8.4.22): centrado en tablet y escritorio, sube desde abajo en
 * el celular. El alto lo da el contenido con un tope y el cuerpo se desplaza (sin hijos flex-1, ver Sheet).
 */
export function AccountFormDialog({ open, title, intro, saveLabel, onSave, onClose, children }: Props) {
  return (
    <Sheet open={open} onClose={onClose} title={title} side="dialog" className="bg-bg sm:w-[min(94vw,620px)]">
      <form noValidate onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); onSave(); }} className="flex max-h-[94dvh] flex-col sm:max-h-[90dvh]">
        <div className="flex flex-col gap-4 overflow-y-auto p-5 pt-7 sm:p-7">
          <div className="pr-12">
            <h2 className="font-display text-3xl leading-tight">{title}</h2>
            {intro && <p className="mt-1 text-sm text-muted">{intro}</p>}
          </div>
          {children}
        </div>
        <div className="flex shrink-0 justify-end gap-2 border-t border-line bg-surface px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-7">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit">{saveLabel}</Button>
        </div>
      </form>
    </Sheet>
  );
}

/** Id corto para lo que se crea en este navegador. */
export const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
/** Hoy (para vencimientos): función aparte para no leer la hora durante el render. */
export const today = () => new Date();
