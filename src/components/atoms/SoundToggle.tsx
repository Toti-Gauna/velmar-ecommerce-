"use client";
import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { isMuted, setMuted, subscribeMuted, unlockAudio } from "@/lib/sound";
import { cn } from "@/lib/cn";

/** Habilita el audio con el primer toque o tecla de la página (los navegadores no dejan sonar antes). */
export function useAudioUnlock(): void {
  useEffect(() => {
    const unlock = () => unlockAudio();
    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock);
    return () => { window.removeEventListener("pointerdown", unlock); window.removeEventListener("keydown", unlock); };
  }, []);
}

/** Botón de silencio de la tienda: se recuerda en este navegador. */
export function SoundToggle({ className, withLabel }: { className?: string; withLabel?: boolean }) {
  const on = !useSyncExternalStore(subscribeMuted, isMuted, () => false);
  const label = on ? "Silenciar los sonidos" : "Activar los sonidos";
  return (
    <button type="button" onClick={() => { unlockAudio(); setMuted(on); }} aria-label={label} aria-pressed={on} title={label}
      className={cn("inline-flex items-center gap-2 transition-colors", className)}>
      {on ? <Volume2 size={withLabel ? 18 : 20} aria-hidden="true" /> : <VolumeX size={withLabel ? 18 : 20} aria-hidden="true" />}
      {withLabel && <span>{on ? "Sonidos activados" : "Sonidos en silencio"}</span>}
    </button>
  );
}
