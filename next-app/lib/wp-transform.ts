/**
 * WordPress Data Transformation Functions
 * Converts WordPress GraphQL response to Dark Narratives types
 */

import { Story, Category } from '@/types';

/**
 * Transform WordPress GraphQL post to Story type
 */
export function transformWPPostToStory(wpPost: any): Story {
  const category = wpPost.categories?.edges?.[0]?.node;
  const author = wpPost.author?.node;
  const featuredImage = wpPost.featured?.node;

  return {
    id: wpPost.databaseId?.toString(),
    slug: wpPost.slug,
    title: wpPost.title,
    excerpt: wpPost.excerpt ? stripHtml(wpPost.excerpt) : '',
    content: wpPost.content || '',
    image: featuredImage?.sourceUrl || '',
    category: {
      id: category?.databaseId?.toString(),
      slug: category?.slug || 'uncategorized',
      name: category?.name || 'Uncategorized',
      description: category?.description || '',
      image: category?.acfCategoryImage?.sourceUrl || '',
      storyCount: 0, // Will be populated from category query
    },
    author: {
      id: author?.id?.toString(),
      name: author?.name || 'Unknown Author',
      avatar: author?.avatar?.url || '',
      bio: author?.acfAuthorBio || '',
    },
    publishedAt: wpPost.datePublished || new Date().toISOString(),
    readingTime: wpPost.readingTime || estimateReadingTime(wpPost.content),
    featured: wpPost.featured || false,
    trending: wpPost.trending || false,
    tags: wpPost.tags || [],
    location: wpPost.location || undefined,
    timeline: wpPost.timeline || undefined,
  };
}

/**
 * Transform WordPress GraphQL category to Category type
 */
export function transformWPCategoryToCategory(wpCategory: any): Category {
  return {
    id: wpCategory.databaseId?.toString(),
    slug: wpCategory.slug,
    name: wpCategory.name,
    description: wpCategory.description || '',
    image: wpCategory.acfCategoryImage?.sourceUrl || '',
    storyCount: wpCategory.posts?.pageInfo?.total || 0,
  };
}

/**
 * Estimate reading time in minutes (roughly 200 words per minute)
 */
export function estimateReadingTime(content: string): number {
  if (!content) return 0;
  const wordCount = stripHtml(content).split(/\s+/).length;
  return Math.ceil(wordCount / 200);
}

/**
 * Strip HTML tags from content
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();
}

/**
 * Format GraphQL errors for logging
 */
export function formatGraphQLError(error: any): string {
  if (error.message) {
    return error.message;
  }
  if (Array.isArray(error)) {
    return error.map((e) => e.message || JSON.stringify(e)).join('; ');
  }
  return JSON.stringify(error);
}
