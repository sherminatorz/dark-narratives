import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { searchStories } from '@/lib/api';
import StoryGrid from '@/components/StoryGrid';
import SearchBar from '@/components/SearchBar';
import PaginationControls from '@/components/Pagination';
import FadeIn from '@/components/FadeIn';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'search' });
  return {
    title: t('title'),
    description: 'Search through our collection of true crime stories and unsolved mysteries.',
  };
}

export default async function SearchPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { q?: string; page?: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'search' });
  const query = searchParams.q || '';
  const page = parseInt(searchParams.page || '1', 10);

  const result = query ? await searchStories(query, { page, perPage: 9 }) : null;

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 max-w-[1400px] mx-auto">
      <FadeIn>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-8">{t('title')}</h1>
      </FadeIn>

      <div className="max-w-xl mb-12">
        <SearchBar locale={locale} initialQuery={query} />
      </div>

      {result && (
        <>
          <p className="text-foreground-muted mb-8">
            {result.total} {t('results')}
          </p>

          {result.data.length > 0 ? (
            <>
              <StoryGrid stories={result.data} locale={locale} />
              {result.totalPages > 1 && (
                <div className="mt-12">
                  <PaginationControls
                    currentPage={result.page}
                    totalPages={result.totalPages}
                    basePath={`/${locale}/search?q=${encodeURIComponent(query)}`}
                    locale={locale}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-foreground-muted text-lg mb-2">{t('noResults')}</p>
              <p className="text-foreground-muted/60">{t('tryAgain')}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
