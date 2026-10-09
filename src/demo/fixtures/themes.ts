import type { Coupon, SeasonalTheme, ThemeSettings } from "../types";

/**
 * Temáticas de MUESTRA para las fechas comerciales de Argentina (pedido de Ignacio, fuera de la especificación).
 * Fechas aproximadas para 2026-2027; se repiten cada año y se ajustan desde el panel.
 */
export const seasonalThemes: SeasonalTheme[] = [
  { id: "dia-de-la-madre", name: "Día de la Madre", active: true, startsOn: "2026-10-01", endsOn: "2026-10-18", headline: "Para la que nos cuida a todos", subtitle: "Regalos hechos a mano, con nombre o con la foto de la familia.", ribbon: "Día de la Madre: 15% OFF en regalos", couponCode: "MAMA15", productSlugs: ["velador-con-foto", "vela-souvenir-flores", "vela-caniche", "difusor", "figura-persona-y-perro"] },
  { id: "halloween", name: "Halloween", active: true, startsOn: "2026-10-19", endsOn: "2026-10-31", headline: "Truco o regalo", subtitle: "Ofertas de miedo para tu casa y tu mascota, solo hasta el 31.", ribbon: "Halloween: 20% OFF con código", couponCode: "BOO20", productSlugs: ["vela-caniche", "collar-con-nombre", "salchicha-geometrico", "comedero-perro-globo", "placa-nfc"] },
  { id: "black-friday", name: "Black Friday", active: true, startsOn: "2026-11-23", endsOn: "2026-11-30", headline: "Black Friday Velmar", subtitle: "La semana con los mejores precios del año en todo el taller.", ribbon: "Black Friday: 25% OFF desde $30.000", couponCode: "BLACK25", productSlugs: ["comedero-elevado-madera", "velador-pintado-a-mano", "velador-con-foto", "comedero-perro-globo", "difusor"] },
  { id: "navidad", name: "Navidad", active: true, startsOn: "2026-12-01", endsOn: "2026-12-25", headline: "Regalos con nombre para el árbol", subtitle: "Encargalo antes del 18 y llega para Nochebuena.", ribbon: "Navidad: 15% OFF y envoltorio de regalo", couponCode: "NAVIDAD15", productSlugs: ["collar-con-nombre", "vela-en-lata", "vela-caniche", "velador-con-foto", "home-spray"] },
  { id: "ano-nuevo", name: "Año Nuevo", active: true, startsOn: "2026-12-26", endsOn: "2027-01-06", headline: "Brindemos por un año con alma", subtitle: "Arrancá el año renovando tu casa y los rincones de tu mascota.", ribbon: "Año Nuevo: 10% OFF para empezar", couponCode: "BRINDIS10", productSlugs: ["difusor", "home-spray", "pieza-i-love-mdp", "comedero-elevado-madera", "colgador-de-correa"] },
  { id: "san-valentin", name: "San Valentín", active: true, startsOn: "2027-02-01", endsOn: "2027-02-14", headline: "Amor de cuatro patas", subtitle: "Para tu persona favorita (y para tu mascota favorita).", ribbon: "San Valentín: 14% OFF con amor", couponCode: "AMOR14", productSlugs: ["figura-persona-y-perro", "velador-con-foto", "vela-caniche", "vela-souvenir-flores", "pieza-i-love-mdp"] },
  { id: "san-patricio", name: "San Patricio", active: true, startsOn: "2027-03-10", endsOn: "2027-03-17", headline: "La suerte del trébol", subtitle: "Una semana verde con descuentos para brindar con suerte.", ribbon: "San Patricio: 17% OFF con suerte", couponCode: "TREBOL17", productSlugs: ["comedero-perro-globo", "collar-con-nombre", "placa-nfc", "salchicha-geometrico", "colgador-de-correa"] },
  { id: "pascuas", name: "Pascuas", active: true, startsOn: "2027-03-18", endsOn: "2027-03-28", headline: "Encontrá el huevo de Pascua", subtitle: "Sorpresas para regalar en familia, con nombre o con foto.", ribbon: "Pascuas: 12% OFF escondido acá", couponCode: "PASCUAS12", productSlugs: ["vela-caniche", "salchicha-geometrico", "figura-persona-y-perro", "comedero-perro-globo", "difusor"] },
  { id: "dia-del-animal", name: "Día del Animal", active: true, startsOn: "2027-04-20", endsOn: "2027-04-29", headline: "Su día, sus cosas", subtitle: "El 29 de abril festejamos a los que nos esperan en la puerta.", ribbon: "Día del Animal: 20% OFF en mascotas", couponCode: "PATITAS20", productSlugs: ["comedero-perro-globo", "comedero-elevado-madera", "collar-con-nombre", "placa-nfc", "vela-caniche"] },
  { id: "hot-sale", name: "Hot Sale", active: true, startsOn: "2027-05-10", endsOn: "2027-05-12", headline: "Hot Sale: tres días que queman", subtitle: "Los precios más bajos del taller, solo por 72 horas.", ribbon: "Hot Sale: 30% OFF desde $30.000", couponCode: "HOTSALE30", productSlugs: ["velador-pintado-a-mano", "comedero-elevado-madera", "velador-con-foto", "figura-persona-y-perro", "difusor"] },
  { id: "dia-del-padre", name: "Día del Padre", active: true, startsOn: "2027-06-07", endsOn: "2027-06-20", headline: "Para el que saca a pasear al perro", subtitle: "Regalos con estilo para papá, para el abuelo y para el tío.", ribbon: "Día del Padre: 15% OFF para papá", couponCode: "PAPA15", productSlugs: ["colgador-de-correa", "placa-nfc", "salchicha-geometrico", "pieza-i-love-mdp", "velador-con-foto"] },
  { id: "dia-del-amigo", name: "Día del Amigo", active: true, startsOn: "2027-07-13", endsOn: "2027-07-20", headline: "Un mate, un amigo, un regalo", subtitle: "El 20 de julio regalá algo con su nombre (o el de su perro).", ribbon: "Día del Amigo: $3.000 OFF desde $25.000", couponCode: "AMIGOS3000", productSlugs: ["vela-en-lata", "vela-caniche", "home-spray", "pieza-i-love-mdp", "placa-nfc"] },
  { id: "dia-del-nino", name: "Día del Niño", active: true, startsOn: "2027-08-02", endsOn: "2027-08-15", headline: "Para los más chicos de la casa", subtitle: "Colores, nombres y mascotas: regalos que se juegan.", ribbon: "Día del Niño: 10% OFF para jugar", couponCode: "PEQUES10", productSlugs: ["figura-persona-y-perro", "comedero-perro-globo", "collar-con-nombre", "velador-con-foto", "salchicha-geometrico"] },
];

