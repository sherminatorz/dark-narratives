import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getFeaturedStory, getTrendingStories, getLatestStories, getAllCategories } from '@/services/storyService';
import StoryHero from '@/components/StoryHero';
import TrendingStories from '@/components/TrendingStories';
import StoryGrid from '@/components/StoryGrid';
import CategoryGrid from '@/components/CategoryGrid';
import FadeIn from '@/components/FadeIn';
import Link from 'next/link';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: 'Dark Chronicles — True Crime & Unsolved Mysteries',
    description: 'Cinematic storytelling exploring true crime, unsolved mysteries, and dark tales from around the world.',
    alternates: {
      languages: { en: '/en', fr: '/fr' },
    },
  };
}

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const [featured, trending, latest, categories] = await Promise.all([
    getFeaturedStory(),
    getTrendingStories(),
    getLatestStories(),
    getAllCategories(),
  ]);

  const heroStory = featured || (await getLatestStories(1))[0];

  return (
    <>
      {heroStory && <StoryHero story={heroStory} locale={locale} />}

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
        <CategoryGrid categories={categories} locale={locale} />
      </section>
    </>
  );
}
