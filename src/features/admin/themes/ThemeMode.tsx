"use client";
import { Select } from "@/components/atoms/Select";
import { Switch } from "@/components/atoms/Switch";
import { currentTheme, nextTheme } from "@/demo/engine/themes";
import type { SeasonId, ThemeSettings } from "@/demo/types";
import { formatDayRange } from "@/lib/date";
import { useAdmin } from "@/stores/admin";
import { useDemoSave } from "../useDemoSave";

const MODES: { value: ThemeSettings["mode"]; label: string }[] = [
  { value: "auto", label: "Automática según la fecha" },
  { value: "fixed", label: "Siempre la que elija" },
  { value: "off", label: "Sin temática" },
];

/** Cómo elige la tienda la temática y qué ve hoy el cliente. */
export function ThemeMode() {
  const settings = useAdmin((s) => s.data.themeSettings);
  const themes = useAdmin((s) => s.data.themes);
  const saveSettings = useAdmin((s) => s.saveThemeSettings);
  const save = useDemoSave();
  const now = new Date();
  const today = currentTheme(now, null);
  const next = nextTheme(now);
  return (
    <section aria-labelledby="modo-title" className="mb-6 grid gap-4 rounded-3xl bg-surface p-5 shadow-[var(--shadow-card)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-3">
        <h2 id="modo-title" className="text-lg font-bold">Cómo se elige</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="tm-mode" className="text-sm font-bold">Modo</label>
            <Select id="tm-mode" value={settings.mode} onChange={(e) => save("Modo de temáticas guardado", () => saveSettings({ mode: e.target.value as ThemeSettings["mode"] }))}>
              {MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="tm-fixed" className="text-sm font-bold">Temática fija</label>
            <Select id="tm-fixed" value={settings.fixedId} disabled={settings.mode !== "fixed"} onChange={(e) => save("Temática fija guardada", () => saveSettings({ fixedId: e.target.value as SeasonId }))}>
              {themes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
          </div>
        </div>
        <Switch checked={settings.showTryButton} onChange={(v) => save(v ? "Botón “Probar temáticas” visible" : "Botón “Probar temáticas” oculto", () => saveSettings({ showTryButton: v }))}
          label="Botón “Probar temáticas” en la tienda" description="Para mostrarle la demo al cliente: cada visitante puede ver cualquier temática solo en su navegador." />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <p className="rounded-2xl bg-accent/60 p-4 text-sm">
          <span className="block text-xs font-bold uppercase tracking-wider text-muted">Hoy ve el cliente</span>
          <strong className="mt-1 block text-xl">{today?.name ?? "Sin temática"}</strong>
          {today && <span className="text-muted">{formatDayRange(today.startsOn, today.endsOn)}</span>}
        </p>
        <p className="rounded-2xl bg-accent/60 p-4 text-sm">
          <span className="block text-xs font-bold uppercase tracking-wider text-muted">Próxima</span>
          <strong className="mt-1 block text-xl">{next?.name ?? "—"}</strong>
          {next && <span className="text-muted">{formatDayRange(next.startsOn, next.endsOn)}</span>}
        </p>
      </div>
    </section>
  );
}
