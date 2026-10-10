/** Formato del video según lo que grabe el navegador: MP4 (Safari, Chrome nuevo) y si no WebM. */
const CANDIDATES: { mimeType: string; ext: "mp4" | "webm" }[] = [
  { mimeType: "video/mp4;codecs=avc1.42E01E,mp4a.40.2", ext: "mp4" },
  { mimeType: "video/mp4", ext: "mp4" },
  { mimeType: "video/webm;codecs=vp9,opus", ext: "webm" },
  { mimeType: "video/webm;codecs=vp8,opus", ext: "webm" },
  { mimeType: "video/webm", ext: "webm" },
];

export function pickVideoFormat(isSupported: (mime: string) => boolean): { mimeType: string; ext: "mp4" | "webm" } | null {
  return CANDIDATES.find((c) => isSupported(c.mimeType)) ?? null;
}

/** Nombre del archivo: velmar-dia-de-la-madre-historia.mp4 */
export function exportName(themeId: string | null, format: string, ext: string, slide?: number): string {
  return ["velmar", themeId ?? "original", format, slide !== undefined ? `${slide + 1}` : null].filter(Boolean).join("-") + `.${ext}`;
}
