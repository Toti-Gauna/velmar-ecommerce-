import { brand } from "@/config/brand";

/**
 * Pantalla de carga de marca (HTML + CSS, sin JS): los dos chevrones se trazan, una línea dorada
 * avanza, el nombre se revela con una cortina y todo sube como un telón (~1 s, sin bloquear clics).
 * Un script inline la omite si ya se vio en esta sesión del navegador.
 */
export function Splash() {
  return (
    <div id="velmar-splash" aria-hidden="true">
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 48 44" className="h-16 w-16 text-brass">
          <path className="chev" d="M8 22 24 8l16 14" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path className="chev chev-2" d="M8 36 24 22l16 14" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="word font-display mt-5 text-5xl text-[#f6f1e8] sm:text-6xl">{brand.name}</span>
        <span className="line mt-4 h-px w-40 bg-brass" />
        <span className="tag eyebrow mt-3 text-[#d8cfbd]">{brand.city} · hecho a pedido</span>
      </div>
    </div>
  );
}

export const splashScript = `try{if(sessionStorage.getItem("velmar-splash")){document.documentElement.classList.add("splash-seen")}else{sessionStorage.setItem("velmar-splash","1")}}catch(e){}`;
