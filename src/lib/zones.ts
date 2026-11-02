import type { Zone } from './api';

/*
 * Las zonas llegan como una lista plana ordenada donde las ciudades se capturan
 * como "*CD. DELICIAS, CHIHUAHUA, MX (TODOS LOS SECTORES)" y sus sectores van
 * justo después. Aquí solo se interpreta esa convención para presentarla mejor;
 * el dato y el slug no cambian. Si algún día la API expone `parent_id`, esta
 * heurística se reemplaza por esa relación.
 */

const CITY_RE = /^\s*\*?\s*cd\.?\s+([^,(]+)/i;
const LOWER_WORDS = new Set(['de', 'del', 'la', 'las', 'los', 'y', 'el']);

function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((w, i) => (i > 0 && LOWER_WORDS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

export function isCityZone(zone: Zone): boolean {
  return CITY_RE.test(zone.name);
}

/** Nombre legible: "*CD. DELICIAS, CHIHUAHUA, MX (…)" → "Delicias". */
export function zoneLabel(zone: Zone): string {
  const m = zone.name.match(CITY_RE);
  return m ? titleCase(m[1]) : zone.name.trim();
}

export interface ZoneGroup {
  city: Zone | null;
  label: string;
  sectors: Zone[];
}

/** Agrupa los sectores bajo la ciudad que los precede en el orden del admin. */
export function groupZones(zones: Zone[]): ZoneGroup[] {
  const groups: ZoneGroup[] = [];
  for (const zone of zones) {
    if (isCityZone(zone)) {
      groups.push({ city: zone, label: zoneLabel(zone), sectors: [] });
    } else if (groups.length > 0 && groups[groups.length - 1].city) {
      groups[groups.length - 1].sectors.push(zone);
    } else {
      groups.push({ city: null, label: zone.name.trim(), sectors: [zone] });
    }
  }
  return groups;
}

/**
 * Resumen corto para tarjetas: "Sector Sur · Delicias", "Delicias",
 * "Delicias y 2 ciudades más". Un negocio puede estar en varias zonas.
 */
export function locationSummary(zones: Zone[]): string | null {
  const cities = zones.filter(isCityZone).map(zoneLabel);
  const sectors = zones.filter((z) => !isCityZone(z));
  if (cities.length > 1) {
    const rest = cities.length - 1;
    return `${cities[0]} y ${rest} ${rest === 1 ? 'ciudad' : 'ciudades'} más`;
  }
  if (cities.length === 1) {
    return sectors.length === 1 ? `${sectors[0].name} · ${cities[0]}` : cities[0];
  }
  return sectors[0]?.name ?? null;
}

/** Ciudades con negocios, para "Explora por ciudad". */
export function citiesWithBusinesses(zones: Zone[]): Zone[] {
  return zones.filter((z) => isCityZone(z) && z.businesses_count > 0);
}
