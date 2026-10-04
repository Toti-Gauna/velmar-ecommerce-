/** Ruleta de cupones de MUESTRA. Pesos relativos; editable desde el panel demo. */
export interface WheelSegment {
  id: string;
  label: string;
  kind: "PERCENT" | "FIXED" | "FREE_SHIPPING";
  value: number;
  minSubtotal?: number;
  weight: number;
  active: boolean;
}

export interface WheelConfig {
  active: boolean;
  validDays: number;
  segments: WheelSegment[];
}

export const defaultWheel: WheelConfig = {
  active: true,
  validDays: 7,
  segments: [
    { id: "w5", label: "5% OFF", kind: "PERCENT", value: 5, weight: 26, active: true },
    { id: "wship", label: "Envío gratis", kind: "FREE_SHIPPING", value: 0, weight: 20, active: true },
    { id: "wgrab", label: "Grabado gratis", kind: "FIXED", value: 2500, weight: 16, active: true },
    { id: "w10", label: "10% OFF", kind: "PERCENT", value: 10, weight: 12, active: true },
    { id: "w3000", label: "$3.000 OFF", kind: "FIXED", value: 3000, minSubtotal: 25000, weight: 12, active: true },
    { id: "wkey", label: "Llavero de regalo", kind: "FIXED", value: 9900, minSubtotal: 30000, weight: 6, active: true },
    { id: "w15", label: "15% OFF", kind: "PERCENT", value: 15, weight: 4, active: true },
    { id: "wship2", label: "Envío gratis", kind: "FREE_SHIPPING", value: 0, weight: 4, active: true },
  ],
};
