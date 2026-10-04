import { brand } from "@/config/brand";

/**
 * Pantalla de carga de marca: dos chevrones que se dibujan y revelan el nombre.
 * HTML estático + CSS (sin JS): desaparece sola a los ~800 ms y nunca captura clics.
 * Un script inline la omite si ya se vio en esta sesión del navegador.
 */
export function Splash() {
  return (
    <div id="velmar-splash" aria-hidden="true">
      <div className="flex flex-col items-center gap-3">
        <svg viewBox="0 0 48 44" className="h-20 w-20 text-primary">
          <path className="chev" d="M8 22 24 8l16 14" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path className="chev chev-2" d="M8 36 24 22l16 14" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="word text-3xl font-extrabold tracking-tight text-primary">{brand.name}</span>
      </div>
    </div>
  );
}

export const splashScript = `try{if(sessionStorage.getItem("velmar-splash")){document.documentElement.classList.add("splash-seen")}else{sessionStorage.setItem("velmar-splash","1")}}catch(e){}`;
