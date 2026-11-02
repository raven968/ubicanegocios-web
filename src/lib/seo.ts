import type { Business } from './api';
import { excerpt } from './markdown';

interface Crumb {
  label: string;
  href?: string;
}

export function breadcrumbJsonLd(items: Crumb[], site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: new URL(item.href, site).href } : {}),
    })),
  };
}

export function businessJsonLd(business: Business, url: string) {
  const sameAs = [business.facebook, business.instagram, business.tiktok, business.pinterest, business.website].filter(
    Boolean,
  );
  const reviews = business.reviews ?? [];

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': url,
    name: business.name,
    url,
    description: excerpt(business.description, 300) || undefined,
    image: business.images.slice(0, 5).map((i) => i.url),
    telephone: business.phone ?? business.phone2 ?? undefined,
    email: business.email ?? undefined,
    address: business.address
      ? { '@type': 'PostalAddress', streetAddress: business.address, addressRegion: 'Chihuahua', addressCountry: 'MX' }
      : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    aggregateRating:
      business.reviews_count > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: Number(business.average_rating.toFixed(1)),
            reviewCount: business.reviews_count,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
    review: reviews.slice(0, 5).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author_name },
      reviewBody: r.body,
      datePublished: r.created_at?.slice(0, 10),
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
    })),
  };
}
