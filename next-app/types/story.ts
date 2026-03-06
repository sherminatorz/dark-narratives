import { Category } from './category';

export interface Story {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: Category;
  author: import('./author').Author;
  publishedAt: string;
  readingTime: number;
  featured: boolean;
  trending: boolean;
  tags: string[];
  location?: string;
  timeline?: { date: string; title: string; description: string }[];
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
