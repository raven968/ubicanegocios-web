// Server-side data access for the public site.
const API_URL = import.meta.env.API_URL ?? 'http://localhost:8000/api/v1';

export type PlanSlug = 'fundador' | 'estrella' | 'pro' | 'destaca' | 'emprende' | 'lite';

export interface PlanInfo {
  slug: PlanSlug;
  name: string;
  image: string;
}

export const PLANS: Record<PlanSlug, PlanInfo> = {
  fundador: { slug: 'fundador', name: 'Negocio Fundador', image: '/planes/fundador.png' },
  estrella: { slug: 'estrella', name: 'Negocio Estrella', image: '/planes/estrella.png' },
  pro: { slug: 'pro', name: 'Ubica Pro', image: '/planes/pro.png' },
  destaca: { slug: 'destaca', name: 'Destaca', image: '/planes/destaca.png' },
  emprende: { slug: 'emprende', name: 'Emprende', image: '/planes/emprende.png' },
  lite: { slug: 'lite', name: 'Ubica Lite', image: '/planes/lite.png' },
};

export interface Subcategory {
  id: number;
  name: string;
  slug: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  subcategories: Subcategory[];
  businesses_count: number;
}

export interface BusinessImage {
  id: number;
  url: string;
  order: number;
}

export interface BusinessVideo {
  id: number;
  url: string;
  orientation: 'horizontal' | 'vertical';
  order: number;
}

export interface Review {
  id: number;
  author_name: string;
  body: string;
  rating: number;
  created_at: string;
}

export interface Business {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  tags: string[];
  active: boolean;
  plan: PlanSlug | null;
  average_rating: number;
  reviews_count: number;
  images: BusinessImage[];
  videos: BusinessVideo[];
  categories: Category[];
  subcategories: Subcategory[];
  reviews?: Review[];
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`API ${res.status} for ${path}`);
  }
  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await get<{ data: Category[] }>('/categories');
  return data;
}

export async function getBusinesses(params: Record<string, string> = {}): Promise<Business[]> {
  const qs = new URLSearchParams(params).toString();
  const { data } = await get<{ data: Business[] }>(`/businesses${qs ? `?${qs}` : ''}`);
  return data;
}

export async function getBusiness(slug: string): Promise<Business | null> {
  try {
    const { data } = await get<{ data: Business }>(`/businesses/${slug}`);
    return data;
  } catch {
    return null;
  }
}
