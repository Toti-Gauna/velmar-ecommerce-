"use client";
import type Konva from "konva";
import dynamic from "next/dynamic";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Crosshair } from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { PhotoInput } from "./PhotoInput";

const PhotoStage = dynamic(() => import("@/components/organisms/PhotoStage"), {
  ssr: false,
  loading: () => <Skeleton className="aspect-[1/1.15] w-full" />,
});

export interface PhotoDraft {
  url: string | null;
  zoom: number;
  offset: { x: number; y: number };
}

interface Props {
  draft: PhotoDraft;
  onChange: (d: PhotoDraft) => void;
  stageRef: RefObject<Konva.Stage | null>;
}

const STEP = 12;

export function PhotoEditor({ draft, onChange, stageRef }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(320);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => entry && setWidth(Math.min(420, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const move = (dx: number, dy: number) => onChange({ ...draft, offset: { x: draft.offset.x + dx, y: draft.offset.y + dy } });

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div ref={box} className="w-full max-w-[420px] overflow-hidden rounded-[var(--radius-card)] bg-accent">
        {draft.url ? (
          <PhotoStage imageUrl={draft.url} zoom={draft.zoom} offset={draft.offset} onOffsetChange={(offset) => onChange({ ...draft, offset })} width={width} stageRef={stageRef} />
        ) : (
          <div className="grid aspect-[1/1.15] place-items-center p-6 text-center text-sm text-muted">Subí una foto para ver la vista previa en el velador.</div>
        )}
      </div>
      <div className="flex flex-col gap-5">
        <PhotoInput
          label="Tu foto"
          hint="JPG, PNG o WEBP de hasta 10 MB. En la demo la foto se procesa solo en tu navegador: no se sube a ningún lado."
          onFile={(file) => {
            if (draft.url) URL.revokeObjectURL(draft.url);
            onChange({ url: URL.createObjectURL(file), zoom: 1, offset: { x: 0, y: 0 } });
          }}
        />
        {draft.url && (
          <>
            <div className="flex flex-col gap-2">
              <label htmlFor="zoom" className="text-sm font-bold">Zoom: {Math.round(draft.zoom * 100)}%</label>
              <input id="zoom" type="range" min={1} max={3} step={0.05} value={draft.zoom} onChange={(e) => onChange({ ...draft, zoom: Number(e.target.value) })} className="accent-[var(--color-primary)]" />
            </div>
            <div>
              <p className="mb-2 text-sm font-bold">Encuadre <span className="font-normal text-muted">(también podés arrastrar la foto)</span></p>
              <div className="grid w-fit grid-cols-3 gap-1.5">
                <span />
                <MoveButton label="Mover arriba" onClick={() => move(0, -STEP)}><ArrowUp size={18} /></MoveButton>
                <span />
                <MoveButton label="Mover a la izquierda" onClick={() => move(-STEP, 0)}><ArrowLeft size={18} /></MoveButton>
                <MoveButton label="Centrar" onClick={() => onChange({ ...draft, offset: { x: 0, y: 0 } })}><Crosshair size={18} /></MoveButton>
                <MoveButton label="Mover a la derecha" onClick={() => move(STEP, 0)}><ArrowRight size={18} /></MoveButton>
                <span />
                <MoveButton label="Mover abajo" onClick={() => move(0, STEP)}><ArrowDown size={18} /></MoveButton>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MoveButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-surface text-primary hover:bg-accent">
      <span aria-hidden="true">{children}</span>
    </button>
  );
}
