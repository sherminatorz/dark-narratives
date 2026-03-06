import { Story, PaginatedResult } from '@/types';
import { getStories, getStoryBySlug, getRelatedStories as apiGetRelatedStories, getCategories } from '@/lib/api';

// ─── Revalidation config (seconds) ─────────────────────────────────────────────
// When switching to WordPress, these values are passed to fetch({ next: { revalidate } })
export const REVALIDATE_STORIES = 60; // 1 minute
export const REVALIDATE_CATEGORIES = 3600; // 1 hour

// ─── Story Services ─────────────────────────────────────────────────────────────

export async function getFeaturedStory(): Promise<Story | null> {
  const { data } = await getStories({ page: 1, perPage: 100, featured: true });
  return data[0] || null;
}

export async function getTrendingStories(limit: number = 6): Promise<Story[]> {
  const { data } = await getStories({ page: 1, perPage: limit, trending: true });
  return data;
}

export async function getLatestStories(limit: number = 6): Promise<Story[]> {
  const { data } = await getStories({ page: 1, perPage: limit });
  return data;
}

export async function getStoriesByCategory(
  categorySlug: string,
  options?: { page?: number; perPage?: number }
): Promise<PaginatedResult<Story>> {
  return getStories({
    category: categorySlug,
    page: options?.page ?? 1,
    perPage: options?.perPage ?? 9,
  });
}

export async function getPaginatedStories(
  page: number = 1,
  perPage: number = 9
): Promise<PaginatedResult<Story>> {
  return getStories({ page, perPage });
}

export async function getRelatedStories(story: Story, limit: number = 3): Promise<Story[]> {
  return apiGetRelatedStories(story, limit);
}

export async function getStoryDetail(slug: string) {
  const story = await getStoryBySlug(slug);
  if (!story) return null;

  const related = await apiGetRelatedStories(story, 3);
  return { story, related };
}

// ─── Category Services ──────────────────────────────────────────────────────────

export async function getAllCategories() {
  return getCategories();
}
