import { Story, Category, PaginatedResult } from '@/types';
import { stories, categories } from './mock-data';
import { fetchGraphQL } from './graphql-client';
import { transformWPPostToStory, transformWPCategoryToCategory } from './wp-transform';
import {
  GET_POSTS_QUERY,
  GET_POST_BY_SLUG_QUERY,
  GET_ALL_SLUGS_QUERY,
  GET_CATEGORIES_QUERY,
  GET_CATEGORY_BY_SLUG_QUERY,
  GET_RELATED_POSTS_QUERY,
  GET_FEATURED_POSTS_QUERY,
  GET_TRENDING_POSTS_QUERY,
} from './graphql-queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
const USE_WORDPRESS = process.env.NEXT_PUBLIC_USE_WORDPRESS === 'true';

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

  // Use WordPress GraphQL if enabled
  if (USE_WORDPRESS) {
    try {
      const categoryId = category ? await getCategoryIdBySlug(category) : null;
      
      const response = await fetchGraphQL<any>(GET_POSTS_QUERY, {
        first: perPage,
        categoryIn: categoryId ? [categoryId] : null,
      }, {
        revalidate: REVALIDATE_STORIES,
        tags: ['posts', category || 'all'],
      });

      const posts = response.posts?.edges?.map((edge: any) => transformWPPostToStory(edge.node)) || [];
      const total = response.posts?.pageInfo?.total || 0;
      const totalPages = Math.ceil(total / perPage);

      // Filter by featured/trending if needed (since GraphQL query filtering may not work the same)
      let filtered = posts;
      if (featured !== undefined) {
        filtered = filtered.filter((s) => s.featured === featured);
      }
      if (trending !== undefined) {
        filtered = filtered.filter((s) => s.trending === trending);
      }

      return {
        data: filtered.slice(0, perPage),
        total,
        page,
        perPage,
        totalPages,
      };
    } catch (error) {
      console.error('Error fetching from WordPress GraphQL, falling back to mock data:', error);
    }
  }

  // Fallback to mock data
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
  if (USE_WORDPRESS) {
    try {
      const response = await fetchGraphQL<any>(GET_POST_BY_SLUG_QUERY, { slug }, {
        revalidate: REVALIDATE_STORIES,
        tags: ['post', slug],
      });
      return response.postBy ? transformWPPostToStory(response.postBy) : null;
    } catch (error) {
      console.error('Error fetching post from WordPress GraphQL:', error);
    }
  }

  return stories.find((s) => s.slug === slug) || null;
}

export async function getAllStorySlugs(): Promise<string[]> {
  if (USE_WORDPRESS) {
    try {
      const allSlugs: string[] = [];
      let after: string | null = null;
      let hasNextPage = true;

      while (hasNextPage) {
        const response = await fetchGraphQL<any>(GET_ALL_SLUGS_QUERY, { after }, {
          revalidate: REVALIDATE_CATEGORIES,
          tags: ['all-slugs'],
        });

        allSlugs.push(...(response.posts?.edges?.map((edge: any) => edge.node.slug) || []));
        hasNextPage = response.posts?.pageInfo?.hasNextPage || false;
        after = response.posts?.pageInfo?.endCursor || null;
      }

      return allSlugs;
    } catch (error) {
      console.error('Error fetching slugs from WordPress GraphQL:', error);
    }
  }

  return stories.map((s) => s.slug);
}

export async function getRelatedStories(story: Story, limit: number = 3): Promise<Story[]> {
  if (USE_WORDPRESS) {
    try {
      const response = await fetchGraphQL<any>(GET_RELATED_POSTS_QUERY, {
        categoryIn: [story.category.id],
        notIn: [story.id],
        first: limit,
      }, {
        revalidate: REVALIDATE_STORIES,
        tags: ['related-stories', story.id],
      });

      return response.posts?.edges?.map((edge: any) => transformWPPostToStory(edge.node)) || [];
    } catch (error) {
      console.error('Error fetching related stories from WordPress GraphQL:', error);
    }
  }

  return stories
    .filter((s) => s.id !== story.id && s.category.slug === story.category.slug)
    .slice(0, limit);
}

// ─── Categories ─────────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  if (USE_WORDPRESS) {
    try {
      const response = await fetchGraphQL<any>(GET_CATEGORIES_QUERY, {}, {
        revalidate: REVALIDATE_CATEGORIES,
        tags: ['categories'],
      });

      return response.categories?.edges?.map((edge: any) =>
        transformWPCategoryToCategory(edge.node)
      ) || [];
    } catch (error) {
      console.error('Error fetching categories from WordPress GraphQL:', error);
    }
  }

  return categories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (USE_WORDPRESS) {
    try {
      const response = await fetchGraphQL<any>(GET_CATEGORY_BY_SLUG_QUERY, { slug }, {
        revalidate: REVALIDATE_CATEGORIES,
        tags: ['category', slug],
      });

      return response.categoryBy ? transformWPCategoryToCategory(response.categoryBy) : null;
    } catch (error) {
      console.error('Error fetching category from WordPress GraphQL:', error);
    }
  }

  return categories.find((c) => c.slug === slug) || null;
}

// ─── Search ─────────────────────────────────────────────────────────────────────

export async function searchStories(
  query: string,
  options?: { page?: number; perPage?: number }
): Promise<PaginatedResult<Story>> {
  const { page = 1, perPage = 9 } = options || {};

  // TODO: Implement WordPress GraphQL search
  // For now, using mock data search

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

// ─── Featured & Trending ────────────────────────────────────────────────────────

export async function getFeaturedStories(limit: number = 1): Promise<Story[]> {
  if (USE_WORDPRESS) {
    try {
      const response = await fetchGraphQL<any>(GET_FEATURED_POSTS_QUERY, { first: limit }, {
        revalidate: REVALIDATE_STORIES,
        tags: ['featured-stories'],
      });

      return response.posts?.edges?.map((edge: any) => transformWPPostToStory(edge.node)) || [];
    } catch (error) {
      console.error('Error fetching featured stories from WordPress GraphQL:', error);
    }
  }

  return stories.filter((s) => s.featured).slice(0, limit);
}

export async function getTrendingStories(limit: number = 6): Promise<Story[]> {
  if (USE_WORDPRESS) {
    try {
      const response = await fetchGraphQL<any>(GET_TRENDING_POSTS_QUERY, { first: limit }, {
        revalidate: REVALIDATE_STORIES,
        tags: ['trending-stories'],
      });

      return response.posts?.edges?.map((edge: any) => transformWPPostToStory(edge.node)) || [];
    } catch (error) {
      console.error('Error fetching trending stories from WordPress GraphQL:', error);
    }
  }

  return stories.filter((s) => s.trending).slice(0, limit);
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

export function getSiteUrl(): string {
  return SITE_URL;
}

/**
 * Get WordPress category ID by slug (helper for getStories)
 */
async function getCategoryIdBySlug(slug: string): Promise<string | null> {
  const category = await getCategoryBySlug(slug);
  return category?.id || null;
}
