import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getStories, getCategories } from '@/lib/api';
import StoryHero from '@/components/StoryHero';
import TrendingStories from '@/components/TrendingStories';
import StoryGrid from '@/components/StoryGrid';
import CategoryGrid from '@/components/CategoryGrid';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'nav' });
  return {
    title: 'Dark Chronicles — True Crime & Unsolved Mysteries',
    description: 'Cinematic storytelling exploring true crime, unsolved mysteries, and dark tales from around the world.',
    alternates: {
      languages: { en: '/en', fr: '/fr' },
    },
  };
}

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale });
  const { data: allStories } = await getStories({ perPage: 100 });
  const featured = allStories.find((s) => s.featured) || allStories[0];
  const trending = allStories.filter((s) => s.trending);
  const latest = allStories.slice(0, 6);
  const cats = await getCategories();

  return (
    <>
      {/* Hero */}
      <StoryHero story={featured} locale={locale} />

      {/* Trending */}
      <section className="py-16 px-4 md:px-8 max-w-[1400px] mx-auto">
        <FadeIn>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-display font-bold text-crimson">
              {t('home.trending')}
            </h2>
          </div>
        </FadeIn>
        <TrendingStories stories={trending} locale={locale} />
      </section>

      {/* Latest Stories */}
      <section className="py-16 px-4 md:px-8 max-w-[1400px] mx-auto">
        <FadeIn>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-display font-bold">{t('home.latest')}</h2>
            <Link
              href={`/${locale}/stories`}
              className="text-crimson hover:text-crimson-light transition-colors text-sm font-medium"
            >
              {t('home.viewAll')} →
            </Link>
          </div>
        </FadeIn>
        <StoryGrid stories={latest} locale={locale} />
      </section>

      {/* Categories */}
      <section className="py-16 px-4 md:px-8 max-w-[1400px] mx-auto">
        <FadeIn>
          <h2 className="text-3xl font-display font-bold mb-8">{t('home.categories')}</h2>
        </FadeIn>
        <CategoryGrid categories={cats} locale={locale} />
      </section>
    </>
  );
}
