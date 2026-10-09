"use client";
import { useState, type DragEvent } from "react";

/** Arrastrar y soltar pedidos entre días (escritorio). En el celular se reprograma desde la ficha de entrega. */
export interface CalendarDnd {
  dragging: string | null;
  over: string | null;
  start: (code: string) => void;
  end: () => void;
  zone: (day: string, closed: boolean) => {
    onDragOver: (e: DragEvent) => void;
    onDragLeave: (e: DragEvent) => void;
    onDrop: (e: DragEvent) => void;
  };
}

export function useCalendarDnd(onMove: (code: string, day: string) => void): CalendarDnd {
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const end = () => { setDragging(null); setOver(null); };
  return {
    dragging, over, start: setDragging, end,
    zone: (day, closed) => ({
      onDragOver: (e) => {
        if (!dragging) return;
        // Los días cerrados no aceptan el pedido: el cursor muestra "no permitido".
        if (closed) { e.dataTransfer.dropEffect = "none"; return; }
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (over !== day) setOver(day);
      },
      onDragLeave: (e) => {
        if (over === day && !e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(null);
      },
      onDrop: (e) => {
        e.preventDefault();
        const code = e.dataTransfer.getData("text/plain") || dragging;
        end();
        if (code) onMove(code, day);
      },
    }),
  };
}
