import type { Business } from './api';

export interface Phone {
  value: string;
  isWhatsapp: boolean;
}

export function phonesOf(business: Business): Phone[] {
  return [
    { value: business.phone, isWhatsapp: business.whatsapp_phone === 'phone' },
    { value: business.phone2, isWhatsapp: business.whatsapp_phone === 'phone2' },
  ].filter((p): p is Phone => Boolean(p.value));
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export function whatsappHref(phone: string, text: string): string {
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
}

export function businessWhatsappText(name: string): string {
  return `Hola, vi su negocio "${name}" en UbicaNegocios y me interesa más información.`;
}

export function mapsDirectionsHref(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

/** Acciones de contacto ya resueltas para tarjetas y la ficha. */
export function contactActions(business: Business) {
  const phones = phonesOf(business);
  const wa = phones.find((p) => p.isWhatsapp) ?? null;
  const call = phones.find((p) => !p.isWhatsapp) ?? phones[0] ?? null;
  return {
    phones,
    whatsapp: wa ? whatsappHref(wa.value, businessWhatsappText(business.name)) : null,
    call: call ? telHref(call.value) : null,
    directions: business.address ? mapsDirectionsHref(business.address) : null,
  };
}
