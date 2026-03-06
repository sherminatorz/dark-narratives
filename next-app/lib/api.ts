import { Story, Category, PaginatedResult } from './types';
import { stories, categories } from './mock-data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
// const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://your-wordpress-site.com/wp-json/wp/v2';

// ─── Stories ────────────────────────────────────────────────────────────────────

export async function getStories(options?: {
  page?: number;
  perPage?: number;
  category?: string;
  featured?: boolean;
  trending?: boolean;
}): Promise<PaginatedResult<Story>> {
  const { page = 1, perPage = 9, category, featured, trending } = options || {};

  // WordPress version:
  // const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
  // if (category) params.set('categories', category);
  // const res = await fetch(`${WP_API_URL}/posts?${params}`, { next: { revalidate: 60 } });
  // const data = await res.json();
  // const total = parseInt(res.headers.get('X-WP-Total') || '0');
  // return { data: data.map(transformWPPost), total, page, perPage, totalPages: Math.ceil(total / perPage) };

  let filtered = [...stories];

  if (category) {
    filtered = filtered.filter((s) => s.category.slug === category);
  }
  if (featured !== undefined) {
    filtered = filtered.filter((s) => s.featured === featured);
  }
  if (trending !== undefined) {
    filtered = filtered.filter((s) => s.trending === trending);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const data = filtered.slice(start, start + perPage);

  return { data, total, page, perPage, totalPages };
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  // WordPress version:
  // const res = await fetch(`${WP_API_URL}/posts?slug=${slug}&_embed`, { next: { revalidate: 60 } });
  // const data = await res.json();
  // return data.length > 0 ? transformWPPost(data[0]) : null;

  return stories.find((s) => s.slug === slug) || null;
}

export async function getAllStorySlugs(): Promise<string[]> {
  // WordPress version:
  // const res = await fetch(`${WP_API_URL}/posts?per_page=100&_fields=slug`);
  // const data = await res.json();
  // return data.map((p: any) => p.slug);

  return stories.map((s) => s.slug);
}

export async function getRelatedStories(story: Story, limit: number = 3): Promise<Story[]> {
  return stories
    .filter((s) => s.id !== story.id && s.category.slug === story.category.slug)
    .slice(0, limit);
}

// ─── Categories ─────────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  // WordPress version:
  // const res = await fetch(`${WP_API_URL}/categories?per_page=100`, { next: { revalidate: 3600 } });
  // return (await res.json()).map(transformWPCategory);

  return categories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return categories.find((c) => c.slug === slug) || null;
}

// ─── Search ─────────────────────────────────────────────────────────────────────

export async function searchStories(
  query: string,
  options?: { page?: number; perPage?: number }
): Promise<PaginatedResult<Story>> {
  const { page = 1, perPage = 9 } = options || {};

  // WordPress version:
  // const res = await fetch(`${WP_API_URL}/posts?search=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`);
  // ...

  const q = query.toLowerCase();
  const filtered = stories.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.excerpt.toLowerCase().includes(q) ||
      s.tags.some((t) => t.includes(q)) ||
      s.category.name.toLowerCase().includes(q)
  );

  const total = filtered.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const data = filtered.slice(start, start + perPage);

  return { data, total, page, perPage, totalPages };
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

export function getSiteUrl(): string {
  return SITE_URL;
}

// WordPress data transformers (uncomment when connecting to WP):
// function transformWPPost(post: any): Story { ... }
// function transformWPCategory(cat: any): Category { ... }
