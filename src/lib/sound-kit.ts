/**
 * Recetas de los sonidos (WebAudio, sin archivos). Cada una arma notas cortas sobre una "voz" que ya está conectada a
 * la salida. Los de interfaz (8.4.29, pedido de Ignacio: "que toda la página tenga sonidos") son suaves y cortos; los de
 * momentos clave (agregar, comprar, ganar) se escuchan más.
 */

export type SoundName =
  // Momentos clave
  | "add" | "favorite" | "unfavorite" | "coupon" | "tick" | "spin" | "win" | "purchase" | "error" | "hit" | "open"
  // Respuestas (8.4.29)
  | "success" | "remove" | "product"
  // Interfaz (8.4.29)
  | "nav" | "tap" | "select" | "toggleOn" | "toggleOff" | "type" | "modalOpen" | "modalClose" | "step" | "back" | "up" | "down" | "info";

/**
 * Prioridad: los momentos clave (2) tapan a los demás si sonaron hace instantes (así "agregar al carrito" no lleva
 * además el clic del botón ni el aviso de "agregado"). Respuestas (1) e interfaz (0) conviven.
 */
export const SOUND_LEVEL: Record<SoundName, 0 | 1 | 2> = {
  add: 2, favorite: 2, unfavorite: 2, coupon: 2, tick: 2, spin: 2, win: 2, purchase: 2, error: 2, hit: 2, open: 2,
  success: 1, remove: 1, product: 1,
  nav: 0, tap: 0, select: 0, toggleOn: 0, toggleOff: 0, type: 0, modalOpen: 0, modalClose: 0, step: 0, back: 0, up: 0, down: 0, info: 0,
};

interface ToneOpts { type?: OscillatorType; gain?: number; attack?: number; slideTo?: number }
interface NoiseOpts { gain?: number; from?: number; to?: number }

export interface Voice {
  tone: (freq: number, at: number, dur: number, opts?: ToneOpts) => void;
  noise: (at: number, dur: number, opts?: NoiseOpts) => void;
}

/** Ruido blanco de un segundo, armado una sola vez y reusado (antes se generaba en cada clic). */
let noiseBuffer: AudioBuffer | null = null;
function whiteNoise(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) return noiseBuffer;
  noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return noiseBuffer;
}

export function makeVoice(ctx: AudioContext, out: AudioNode): Voice {
  return {
    tone(freq, at, dur, { type = "sine", gain = 0.5, attack = 0.006, slideTo } = {}) {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      const t = ctx.currentTime + at;
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur * 0.8);
      env.gain.setValueAtTime(0.0001, t);
      env.gain.exponentialRampToValueAtTime(gain, t + attack);
      env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(env).connect(out);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    },
    noise(at, dur, { gain = 0.3, from = 2500, to } = {}) {
      const src = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const env = ctx.createGain();
      const t = ctx.currentTime + at;
      src.buffer = whiteNoise(ctx);
      filter.type = "bandpass";
      filter.Q.value = 1.4;
      filter.frequency.setValueAtTime(from, t);
      if (to) filter.frequency.exponentialRampToValueAtTime(to, t + dur);
      env.gain.setValueAtTime(gain, t);
      env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(filter).connect(env).connect(out);
      src.start(t, Math.random() * 0.5, dur + 0.02);
    },
  };
}

