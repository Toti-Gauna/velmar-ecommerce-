import { beats, easeOutBack, easeOutExpo, productSlot, span } from "@/demo/admin/studio/timeline";
import { formatARS } from "@/lib/money";
import { drawBackdrop } from "./backdrop";
import { DISPLAY, SANS, drawCard, drawLines, drawLogo, drawPill, wrap } from "./paint";
import { raster, sealSprite } from "./sprites";
import type { StudioScene } from "./types";

/** Encabezado: bajada de la fecha, titular y texto, con entrada en cascada. Devuelve el y final. */
function heading(ctx: CanvasRenderingContext2D, s: StudioScene, t: number, x: number, y: number, maxW: number, titleSize: number, align: CanvasTextAlign = "left") {
  const b = beats(s.duration);
  ctx.fillStyle = s.look.accent;
  ctx.font = `800 ${Math.round(titleSize * 0.32)}px ${SANS}`;
  drawLines(ctx, [s.texts.eyebrow.toUpperCase().split("").join(" ")], x, y, 0, easeOutExpo(span(t, b.eyebrow, 0.8)), align);
  ctx.fillStyle = "#ffffff";
  ctx.font = `600 ${titleSize}px ${DISPLAY}`;
  let end = drawLines(ctx, wrap(ctx, s.texts.title, maxW, 3), x, y + titleSize * 1.15, titleSize * 1.04, easeOutExpo(span(t, b.title, 1)), align);
  ctx.fillStyle = "rgba(255,255,255,0.86)";
  ctx.font = `500 ${Math.round(titleSize * 0.38)}px ${SANS}`;
  end = drawLines(ctx, wrap(ctx, s.texts.subtitle, maxW * 0.95, 3), x, end + titleSize * 0.18, titleSize * 0.5, easeOutExpo(span(t, b.title + 0.3, 1)), align);
  return end;
}

/** Sello de oferta circular que entra con rebote. */
function offerSeal(ctx: CanvasRenderingContext2D, s: StudioScene, t: number, cx: number, cy: number, r: number) {
  if (!s.offer || !s.showOffer) return;
  const k = easeOutBack(span(t, beats(s.duration).offer, 0.7));
  if (k <= 0) return;
  const offer = s.offer;
  // El sello (con su sombra) se arma una vez y se escala en la entrada.
  const fontReady = typeof document !== "undefined" && document.fonts.check(`800 40px ${SANS}`);
  const sprite = sealSprite(`${s.look.accent}|${s.look.accentInk}|${offer.label}|${offer.code}|${r}|${fontReady}`, r * 2 + 80, (c) => {
    c.translate(r + 40, r + 40);
    c.rotate(-0.12);
    c.shadowColor = "rgba(0,0,0,0.35)"; c.shadowBlur = 30; c.shadowOffsetY = 12;
    c.fillStyle = s.look.accent;
    c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.fill();
    c.shadowColor = "transparent";
    c.fillStyle = s.look.accentInk;
    c.textAlign = "center"; c.textBaseline = "middle";
    c.font = `800 ${r * 0.44}px ${SANS}`;
    c.fillText(offer.label.replace(" OFF", ""), 0, -r * 0.16);
    c.font = `800 ${r * 0.2}px ${SANS}`;
    c.fillText(offer.label.includes("OFF") ? `OFF · ${offer.code}` : offer.code, 0, r * 0.3);
  });
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(k, k);
  ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
  ctx.restore();
}

