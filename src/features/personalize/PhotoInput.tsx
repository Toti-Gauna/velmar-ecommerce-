"use client";
import { Upload } from "lucide-react";
import { useId, useState } from "react";
import { ACCEPTED_PHOTO_TYPES, validatePhoto } from "@/demo/engine/personalization";

/** Selector de foto con validación local de tipo y tamaño. */
export function PhotoInput({ label, hint, onFile }: { label: string; hint: string; onFile: (file: File) => void }) {
  const id = useId();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-bold">{label}</span>
      <label htmlFor={id} className="flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-wood bg-surface px-4 py-3 font-bold text-primary hover:bg-accent has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/50">
        <Upload size={20} aria-hidden="true" />
        <span className="min-w-0 truncate">{name ? `Cambiar foto (${name})` : "Elegir foto"}</span>
        <input
          id={id}
          type="file"
          accept={ACCEPTED_PHOTO_TYPES.join(",")}
          className="sr-only"
          aria-describedby={`${id}-hint${error ? ` ${id}-error` : ""}`}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            const problem = validatePhoto(file);
            setError(problem);
            if (problem) return;
            setName(file.name);
            onFile(file);
          }}
        />
      </label>
      <p id={`${id}-hint`} className="text-xs text-muted">{hint}</p>
      {error && <p id={`${id}-error`} role="alert" className="text-sm font-semibold text-danger">{error}</p>}
    </div>
  );
}
