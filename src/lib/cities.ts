import type { Zone } from './api';
import { zoneLabel } from './zones';

/*
 * Fotos de portada de las ciudades (public/ciudades/<clave>-{640,1200}.webp).
 * Son de Wikimedia Commons con licencia libre: el crédito es obligatorio y se
 * muestra junto a la sección. Una ciudad sin foto usa la portada ilustrada.
 */
export interface CityPhoto {
  alt: string;
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
  /** object-position para que el recorte conserve el punto de interés. */
  position?: string;
}

export const CITY_PHOTOS: Record<string, CityPhoto> = {
  delicias: {
    alt: 'Reloj Público en el centro de Delicias',
    author: 'Lobo2y',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Reloj_Publico_Dia.jpg',
    position: '50% 30%',
  },
  meoqui: {
    alt: 'Templo principal de Meoqui al atardecer',
    author: 'Katmarova',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Fe_en_cuatro_paredes.jpg',
    position: '50% 45%',
  },
  camargo: {
    alt: 'Letras monumentales de Camargo en la plaza',
    author: 'CrySwiftly',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Letras_de_Santa_Rosal%C3%ADa_de_Camargo.jpg',
    position: '50% 70%',
  },
  chihuahua: {
    alt: 'Catedral de Chihuahua desde la Plaza de Armas',
    author: 'Comisión Mexicana de Filmaciones',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
    source:
      'https://commons.wikimedia.org/wiki/File:Catedral_de_Chihuahua,_Plaza_de_las_Armas,_Chihuahua-_Chihuahua_cathedral_(24256572941).jpg',
    position: '50% 40%',
  },
  parral: {
    alt: 'Catedral de Guadalupe en el centro de Parral',
    author: 'Pedro Eduardo Romero Vázquez',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    source: 'https://commons.wikimedia.org/wiki/File:Templo_de_Guadalupe_Catedral_Centro_Parral.jpg',
    position: '50% 35%',
  },
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
