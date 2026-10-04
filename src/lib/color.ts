/** Oscurece (amount < 0) o aclara (amount > 0) un color hex. Solo para ilustraciones. */
export function shade(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const ch = (shift: number) => {
    const v = (n >> shift) & 255;
    const t = amount < 0 ? 0 : 255;
    return Math.round(v + (t - v) * Math.abs(amount));
  };
  return `#${[16, 8, 0].map((s) => ch(s).toString(16).padStart(2, "0")).join("")}`;
}
