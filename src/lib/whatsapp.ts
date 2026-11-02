// Los teléfonos se capturan a 10 dígitos sin lada internacional ("639 130 15 15").
// wa.me exige el número completo con código de país; sin él, WhatsApp toma los
// primeros dígitos como país (639 → Filipinas). México = 52.
const MX_COUNTRY_CODE = '52';

/** Número en formato internacional (solo dígitos) para wa.me. */
export function whatsappNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '').replace(/^00/, '');

  // Número nacional de 10 dígitos: se le antepone +52.
  if (digits.length === 10) return `${MX_COUNTRY_CODE}${digits}`;

  // Ya trae +52, o el formato anterior para celulares (+52 1 …): se deja como 52 + 10 dígitos.
  if (digits.length === 12 && digits.startsWith('52')) return digits;
  if (digits.length === 13 && digits.startsWith('521')) return `${MX_COUNTRY_CODE}${digits.slice(3)}`;

  // Cualquier otro formato se respeta (p. ej. un número extranjero capturado con su código).
  return digits;
}

export function whatsappHref(phone: string, text: string): string {
  return `https://wa.me/${whatsappNumber(phone)}?text=${encodeURIComponent(text)}`;
}
