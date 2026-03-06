import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getStories } from '@/lib/api';
import StoryGrid from '@/components/StoryGrid';
import PaginationControls from '@/components/Pagination';
import FadeIn from '@/components/FadeIn';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'stories' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function StoriesPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { page?: string };
}) {
  const t = await getTranslations({ locale, namespace: 'stories' });
  const page = parseInt(searchParams.page || '1', 10);
  const perPage = 9;

  const result = await getStories({ page, perPage });

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 max-w-[1400px] mx-auto">
      <FadeIn>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{t('title')}</h1>
        <p className="text-foreground-muted text-lg mb-12 max-w-2xl">{t('subtitle')}</p>
      </FadeIn>

      <StoryGrid stories={result.data} locale={locale} />

      {result.totalPages > 1 && (
        <div className="mt-12">
          <PaginationControls
            currentPage={result.page}
            totalPages={result.totalPages}
            basePath={`/${locale}/stories`}
            locale={locale}
          />
        </div>
      )}
    </div>
  );
}
