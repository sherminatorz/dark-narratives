import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getStoryBySlug, getAllStorySlugs, getRelatedStories, getSiteUrl } from '@/lib/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import ShareButtons from '@/components/ShareButtons';
import RelatedStories from '@/components/RelatedStories';
import FadeIn from '@/components/FadeIn';
import { locales } from '@/i18n/config';

export async function generateStaticParams() {
  const slugs = await getAllStorySlugs();
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const story = await getStoryBySlug(slug);
  if (!story) return { title: 'Story Not Found' };

  const siteUrl = getSiteUrl();

  return {
    title: story.title,
    description: story.excerpt,
    openGraph: {
      title: story.title,
      description: story.excerpt,
      type: 'article',
      publishedTime: story.publishedAt,
      authors: [story.author.name],
      images: [{ url: story.image, width: 1200, height: 630, alt: story.title }],
      url: `${siteUrl}/${locale}/story/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: story.title,
      description: story.excerpt,
      images: [story.image],
    },
    alternates: {
      languages: {
        en: `/en/story/${slug}`,
        fr: `/fr/story/${slug}`,
      },
    },
  };
}

export default async function StoryPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  const t = await getTranslations({ locale, namespace: 'story' });
  const story = await getStoryBySlug(slug);

  if (!story) notFound();

  const related = await getRelatedStories(story);
  const siteUrl = getSiteUrl();
  const storyUrl = `${siteUrl}/${locale}/story/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: story.title,
    description: story.excerpt,
    image: story.image,
    datePublished: story.publishedAt,
    author: {
      '@type': 'Person',
      name: story.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dark Chronicles',
    },
  };

  return (
    <>
      <ReadingProgressBar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Image */}
      <div className="relative w-full h-[60vh] md:h-[70vh]">
        <Image
          src={story.image}
          alt={story.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-[900px]">
          <FadeIn>
            <span className="inline-block bg-crimson text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded mb-4">
              {story.category.name}
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-4">
              {story.title}
            </h1>
            <div className="flex items-center gap-4 text-foreground-muted text-sm">
              <div className="flex items-center gap-2">
                <Image
                  src={story.author.avatar}
                  alt={story.author.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span>{t('by')} {story.author.name}</span>
              </div>
              <span>•</span>
              <span>{story.readingTime} {t('readingTime')}</span>
              <span>•</span>
              <time>{new Date(story.publishedAt).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-[750px] mx-auto px-4 md:px-8 py-12">
        <FadeIn>
          <div
            className="prose prose-invert prose-lg max-w-none
              prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-6
              prose-headings:font-display prose-headings:text-foreground
              prose-a:text-crimson prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: story.content }}
          />
        </FadeIn>

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-foreground-muted text-sm mb-4">{t('share')}</p>
          <ShareButtons url={storyUrl} title={story.title} />
        </div>

        {/* Back link */}
        <div className="mt-8">
          <Link
            href={`/${locale}/stories`}
            className="text-crimson hover:text-crimson-light transition-colors text-sm"
          >
            ← {t('backToStories')}
          </Link>
        </div>
      </article>

      {/* Related Stories */}
      {related.length > 0 && (
        <section className="py-16 px-4 md:px-8 max-w-[1400px] mx-auto">
          <FadeIn>
            <h2 className="text-2xl font-display font-bold mb-8">{t('related')}</h2>
          </FadeIn>
          <RelatedStories stories={related} locale={locale} />
        </section>
      )}
    </>
  );
}
