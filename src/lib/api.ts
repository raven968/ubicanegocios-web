// Server-side data access for the public site.
const API_URL = import.meta.env.API_URL ?? 'http://localhost:8000/api/v1';

export type PlanSlug = 'fundador' | 'estrella' | 'pro' | 'destaca' | 'emprende' | 'lite' | 'ubitag';

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
  ubitag: { slug: 'ubitag', name: 'UbiTag', image: '/planes/ubitag.png' },
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

export interface Zone {
  id: number;
  name: string;
  slug: string;
  order: number;
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
  phone2: string | null;
  whatsapp_phone: 'phone' | 'phone2' | null;
  email: string | null;
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  pinterest: string | null;
  website: string | null;
  tags: string[];
  active: boolean;
  plan: PlanSlug | null;
  average_rating: number;
  reviews_count: number;
  images: BusinessImage[];
  videos: BusinessVideo[];
  categories: Category[];
  subcategories: Subcategory[];
  zones: Zone[];
  reviews?: Review[];
  created_at?: string;
}

export interface PageMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface BusinessPage {
  data: Business[];
  meta: PageMeta;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    path: string,
  ) {
    super(`API ${status} for ${path}`);
  }
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new ApiError(res.status, path);
  }
  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await get<{ data: Category[] }>('/categories');
  return data;
}

export async function getZones(): Promise<Zone[]> {
  const { data } = await get<{ data: Zone[] }>('/zones');
  return data;
}

export async function getBusinesses(params: Record<string, string> = {}): Promise<Business[]> {
  const qs = new URLSearchParams(params).toString();
  const { data } = await get<{ data: Business[] }>(`/businesses${qs ? `?${qs}` : ''}`);
  return data;
}

/** Listado paginado: conserva `meta` para mostrar el total y la paginación. */
export async function getBusinessesPage(params: Record<string, string> = {}): Promise<BusinessPage> {
  const qs = new URLSearchParams(params).toString();
  const { data, meta } = await get<BusinessPage>(`/businesses${qs ? `?${qs}` : ''}`);
  return { data, meta };
}

/**
 * `null` solo cuando el negocio no existe (404). Cualquier otro fallo se propaga:
 * así una caída de la API no se sirve como "página no encontrada" a los buscadores.
 */
export async function getBusiness(slug: string): Promise<Business | null> {
  try {
    const { data } = await get<{ data: Business }>(`/businesses/${encodeURIComponent(slug)}`);
    return data;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}
