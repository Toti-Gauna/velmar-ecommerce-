"use client";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { TOKEN_LABEL, type EmailToken, type Inline } from "@/demo/fixtures/emails";
import { cn } from "@/lib/cn";

/**
 * Texto con datos dinámicos como fichas visuales (pedido de Ignacio: nada de llaves ni códigos a la vista).
 * Es un `contentEditable` con texto común y fichas `<span contenteditable="false">` que se insertan con un toque
 * desde la paleta, se borran con la tecla de borrar y se guardan como partes { texto | ficha }.
 */

const CHIP = "chip-token mx-0.5 inline-flex select-none items-center rounded-full bg-primary/12 px-2 py-px align-baseline text-[0.92em] font-bold text-primary ring-1 ring-primary/25";

function toNodes(value: Inline, multiline: boolean): Node[] {
  return value.flatMap((p): Node[] => {
    if (p.kind === "token") {
      const span = document.createElement("span");
      span.contentEditable = "false";
      span.dataset.token = p.token;
      span.className = CHIP;
      span.textContent = TOKEN_LABEL[p.token];
      return [span];
    }
    return [document.createTextNode(multiline ? p.text : p.text.replace(/\n/g, " "))];
  });
}

/** Lee el contenido editable y lo vuelve partes; une textos seguidos y descarta los vacíos. */
export function parseNodes(root: Node, multiline: boolean): Inline {
  const out: Inline = [];
  const text = (s: string) => {
    if (!s) return;
    const last = out.at(-1);
    if (last?.kind === "text") last.text += s;
    else out.push({ kind: "text", text: s });
  };
  const walk = (node: Node, first: boolean) => {
    if (node.nodeType === Node.TEXT_NODE) return text((node.textContent ?? "").replace(/​/g, ""));
    if (!(node instanceof HTMLElement)) return;
    const token = node.dataset.token as EmailToken | undefined;
    if (token && token in TOKEN_LABEL) { out.push({ kind: "token", token }); return; }
    if (node.tagName === "BR") return text(multiline ? "\n" : " ");
    // Chrome envuelve cada línea nueva en un <div>
    if ((node.tagName === "DIV" || node.tagName === "P") && !first) text(multiline ? "\n" : " ");
    node.childNodes.forEach((c, i) => walk(c, i === 0));
  };
  root.childNodes.forEach((c, i) => walk(c, i === 0));
  return out;
}

interface Handle {
  insert: (token: EmailToken) => void;
  tokens: EmailToken[];
}

interface ChipCtx {
  register: (id: string, handle: Handle | null) => void;
  activate: (id: string) => void;
  active: string | null;
  insert: (token: EmailToken) => boolean;
  allowed: (token: EmailToken) => boolean;
}

const Ctx = createContext<ChipCtx | null>(null);

/** Sabe qué campo se tocó último para insertar ahí la ficha elegida en la paleta. */
export function ChipEditorsProvider({ children }: { children: ReactNode }) {
  const handles = useRef(new Map<string, Handle>());
  const [active, setActive] = useState<string | null>(null);
  const value: ChipCtx = {
    register: (id, h) => { if (h) handles.current.set(id, h); else handles.current.delete(id); },
    activate: setActive,
    active,
    insert: (token) => {
      const h = active ? handles.current.get(active) : undefined;
      if (!h || !h.tokens.includes(token)) return false;
      h.insert(token);
      return true;
    },
    allowed: (token) => {
      const h = active ? handles.current.get(active) : undefined;
      return !!h && h.tokens.includes(token);
    },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useChipEditors(): ChipCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("ChipEditor fuera de ChipEditorsProvider");
  return ctx;
}

interface Props {
  id: string;
  label: string;
  value: Inline;
  onChange: (value: Inline) => void;
  /** Fichas que se pueden insertar en este campo. */
  tokens: EmailToken[];
  multiline?: boolean;
  placeholder?: string;
  className?: string;
}

export function ChipEditor({ id, label, value, onChange, tokens, multiline = false, placeholder, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const range = useRef<Range | null>(null);
  const emitted = useRef<string>("");
  const ctx = useChipEditors();
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  const isActive = ctx.active === id;
  const json = JSON.stringify(value);

  // El DOM editable se reconstruye solo cuando el valor cambia desde afuera (cargar, restaurar, deshacer):
  // si se reconstruyera en cada tecla, el cursor saltaría al principio.
  useEffect(() => {
    const el = ref.current;
    if (!el || json === emitted.current) return;
    el.replaceChildren(...toNodes(JSON.parse(json) as Inline, multiline));
    emitted.current = json;
  }, [json, multiline]);

  const emit = () => {
    const el = ref.current;
    if (!el) return;
    const next = parseNodes(el, multiline);
    emitted.current = JSON.stringify(next);
    onChange(next);
  };
  const save = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount && ref.current?.contains(sel.getRangeAt(0).commonAncestorContainer)) range.current = sel.getRangeAt(0).cloneRange();
  };

  // El registro vive en un efecto: la función de insertar usa refs (siempre el DOM y el cursor vigentes).
  const tokensKey = tokens.join(",");
  useEffect(() => {
    const el = ref.current;
    ctx.register(id, {
      tokens: tokensKey.split(",") as EmailToken[],
      insert: (token) => {
        if (!el) return;
        const [chip] = toNodes([{ kind: "token", token }], multiline);
        const space = document.createTextNode(" ");
        let r = range.current;
        if (!r || !el.contains(r.commonAncestorContainer)) { r = document.createRange(); r.selectNodeContents(el); r.collapse(false); }
        r.deleteContents();
        r.insertNode(space);
        r.insertNode(chip!);
        const after = document.createRange();
        after.setStartAfter(space);
        after.collapse(true);
        const sel = window.getSelection();
        el.focus();
        sel?.removeAllRanges();
        sel?.addRange(after);
        range.current = after.cloneRange();
        const next = parseNodes(el, multiline);
        emitted.current = JSON.stringify(next);
        onChangeRef.current(next);
      },
    });
    return () => ctx.register(id, null);
    // ctx cambia en cada render del proveedor; el registro solo depende del campo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, tokensKey, multiline]);
  return (
    <div className={cn("relative", className)}>
      <div ref={ref} id={id} role="textbox" aria-label={label} aria-multiline={multiline} contentEditable suppressContentEditableWarning tabIndex={0}
        data-placeholder={placeholder}
        onFocus={() => { ctx.activate(id); save(); }}
        onInput={() => { emit(); save(); }} onKeyUp={save} onMouseUp={save}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          e.preventDefault();
          if (multiline) document.execCommand("insertText", false, "\n");
        }}
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData.getData("text/plain");
          document.execCommand("insertText", false, multiline ? text : text.replace(/\s*\n\s*/g, " "));
        }}
        className={cn("chip-editor min-h-11 w-full whitespace-pre-wrap break-words rounded-2xl border bg-surface px-3.5 py-2.5 text-[15px] leading-relaxed outline-none transition-colors focus:border-primary focus-visible:ring-4 focus-visible:ring-primary/12",
          isActive ? "border-primary/60" : "border-ink/12", multiline && "min-h-24")} />
    </div>
  );
}
