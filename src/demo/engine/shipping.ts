import { shippingZones } from "../fixtures/commerce";

export function isLocalPostalCode(postalCode: string): boolean {
  const local = shippingZones.find((z) => z.type === "LOCAL_DELIVERY");
  return Boolean(local?.postalCodes?.includes(postalCode.trim()));
}
