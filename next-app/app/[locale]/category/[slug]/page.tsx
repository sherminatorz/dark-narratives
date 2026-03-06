import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getStoriesByCategory } from '@/services/storyService';
import { getCategoryBySlug, getCategories } from '@/lib/api';
import { notFound } from 'next/navigation';
import StoryGrid from '@/components/StoryGrid';
import PaginationControls from '@/components/Pagination';
import FadeIn from '@/components/FadeIn';
import { locales } from '@/i18n/config';

export async function generateStaticParams() {
  const categories = await getCategories();
  return locales.flatMap((locale) =>
    categories.map((category) => ({ locale, slug: category.slug }))
  );
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: 'Category Not Found' };

  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({
  params: { locale, slug },
  searchParams,
}: {
  params: { locale: string; slug: string };
  searchParams: { page?: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'category' });
  const category = await getCategoryBySlug(slug);

  if (!category) notFound();

  const page = parseInt(searchParams.page || '1', 10);
  const result = await getStoriesByCategory(slug, { page, perPage: 9 });

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 max-w-[1400px] mx-auto">
      <FadeIn>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
          {t('storiesIn')} {category.name}
        </h1>
        <p className="text-foreground-muted text-lg mb-12 max-w-2xl">{category.description}</p>
      </FadeIn>

      {result.data.length > 0 ? (
        <>
          <StoryGrid stories={result.data} locale={locale} />
          {result.totalPages > 1 && (
            <div className="mt-12">
              <PaginationControls
                currentPage={result.page}
                totalPages={result.totalPages}
                basePath={`/${locale}/category/${slug}`}
                locale={locale}
              />
            </div>
          )}
        </>
      ) : (
        <p className="text-foreground-muted">No stories found in this category.</p>
      )}
    </div>
  );
}