/** Nombre y precio (tachado si hay precio con cupón). */
function priceTag(ctx: CanvasRenderingContext2D, s: StudioScene, index: number, x: number, y: number, size: number, align: CanvasTextAlign, alpha: number) {
  const p = s.products[index]?.data;
  if (!p) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.textAlign = align; ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#ffffff";
  ctx.font = `600 ${size}px ${DISPLAY}`;
  ctx.fillText(p.name, x, y);
  if (s.showPrice) {
    const deal = s.showOffer && p.offerPrice !== null;
    ctx.font = `800 ${size * 1.1}px ${SANS}`;
    ctx.fillStyle = deal ? s.look.accent : "#ffffff";
    const main = formatARS(deal ? p.offerPrice! : p.price);
    ctx.fillText(main, x, y + size * 1.3);
    if (deal) {
      const w = ctx.measureText(main).width;
      ctx.font = `600 ${size * 0.7}px ${SANS}`;
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      const old = formatARS(p.price), ow = ctx.measureText(old).width;
      const ox = align === "center" ? x + w / 2 + 16 + ow / 2 : x + w + 18;
      ctx.textAlign = align === "center" ? "center" : "left";
      ctx.fillText(old, ox, y + size * 1.3);
      ctx.fillRect(ox - (align === "center" ? ow / 2 : 0), y + size * 1.3 - size * 0.24, ow, 3);
    }
  }
  ctx.restore();
}

/** Decoración protagonista y personajes de la temática, flotando. */
function heroArt(ctx: CanvasRenderingContext2D, s: StudioScene, t: number, x: number, y: number, size: number) {
  const k = easeOutExpo(span(t, 0.6, 1.2));
  const bob = Math.sin(t * 1.6) * size * 0.03;
  ctx.save();
  ctx.globalAlpha *= k;
  if (s.cast.length) s.cast.forEach((img, i) => ctx.drawImage(raster(img, size * 0.9, size * 0.69), x + i * size * 0.62 - size * 0.3, y + bob * (i ? -1 : 1) + (1 - k) * 40));
  else if (s.hero) ctx.drawImage(raster(s.hero, size, size), x, y + bob + (1 - k) * 40);
  ctx.restore();
}

export function drawPost(ctx: CanvasRenderingContext2D, s: StudioScene, t: number) {
  const { W, H } = s;
  drawBackdrop(ctx, s.look, t, W, H);
  heroArt(ctx, s, t, W * 0.7, H * 0.05, 210);
  const slot = productSlot(t, s.duration, s.products.length);
  const card = s.products[slot.index];
  const e = easeOutExpo(slot.enter);
  drawCard(ctx, card?.img ?? null, 560, 250 + (1 - e) * 80, 430, 538, { rotate: -3 + (1 - e) * 6, alpha: e });
  offerSeal(ctx, s, t, 960, 280, 92);
  heading(ctx, s, t, 80, 120, 450, 74);
  priceTag(ctx, s, slot.index, 80, 760, 40, "left", easeOutExpo(span(t, beats(s.duration).product + 0.4, 0.8)));
  const c = easeOutExpo(span(t, beats(s.duration).cta, 0.8));
  ctx.save(); ctx.globalAlpha *= c;
  drawPill(ctx, s.texts.cta, W - 80, 920 + (1 - c) * 30, { bg: s.look.accent, ink: s.look.accentInk, size: 28, align: "right" });
  ctx.restore();
  drawLogo(ctx, 80, 935, 46, "#ffffff");
}

export function drawStory(ctx: CanvasRenderingContext2D, s: StudioScene, t: number) {
  const { W, H } = s;
  drawBackdrop(ctx, s.look, t, W, H);
  heroArt(ctx, s, t, W * 0.68, 120, 230);
  heading(ctx, s, t, W / 2, 330, 880, 96, "center");
  const slot = productSlot(t, s.duration, s.products.length);
  const e = easeOutExpo(slot.enter);
  drawCard(ctx, s.products[slot.index]?.img ?? null, 230 + (1 - e) * 120, 760, 620, 760, { rotate: -2 + (1 - e) * 5, alpha: e });
  offerSeal(ctx, s, t, 850, 790, 110);
  priceTag(ctx, s, slot.index, W / 2, 1610, 52, "center", e);
  const c = easeOutExpo(span(t, beats(s.duration).cta, 0.8));
  ctx.save(); ctx.globalAlpha *= c;
  drawPill(ctx, s.texts.cta, W / 2, 1740 + (1 - c) * 30, { bg: s.look.accent, ink: s.look.accentInk, size: 32, align: "center" });
  ctx.restore();
  drawLogo(ctx, W / 2 - 115, 230, 44, "#ffffff");
}
