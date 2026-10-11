import { describe, expect, it } from "vitest";
import { emailChecks, PREHEADER_MAX, stepsDone, SUBJECT_MAX, type EmailCheck } from "@/demo/admin/emails/checks";
import { renderEmail, type EmailContext } from "@/demo/admin/emails/render";
import { emailTemplates, type EmailTemplate } from "@/demo/fixtures/emails";

/** Polish 8.4 · Lote 8: avisos del último paso del editor de emails (8.4.19). */
const ctx: EmailContext = { customerName: "Julián Paz", email: "julian.p@ejemplo.com" };
const tpl = (id: string) => emailTemplates.find((t) => t.id === id)!;
const checks = (t: EmailTemplate, dirty = false) => emailChecks(t, renderEmail(t, ctx), dirty);
const byId = (t: EmailTemplate, dirty = false) => Object.fromEntries(checks(t, dirty).map((c) => [c.id, c])) as Record<EmailCheck["id"], EmailCheck>;

describe("revisar la plantilla (8.4.19)", () => {
  it("las plantillas de muestra pasan los avisos (la de producción no trae botón y lo avisa)", () => {
    expect(emailTemplates.flatMap((t) => checks(t).filter((c) => !c.ok).map((c) => `${t.id}:${c.id}`))).toEqual(["tpl-in-production:button"]);
    for (const t of emailTemplates.filter((x) => x.id !== "tpl-in-production")) expect(stepsDone(t.name, checks(t))).toEqual({ cuando: true, asunto: true, contenido: true, revisar: true });
    expect(stepsDone("x", checks(tpl("tpl-in-production")))).toMatchObject({ contenido: false, revisar: false });
  });
  it("asunto vacío o largo y vista previa vacía o larga avisan, con el paso donde se arregla", () => {
    const t = tpl("tpl-order-created");
    const long = { ...t, subject: [{ kind: "text" as const, text: "x".repeat(SUBJECT_MAX + 5) }], preheader: [{ kind: "text" as const, text: "y".repeat(PREHEADER_MAX + 1) }] };
    expect(byId(long).subject).toMatchObject({ ok: false, step: "asunto", label: `El asunto tiene ${SUBJECT_MAX + 5} letras: en el celular se corta después de ${SUBJECT_MAX}.` });
    expect(byId(long).preheader).toMatchObject({ ok: false, step: "asunto" });
    const empty = { ...t, subject: [], preheader: [] };
    expect(byId(empty).subject.label).toBe("Falta el asunto.");
    expect(byId(empty).preheader.label).toMatch(/^Falta el texto de vista previa/);
    expect(stepsDone(t.name, checks(empty)).asunto).toBe(false);
  });
  it("sin botón avisa; en el cumpleaños, los bloques del pedido no se ven y se cuentan", () => {
    const t = tpl("tpl-order-created");
    expect(byId({ ...t, blocks: t.blocks.filter((b) => b.type !== "button") }).button).toMatchObject({ ok: false, step: "contenido" });
    const pet = tpl("tpl-pet-birthday");
    const withOrder = { ...pet, blocks: [...pet.blocks, { id: "x1", type: "order-card" as const }, { id: "x2", type: "tracking" as const }] };
    expect(byId(withOrder).order).toMatchObject({ ok: false, label: "2 bloques del pedido no se van a ver: este email no tiene pedido." });
    expect(stepsDone(pet.name, checks(withOrder)).contenido).toBe(false);
  });
  it("pausado avisa pero no deja el último paso sin terminar; cambios sin guardar sí", () => {
    const t = { ...tpl("tpl-ready"), active: false };
    expect(byId(t).active).toMatchObject({ ok: false, label: "Pausado: no sale hasta que lo actives." });
    expect(stepsDone(t.name, checks(t)).revisar).toBe(true);
    expect(byId(t, true).saved).toMatchObject({ ok: false, label: "Hay cambios sin guardar." });
    expect(stepsDone(t.name, checks(t, true)).revisar).toBe(false);
    expect(stepsDone("  ", checks(t)).cuando).toBe(false);
  });
});