/** Un cupón por temática (se editan en Cupones y ruleta). */
export const themeCoupons: Coupon[] = [
  { code: "MAMA15", type: "PERCENT", value: 15, description: "15% por el Día de la Madre", active: true, usedCount: 9, themeId: "dia-de-la-madre" },
  { code: "BOO20", type: "PERCENT", value: 20, description: "20% de Halloween", active: true, usedCount: 0, themeId: "halloween" },
  { code: "BLACK25", type: "PERCENT", value: 25, minSubtotal: 30000, description: "25% de Black Friday desde $30.000", active: true, usedCount: 0, themeId: "black-friday" },
  { code: "NAVIDAD15", type: "PERCENT", value: 15, description: "15% de Navidad", active: true, usedCount: 0, themeId: "navidad" },
  { code: "BRINDIS10", type: "PERCENT", value: 10, description: "10% para empezar el año", active: true, usedCount: 0, themeId: "ano-nuevo" },
  { code: "AMOR14", type: "PERCENT", value: 14, description: "14% de San Valentín", active: true, usedCount: 0, themeId: "san-valentin" },
  { code: "TREBOL17", type: "PERCENT", value: 17, description: "17% de San Patricio", active: true, usedCount: 0, themeId: "san-patricio" },
  { code: "PASCUAS12", type: "PERCENT", value: 12, description: "12% de Pascuas", active: true, usedCount: 0, themeId: "pascuas" },
  { code: "PATITAS20", type: "PERCENT", value: 20, description: "20% por el Día del Animal", active: true, usedCount: 0, themeId: "dia-del-animal" },
  { code: "HOTSALE30", type: "PERCENT", value: 30, minSubtotal: 30000, description: "30% de Hot Sale desde $30.000", active: true, usedCount: 0, themeId: "hot-sale" },
  { code: "PAPA15", type: "PERCENT", value: 15, description: "15% por el Día del Padre", active: true, usedCount: 0, themeId: "dia-del-padre" },
  { code: "AMIGOS3000", type: "FIXED", value: 3000, minSubtotal: 25000, description: "$3.000 por el Día del Amigo desde $25.000", active: true, usedCount: 0, themeId: "dia-del-amigo" },
  { code: "PEQUES10", type: "PERCENT", value: 10, description: "10% por el Día del Niño", active: true, usedCount: 0, themeId: "dia-del-nino" },
];

export const themeSettings: ThemeSettings = { mode: "auto", fixedId: "halloween", showTryButton: true };
