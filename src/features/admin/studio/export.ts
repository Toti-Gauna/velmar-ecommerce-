import { pickVideoFormat } from "@/demo/admin/studio/video";
import { playJingle, type StudioMusic } from "./music";

/** Exportación: imagen PNG del cuadro final y video grabado del canvas (MediaRecorder) con la música opcional. */
export function canvasFor(W: number, H: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  return c;
}

export function toPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("No se pudo generar la imagen"))), "image/png"));
}

/** Descarga un archivo (en el iPhone abre la vista para guardarlo). */
export function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** ¿Se pueden compartir archivos (hoja de compartir del celular: "Guardar imagen", Instagram, WhatsApp)? */
export function canShareFiles(files: File[]): boolean {
  return typeof navigator !== "undefined" && typeof navigator.canShare === "function" && navigator.canShare({ files });
}

export async function shareFiles(files: File[], title: string): Promise<boolean> {
  if (!canShareFiles(files)) return false;
  try { await navigator.share({ files, title }); return true; } catch { return false; }
}

export function videoSupport(): ReturnType<typeof pickVideoFormat> {
  if (typeof MediaRecorder === "undefined" || typeof HTMLCanvasElement.prototype.captureStream !== "function") return null;
  return pickVideoFormat((m) => MediaRecorder.isTypeSupported(m));
}

/**
 * Graba `duration` segundos: dibuja cada cuadro con `draw(t)` y captura el canvas a 30 cuadros por segundo.
 * `onProgress` recibe los segundos grabados. Devuelve el video y su extensión.
 */
export async function recordVideo(canvas: HTMLCanvasElement, draw: (t: number) => void, duration: number, music: StudioMusic, onProgress: (s: number) => void): Promise<{ blob: Blob; ext: string }> {
  const format = videoSupport();
  if (!format) throw new Error("Este navegador no puede grabar video");
  const stream = canvas.captureStream(30);
  let audio: AudioContext | null = null, stopMusic = () => {};
  if (music !== "none") {
    audio = new AudioContext();
    const dest = audio.createMediaStreamDestination();
    stopMusic = playJingle(audio, dest, music, duration);
    dest.stream.getAudioTracks().forEach((track) => stream.addTrack(track));
  }
  const rec = new MediaRecorder(stream, { mimeType: format.mimeType, videoBitsPerSecond: 6_000_000 });
  const chunks: Blob[] = [];
  rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
  const done = new Promise<void>((resolve) => { rec.onstop = () => resolve(); });
  draw(0);
  rec.start(250);
  const start = performance.now();
  await new Promise<void>((resolve) => {
    const tick = () => {
      const t = (performance.now() - start) / 1000;
      draw(Math.min(t, duration));
      onProgress(Math.min(t, duration));
      if (t >= duration) resolve(); else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  rec.stop();
  await done;
  stopMusic();
  stream.getTracks().forEach((track) => track.stop());
  await audio?.close();
  return { blob: new Blob(chunks, { type: format.mimeType.split(";")[0] }), ext: format.ext };
}
