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
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).trim();
}
