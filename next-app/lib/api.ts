import { Story, Category, PaginatedResult } from '@/types';
import { stories, categories } from './mock-data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://your-wordpress-site.com/wp-json/wp/v2';

// ─── Revalidation defaults ─────────────────────────────────────────────────────
const REVALIDATE_STORIES = 60; // seconds
const REVALIDATE_CATEGORIES = 3600; // seconds

// ─── Stories ────────────────────────────────────────────────────────────────────

export async function getStories(options?: {
  page?: number;
  perPage?: number;
  category?: string;
  featured?: boolean;
  trending?: boolean;
}): Promise<PaginatedResult<Story>> {
  const { page = 1, perPage = 9, category, featured, trending } = options || {};

  // ── WordPress version (uncomment when connecting to WP): ──
  // const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
  // if (category) params.set('categories', category);
  // if (featured) params.set('meta_key', 'featured');
  // const res = await fetch(`${WP_API_URL}/posts?${params}`, {
  //   next: { revalidate: REVALIDATE_STORIES },
  // });
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
  // const res = await fetch(`${WP_API_URL}/posts?slug=${slug}&_embed`, {
  //   next: { revalidate: REVALIDATE_STORIES },
  // });
  // const data = await res.json();
  // return data.length > 0 ? transformWPPost(data[0]) : null;

  return stories.find((s) => s.slug === slug) || null;
}

export async function getAllStorySlugs(): Promise<string[]> {
  // WordPress version:
  // const res = await fetch(`${WP_API_URL}/posts?per_page=100&_fields=slug`, {
  //   next: { revalidate: REVALIDATE_CATEGORIES },
  // });
  // const data = await res.json();
  // return data.map((p: any) => p.slug);

  return stories.map((s) => s.slug);
}

export async function getRelatedStories(story: Story, limit: number = 3): Promise<Story[]> {
  // WordPress version:
  // const res = await fetch(
  //   `${WP_API_URL}/posts?categories=${story.category.id}&exclude=${story.id}&per_page=${limit}`,
  //   { next: { revalidate: REVALIDATE_STORIES } }
  // );
  // return (await res.json()).map(transformWPPost);

  return stories
    .filter((s) => s.id !== story.id && s.category.slug === story.category.slug)
    .slice(0, limit);
}

// ─── Categories ─────────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  // WordPress version:
  // const res = await fetch(`${WP_API_URL}/categories?per_page=100`, {
  //   next: { revalidate: REVALIDATE_CATEGORIES },
  // });
  // return (await res.json()).map(transformWPCategory);

  return categories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  // WordPress version:
  // const res = await fetch(`${WP_API_URL}/categories?slug=${slug}`, {
  //   next: { revalidate: REVALIDATE_CATEGORIES },
  // });
  // const data = await res.json();
  // return data.length > 0 ? transformWPCategory(data[0]) : null;

  return categories.find((c) => c.slug === slug) || null;
}

// ─── Search ─────────────────────────────────────────────────────────────────────

export async function searchStories(
  query: string,
  options?: { page?: number; perPage?: number }
): Promise<PaginatedResult<Story>> {
  const { page = 1, perPage = 9 } = options || {};

  // WordPress version:
  // const res = await fetch(
  //   `${WP_API_URL}/posts?search=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
  //   { next: { revalidate: REVALIDATE_STORIES } }
  // );
  // const data = await res.json();
  // const total = parseInt(res.headers.get('X-WP-Total') || '0');
  // return { data: data.map(transformWPPost), total, page, perPage, totalPages: Math.ceil(total / perPage) };

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

// ── WordPress data transformers (uncomment when connecting to WP): ──
//
// function transformWPPost(post: any): Story {
//   return {
//     id: String(post.id),
//     slug: post.slug,
//     title: post.title.rendered,
//     excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, ''),
//     content: post.content.rendered,
//     image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
//     category: transformWPCategory(post._embedded?.['wp:term']?.[0]?.[0]),
//     author: {
//       id: String(post._embedded?.author?.[0]?.id),
//       name: post._embedded?.author?.[0]?.name || 'Unknown',
//       avatar: post._embedded?.author?.[0]?.avatar_urls?.['96'] || '',
//       bio: post._embedded?.author?.[0]?.description || '',
//     },
//     publishedAt: post.date,
//     readingTime: Math.ceil(post.content.rendered.split(/\s+/).length / 200),
//     featured: post.meta?.featured || false,
//     trending: post.meta?.trending || false,
//     tags: post._embedded?.['wp:term']?.[1]?.map((t: any) => t.slug) || [],
//   };
// }
//
// function transformWPCategory(cat: any): Category {
//   return {
//     id: String(cat?.id || ''),
//     slug: cat?.slug || '',
//     name: cat?.name || '',
//     description: cat?.description || '',
//     image: cat?.acf?.image || '',
//     storyCount: cat?.count || 0,
//   };
// }
