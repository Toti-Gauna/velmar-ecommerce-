/**
 * Cambio de página en el celular (8.4.28). En pantallas de hasta 640 px la tienda no usa View Transitions: la captura
 * de la página que sale y la que entra sumaba el trabajo más pesado justo cuando se monta la nueva. Medido en Chrome
 * emulando un celular de gama media (CPU 4×), la mediana al cambiar de sección pasó de 31–42 a 40–53 fps y el peor
 * cuadro, de 200–500 ms a 100–150 ms. La página entra con el fundido CSS de la plantilla (`.page-enter`, en el
 * compositor). React usa la transición solo si el navegador la ofrece (la prueba y, si falla, sigue sin animar), así que
 * alcanza con no ofrecerla. Tablet y escritorio quedan igual.
 */
export const PHONE = "(max-width: 640px)";

export const pageMotionScript = `(function(){try{if(matchMedia(${JSON.stringify(PHONE)}).matches){document.documentElement.classList.add("vt-off");document.startViewTransition=undefined}}catch(e){}})();`;
