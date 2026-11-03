import type { Zone } from './api';
import { zoneLabel } from './zones';

/*
 * Fotos de portada de las ciudades (public/ciudades/<clave>-{640,1200}.webp),
 * generadas desde utils/<clave>.jpeg. Una ciudad sin foto usa la portada ilustrada.
 */
export interface CityPhoto {
  alt: string;
  /** object-position para que el recorte conserve las letras monumentales. */
  position?: string;
}

export const CITY_PHOTOS: Record<string, CityPhoto> = {
  chihuahua: { alt: 'Letras monumentales de Chihuahua frente a un mural en relieve', position: '50% 65%' },
  delicias: { alt: 'Letras monumentales de Delicias frente al Reloj Público', position: '50% 70%' },
  meoqui: { alt: 'Letras monumentales de Meoqui con el lema #MeoquiEnamora', position: '50% 55%' },
  camargo: { alt: 'Letras monumentales de Camargo, cuna de artistas, en la plaza', position: '50% 60%' },
  parral: { alt: 'Letras monumentales de Parral frente a un edificio histórico', position: '50% 65%' },
  jimenez: { alt: 'Letras monumentales de Jiménez, la puerta de oro del estado grande', position: '50% 55%' },
  saucillo: { alt: 'Letras monumentales de Saucillo con una estatua de bronce', position: '50% 65%' },
  julimes: { alt: 'Letras monumentales de Julimes en la plaza', position: '50% 65%' },
  rosales: { alt: 'Letras monumentales de Rosales junto a la presa', position: '50% 45%' },
};

/** "Jiménez" / "JIMENEZ" → "jimenez" */
export function cityKey(zone: Zone): string {
  return zoneLabel(zone)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
}

export function cityPhoto(zone: Zone): (CityPhoto & { key: string }) | null {
  const key = cityKey(zone);
  const photo = CITY_PHOTOS[key];
  return photo ? { ...photo, key } : null;
}
