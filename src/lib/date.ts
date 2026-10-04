/** Fechas en español de Argentina, siempre en hora de Buenos Aires (determinista en cualquier equipo). */
const TZ = "America/Argentina/Buenos_Aires";
const dateTime = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: TZ });
const dateOnly = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short", year: "numeric", timeZone: TZ });
const dayKey = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: TZ });

export function formatDateTime(iso: string): string {
  return dateTime.format(new Date(iso));
}

export function formatDate(isoOrDay: string): string {
  return dateOnly.format(new Date(isoOrDay.length === 10 ? `${isoOrDay}T12:00:00-03:00` : isoOrDay));
}

/** "2026-10-04" en hora argentina. */
export function toDayKey(iso: string): string {
  return dayKey.format(new Date(iso));
}