export const SOUNDS: Record<SoundName, (v: Voice) => void> = {
  // "Pop" con brillo: algo entró al carrito
  add: (v) => { v.tone(520, 0, 0.12, { gain: 0.55, slideTo: 980 }); v.tone(1320, 0.07, 0.18, { type: "triangle", gain: 0.22 }); },
  favorite: (v) => { v.tone(784, 0, 0.12, { gain: 0.35 }); v.tone(1175, 0.08, 0.2, { gain: 0.3 }); },
  unfavorite: (v) => { v.tone(784, 0, 0.1, { gain: 0.3 }); v.tone(523, 0.07, 0.16, { gain: 0.25 }); },
  // Destellos ascendentes: cupón aplicado
  coupon: (v) => [880, 1109, 1319, 1760].forEach((f, i) => v.tone(f, i * 0.055, 0.22, { type: "triangle", gain: 0.24 })),
  // Clic de cada casilla de la ruleta
  tick: (v) => v.noise(0, 0.018, { gain: 0.35, from: 3200 }),
  spin: (v) => v.noise(0, 0.5, { gain: 0.16, from: 500, to: 2600 }),
  win: (v) => {
    [523, 659, 784].forEach((f) => v.tone(f, 0, 0.5, { type: "triangle", gain: 0.2 }));
    v.tone(1047, 0.16, 0.7, { type: "triangle", gain: 0.28 });
    [1568, 2093, 2637].forEach((f, i) => v.tone(f, 0.3 + i * 0.06, 0.3, { gain: 0.12 }));
  },
  // Acorde cálido de cierre: compra confirmada
  purchase: (v) => {
    [392, 494, 587].forEach((f) => v.tone(f, 0, 0.35, { gain: 0.16 }));
    [523, 659, 784, 1047].forEach((f) => v.tone(f, 0.22, 0.9, { type: "triangle", gain: 0.17 }));
  },
  error: (v) => { v.tone(196, 0, 0.1, { type: "square", gain: 0.14 }); v.tone(165, 0.13, 0.14, { type: "square", gain: 0.14 }); },
  // Golpe al regalo: un "pum" grave con algo de cartón
  hit: (v) => { v.tone(150, 0, 0.16, { gain: 0.6, slideTo: 70 }); v.noise(0, 0.07, { gain: 0.32, from: 900, to: 300 }); },
  // El regalo se abre: soplido que sube y campanitas
  open: (v) => {
    v.noise(0, 0.45, { gain: 0.12, from: 400, to: 4200 });
    [784, 988, 1175, 1568, 1976].forEach((f, i) => v.tone(f, 0.12 + i * 0.07, 0.5, { type: "triangle", gain: 0.16 }));
  },
  // Listo: dos notas que suben (guardar, aprobar, copiar)
  success: (v) => { v.tone(784, 0, 0.12, { type: "triangle", gain: 0.16 }); v.tone(1175, 0.08, 0.24, { type: "triangle", gain: 0.16 }); },
  // Algo se va: golpe grave que baja (quitar, borrar)
  remove: (v) => { v.tone(330, 0, 0.13, { gain: 0.24, slideTo: 170 }); v.noise(0, 0.05, { gain: 0.1, from: 900, to: 300 }); },
  // Entrar a ver un producto: un brillo corto
  product: (v) => {
    v.noise(0, 0.22, { gain: 0.035, from: 3000, to: 6500 });
    [1319, 1568, 2093].forEach((f, i) => v.tone(f, 0.02 + i * 0.045, 0.26, { type: "triangle", gain: 0.075 }));
  },
  nav: (v) => v.tone(1200, 0, 0.04, { gain: 0.12 }),
  // Clic de botón: seco y muy corto
  tap: (v) => { v.noise(0, 0.014, { gain: 0.16, from: 2600 }); v.tone(1500, 0, 0.03, { gain: 0.045 }); },
  // Elegir una opción, una pestaña o un chip
  select: (v) => { v.tone(1040, 0, 0.05, { gain: 0.11 }); v.tone(1560, 0.035, 0.07, { gain: 0.075 }); },
  toggleOn: (v) => { v.tone(660, 0, 0.06, { gain: 0.13 }); v.tone(990, 0.05, 0.09, { gain: 0.12 }); },
  toggleOff: (v) => { v.tone(990, 0, 0.06, { gain: 0.11 }); v.tone(660, 0.05, 0.09, { gain: 0.1 }); },
  // Cada tecla: un roce apenas audible
  type: (v) => v.noise(0, 0.008, { gain: 0.06, from: 4200 }),
  // Modales: soplido corto que sube al abrir y baja al cerrar
  modalOpen: (v) => { v.noise(0, 0.16, { gain: 0.05, from: 600, to: 2400 }); v.tone(740, 0.02, 0.13, { type: "triangle", gain: 0.07, slideTo: 990 }); },
  modalClose: (v) => { v.noise(0, 0.14, { gain: 0.045, from: 2200, to: 700 }); v.tone(880, 0, 0.11, { type: "triangle", gain: 0.055, slideTo: 620 }); },
  // Pasos (checkout y editores): adelante sube, atrás baja
  step: (v) => { v.tone(587, 0, 0.08, { gain: 0.12 }); v.tone(880, 0.06, 0.13, { type: "triangle", gain: 0.12 }); },
  back: (v) => { v.tone(880, 0, 0.07, { gain: 0.09 }); v.tone(587, 0.05, 0.11, { type: "triangle", gain: 0.09 }); },
  // Sumar y restar (cantidad, stock)
  up: (v) => v.tone(880, 0, 0.07, { gain: 0.12, slideTo: 1245 }),
  down: (v) => v.tone(880, 0, 0.07, { gain: 0.11, slideTo: 622 }),
  info: (v) => v.tone(988, 0, 0.15, { gain: 0.09 }),
};
