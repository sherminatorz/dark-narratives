import { MetadataRoute } from 'next';
import { getAllStorySlugs, getCategories, getSiteUrl } from '@/lib/api';
import { locales } from '@/i18n/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const slugs = await getAllStorySlugs();
  const cats = await getCategories();

  const staticPages = locales.flatMap((locale) => [
    { url: `${siteUrl}/${locale}`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${siteUrl}/${locale}/stories`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${siteUrl}/${locale}/search`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.5 },
  ]);

  const storyPages = locales.flatMap((locale) =>
    slugs.map((slug) => ({
      url: `${siteUrl}/${locale}/story/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))
  );

  const categoryPages = locales.flatMap((locale) =>
    cats.map((cat) => ({
      url: `${siteUrl}/${locale}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...storyPages, ...categoryPages];
}
