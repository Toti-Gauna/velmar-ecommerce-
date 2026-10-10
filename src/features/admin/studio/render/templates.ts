import { beats, easeOutBack, easeOutExpo, productSlot, span } from "@/demo/admin/studio/timeline";
import { formatARS } from "@/lib/money";
import { drawBackdrop } from "./backdrop";
import { DISPLAY, SANS, drawCard, drawLines, drawLogo, drawPill, fitLine, spaced, wrap } from "./paint";
import { raster, sealSprite } from "./sprites";
import type { StudioScene } from "./types";

/** Encabezado: bajada de la fecha, titular y texto, con entrada en cascada. Devuelve el y final. */
function heading(ctx: CanvasRenderingContext2D, s: StudioScene, t: number, x: number, y: number, maxW: number, titleSize: number, align: CanvasTextAlign = "left") {
  const b = beats(s.duration);
  ctx.fillStyle = s.look.accent;
  ctx.font = `800 ${Math.round(titleSize * 0.32)}px ${SANS}`;
  drawLines(ctx, [fitLine(ctx, spaced(s.texts.eyebrow), maxW)], x, y, 0, easeOutExpo(span(t, b.eyebrow, 0.8)), align);
  ctx.fillStyle = "#ffffff";
  ctx.font = `600 ${titleSize}px ${DISPLAY}`;
  let end = drawLines(ctx, wrap(ctx, s.texts.title, maxW, 3), x, y + titleSize * 1.15, titleSize * 1.04, easeOutExpo(span(t, b.title, 1)), align);
  ctx.fillStyle = "rgba(255,255,255,0.86)";
  ctx.font = `500 ${Math.round(titleSize * 0.38)}px ${SANS}`;
  end = drawLines(ctx, wrap(ctx, s.texts.subtitle, maxW * 0.95, 3), x, end + titleSize * 0.18, titleSize * 0.5, easeOutExpo(span(t, b.title + 0.3, 1)), align);
  return end;
}

/** Sello de oferta circular que entra con rebote; si el cupón tiene mínimo, va escrito debajo (no se promete de más). */
function offerSeal(ctx: CanvasRenderingContext2D, s: StudioScene, t: number, cx: number, cy: number, r: number) {
  if (!s.offer || !s.showOffer) return;
  const k = easeOutBack(span(t, beats(s.duration).offer, 0.7));
  if (k <= 0) return;
  const offer = s.offer;
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
    c.fillText(fitLine(c, offer.label.replace(" OFF", ""), r * 1.7), 0, -r * 0.16);
    c.font = `800 ${r * 0.2}px ${SANS}`;
    c.fillText(fitLine(c, offer.label.includes("OFF") ? `OFF · ${offer.code}` : offer.code, r * 1.6), 0, r * 0.3);
  });
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(k, k);
  ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
  ctx.restore();
  if (offer.condition) {
    ctx.save();
    ctx.globalAlpha *= Math.min(1, k);
    drawPill(ctx, offer.condition, cx, cy + r + 18, { bg: "rgba(0,0,0,0.55)", ink: "#ffffff", size: Math.round(r * 0.2), align: "center", padX: 18 });
    ctx.restore();
  }
}

/** Nombre (hasta 2 líneas) y precio (tachado si hay precio con cupón). */
function priceTag(ctx: CanvasRenderingContext2D, s: StudioScene, index: number, x: number, y: number, size: number, maxW: number, align: CanvasTextAlign, alpha: number, maxLines = 2) {
  const p = s.products[index]?.data;
  if (!p) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.fillStyle = "#ffffff";
  ctx.font = `600 ${size}px ${DISPLAY}`;
  const end = drawLines(ctx, wrap(ctx, p.name, maxW, maxLines), x, y, size * 1.08, 1, align);
  if (s.showPrice) {
    const py = end + size * 0.3;
    const deal = s.showOffer && p.offerPrice !== null;
    ctx.textAlign = align; ctx.textBaseline = "alphabetic";
    ctx.font = `800 ${size * 1.1}px ${SANS}`;
    ctx.fillStyle = deal ? s.look.accent : "#ffffff";
    const main = formatARS(deal ? p.offerPrice! : p.price);
    ctx.fillText(main, x, py);
    if (deal) {
      const w = ctx.measureText(main).width;
      ctx.font = `600 ${size * 0.7}px ${SANS}`;
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      const old = formatARS(p.price), ow = ctx.measureText(old).width;
      const ox = align === "center" ? x + w / 2 + 16 + ow / 2 : x + w + 18;
      ctx.textAlign = align === "center" ? "center" : "left";
      ctx.fillText(old, ox, py);
      ctx.fillRect(ox - (align === "center" ? ow / 2 : 0), py - size * 0.24, ow, 3);
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

function cta(ctx: CanvasRenderingContext2D, s: StudioScene, t: number, x: number, y: number, size: number, align: "center" | "right", maxWidth: number) {
  const c = easeOutExpo(span(t, beats(s.duration).cta, 0.8));
  ctx.save();
  ctx.globalAlpha *= c;
  drawPill(ctx, s.texts.cta, x, y + (1 - c) * 30, { bg: s.look.accent, ink: s.look.accentInk, size, align, maxWidth });
  ctx.restore();
}

export function drawPost(ctx: CanvasRenderingContext2D, s: StudioScene, t: number) {
  const { W, H } = s;
  drawBackdrop(ctx, s.look, t, W, H);
  heroArt(ctx, s, t, W * 0.7, H * 0.05, 210);
  const slot = productSlot(t, s.duration, s.products.length);
  const e = easeOutExpo(slot.enter);
  drawCard(ctx, s.products[slot.index]?.img ?? null, 560, 250 + (1 - e) * 80, 430, 538, { rotate: -3 + (1 - e) * 6, alpha: e });
  offerSeal(ctx, s, t, 960, 280, 92);
  heading(ctx, s, t, 80, 120, 450, 74);
  priceTag(ctx, s, slot.index, 80, 740, 40, 440, "left", easeOutExpo(span(t, beats(s.duration).product + 0.4, 0.8)));
  cta(ctx, s, t, W - 80, 920, 28, "right", 600);
  drawLogo(ctx, 80, 935, 46, "#ffffff");
}

/** Historia 9:16: fuera de la franja de arriba (≈250 px, el nombre de la cuenta) y de la de abajo (≈220 px, responder). */
export function drawStory(ctx: CanvasRenderingContext2D, s: StudioScene, t: number) {
  const { W, H } = s;
  drawBackdrop(ctx, s.look, t, W, H);
  heroArt(ctx, s, t, W * 0.74, 140, 180);
  drawLogo(ctx, W / 2 - 115, 280, 44, "#ffffff");
  const end = heading(ctx, s, t, W / 2, 400, 880, 92, "center");
  const slot = productSlot(t, s.duration, s.products.length);
  const e = easeOutExpo(slot.enter);
  // La tarjeta arranca debajo del texto real y se achica si el texto es largo (nombre y precio siempre a la vista).
  const top = Math.max(820, end + 50), bottom = 1400, ch = bottom - top, cw = Math.round(ch * 0.82);
  drawCard(ctx, s.products[slot.index]?.img ?? null, (W - cw) / 2 + (1 - e) * 120, top, cw, ch, { rotate: -2 + (1 - e) * 5, alpha: e });
  offerSeal(ctx, s, t, (W + cw) / 2 - 10, top + 30, 100);
  priceTag(ctx, s, slot.index, W / 2, 1480, 50, 900, "center", e, 1);
  cta(ctx, s, t, W / 2, 1625, 32, "center", 900);
}
