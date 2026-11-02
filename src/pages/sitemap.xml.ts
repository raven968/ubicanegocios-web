import type { APIRoute } from 'astro';
import { getBusinesses, getCategories } from '../lib/api';

// Se genera bajo demanda con los datos vivos de la API y se cachea en el CDN.
export const GET: APIRoute = async ({ site }) => {
  const [categories, businesses] = await Promise.all([getCategories(), getBusinesses({ all: '1' })]);

  const url = (path: string, lastmod?: string) =>
    `<url><loc>${new URL(path, site).href}</loc>${lastmod ? `<lastmod>${lastmod.slice(0, 10)}</lastmod>` : ''}</url>`;

  const entries = [
    url('/'),
    url('/categorias'),
    url('/buscar'),
    url('/anuncia-tu-negocio'),
    url('/preguntas-frecuentes'),
    ...categories.filter((c) => c.businesses_count > 0).map((c) => url(`/categoria/${c.slug}`)),
    ...businesses.map((b) => url(`/negocio/${b.slug}`, b.created_at)),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
};
