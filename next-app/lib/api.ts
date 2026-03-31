import { Story, Category, PaginatedResult } from '@/types';
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
const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL;

// Validate WordPress configuration
if (!WP_GRAPHQL_URL) {
  throw new Error(
    'NEXT_PUBLIC_WP_GRAPHQL_URL environment variable is not set. ' +
    'Add it to your .env.local file.'
  );
}

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

    // Filter by featured/trending if needed
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
    console.error('Error fetching stories from WordPress GraphQL:', error);
    throw error; // Don't fallback to mock data
  }
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  try {
    const response = await fetchGraphQL<any>(GET_POST_BY_SLUG_QUERY, { slug }, {
      revalidate: REVALIDATE_STORIES,
      tags: ['post', slug],
    });
    return response.postBy ? transformWPPostToStory(response.postBy) : null;
  } catch (error) {
    console.error(`Error fetching post "${slug}" from WordPress GraphQL:`, error);
    throw error; // Don't fallback to mock data
  }
}

export async function getAllStorySlugs(): Promise<string[]> {
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
    throw error; // Don't fallback to mock data
  }
}

export async function getRelatedStories(story: Story, limit: number = 3): Promise<Story[]> {
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
    throw error; // Don't fallback to mock data
  }
}

// ─── Categories ─────────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
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
    throw error; // Don't fallback to mock data
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const response = await fetchGraphQL<any>(GET_CATEGORY_BY_SLUG_QUERY, { slug }, {
      revalidate: REVALIDATE_CATEGORIES,
      tags: ['category', slug],
    });

    return response.categoryBy ? transformWPCategoryToCategory(response.categoryBy) : null;
  } catch (error) {
    console.error('Error fetching category from WordPress GraphQL:', error);
    throw error; // Don't fallback to mock data
  }
}

// ─── Search ─────────────────────────────────────────────────────────────────────

export async function searchStories(
  query: string,
  options?: { page?: number; perPage?: number }
): Promise<PaginatedResult<Story>> {
  const { page = 1, perPage = 9 } = options || {};

  // TODO: Implement WordPress GraphQL search query
  // For now, filtering on client-side
  throw new Error(
    'Search functionality is not yet implemented. ' +
    'Please use category filtering instead.'
  );
}

// ─── Featured & Trending ────────────────────────────────────────────────────────

export async function getFeaturedStories(limit: number = 1): Promise<Story[]> {
  try {
    const response = await fetchGraphQL<any>(GET_FEATURED_POSTS_QUERY, { first: limit }, {
      revalidate: REVALIDATE_STORIES,
      tags: ['featured-stories'],
    });

    return response.posts?.edges?.map((edge: any) => transformWPPostToStory(edge.node)) || [];
  } catch (error) {
    console.error('Error fetching featured stories from WordPress GraphQL:', error);
    throw error; // Don't fallback to mock data
  }
}

export async function getTrendingStories(limit: number = 6): Promise<Story[]> {
  try {
    const response = await fetchGraphQL<any>(GET_TRENDING_POSTS_QUERY, { first: limit }, {
      revalidate: REVALIDATE_STORIES,
      tags: ['trending-stories'],
    });

    return response.posts?.edges?.map((edge: any) => transformWPPostToStory(edge.node)) || [];
  } catch (error) {
    console.error('Error fetching trending stories from WordPress GraphQL:', error);
    throw error; // Don't fallback to mock data
  }
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
