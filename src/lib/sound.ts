import { makeVoice, SOUND_LEVEL, SOUNDS, type SoundName, type Voice } from "./sound-kit";

/**
 * Sonidos de la tienda y del panel sintetizados con WebAudio (pedido de Ignacio, fuera de la especificación): sin
 * archivos, nada se descarga. El audio se habilita con el primer toque (los navegadores lo exigen) y el silencio se
 * recuerda en este navegador, el mismo para la tienda y el panel (8.4.29: antes en el panel no sonaba nada).
 */

export type { SoundName };

const KEY = "velmar-sound";
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let voice: Voice | null = null;
let muted: boolean | null = null;
const listeners = new Set<() => void>();

export function isMuted(): boolean {
  if (muted === null) {
    try { muted = window.localStorage.getItem(KEY) === "off"; } catch { muted = false; }
  }
  return muted;
}

export function setMuted(next: boolean): void {
  muted = next;
  try { window.localStorage.setItem(KEY, next ? "off" : "on"); } catch { /* modo privado: dura la sesión */ }
  listeners.forEach((l) => l());
  if (!next) playSound("nav");
}

export function subscribeMuted(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Crea o reanuda el contexto de audio; se llama en el primer toque o tecla de la página. */
export function unlockAudio(): void {
  if (typeof window === "undefined") return;
  // iOS deja el contexto "interrupted" (llamada, segundo plano): se reanuda con cualquier estado que no sea "running".
  if (ctx) { if (ctx.state !== "running" && ctx.state !== "closed") void ctx.resume(); return; }
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.32;
  master.connect(ctx.destination);
  voice = makeVoice(ctx, master);
}

/** Último momento en que sonó cada prioridad y cada sonido (para no encimar). */
const lastLevel = [-Infinity, -Infinity, -Infinity];
const lastByName = new Map<SoundName, number>();
const DUCK_MS = 150;
const REPEAT_MS = 35;

/** Registro para las pruebas automáticas (qué sonó y en qué orden). No afecta el audio. */
declare global { interface Window { __velmarSounds?: SoundName[] } }

export function playSound(name: SoundName): void {
  if (typeof window === "undefined" || isMuted()) return;
  const now = performance.now();
  const level = SOUND_LEVEL[name];
  // Un momento clave acaba de sonar (ej.: "agregar" tapa el clic del botón y el aviso), o el mismo se repite enseguida.
  // El resto convive: sumar stock y el "listo" de guardarlo suenan los dos.
  if (level < 2 && now - lastLevel[2]! < DUCK_MS) return;
  if (now - (lastByName.get(name) ?? -Infinity) < REPEAT_MS) return;
  lastLevel[level] = now;
  lastByName.set(name, now);
  // Registro para los tests: solo si la página lo pidió (no crece en uso normal).
  window.__velmarSounds?.push(name);
  if (!ctx || !voice) return;
  if (ctx.state !== "running" && ctx.state !== "closed") void ctx.resume();
  try { SOUNDS[name](voice); } catch { /* audio no disponible: la página sigue igual */ }
}
