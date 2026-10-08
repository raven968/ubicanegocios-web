import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

/**
 * Convierte la descripción en markdown a HTML seguro.
 * Solo permite formato básico y links http/https/mailto.
 * Los enlaces se abren en una pestaña nueva con rel seguro.
 */
export function renderDescription(md: string): string {
  const rawHtml = marked.parse(md, { breaks: true, async: false }) as string;

  return sanitizeHtml(rawHtml, {
    allowedTags: ['p', 'br', 'strong', 'em', 'b', 'i', 'a', 'ul', 'ol', 'li'],
    allowedAttributes: { a: ['href', 'target', 'rel'] },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', {
        target: '_blank',
        rel: 'noopener noreferrer nofollow',
      }),
    },
  });
}

/**
 * Devuelve la descripción como texto plano (sin markdown ni HTML).
 * Útil para previews truncados como las tarjetas.
 */
export function stripMarkdown(md: string): string {
  const html = marked.parse(md, { async: false }) as string;
  // sanitize-html devuelve el texto escapado; aquí se quiere texto plano real
  // (Astro lo vuelve a escapar al renderizar).
  return decodeEntities(sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })).trim();
}

function decodeEntities(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

/** Texto plano recortado a `max` caracteres sin partir palabras (meta description, OG). */
export function excerpt(md: string | null | undefined, max = 155): string {
  if (!md) return '';
  const text = stripMarkdown(md).replace(/\s+/g, ' ');
  if (text.length <= max) return text;
  return `${text.slice(0, text.lastIndexOf(' ', max - 1)).replace(/[,.;:]$/, '')}…`;
}
