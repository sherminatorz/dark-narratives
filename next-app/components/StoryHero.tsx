import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Story } from '@/lib/types';
import FadeIn from './FadeIn';

interface StoryHeroProps {
  story: Story;
  locale: string;
}

export default async function StoryHero({ story, locale }: StoryHeroProps) {
  const t = await getTranslations({ locale, namespace: 'hero' });

  const publishDate = new Date(story.publishedAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section className="relative w-full h-[80vh] min-h-[600px]">
      <Image
        src={story.image}
        alt={story.title}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* Gradient overlays for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-20 max-w-[800px]">
        <FadeIn>
          <span className="inline-block bg-crimson text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded mb-4">
            {t('featured')}
          </span>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-5">
            {story.title}
          </h1>

          {/* Metadata overlay */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-foreground-muted text-sm mb-6">
            <span className="flex items-center gap-1.5">
              <span>⏱</span> {story.readingTime} {t('minRead')}
            </span>
            <span className="flex items-center gap-1.5">
              <span>📅</span> {publishDate}
            </span>
            <span className="flex items-center gap-1.5">
              <span>✍</span> {story.author.name}
            </span>
          </div>

          <p className="text-foreground/80 text-base md:text-lg leading-relaxed mb-6 max-w-lg">
            {story.excerpt}
          </p>

          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/story/${story.slug}`}
              className="inline-flex items-center gap-2 bg-crimson text-white px-6 py-3 rounded-lg font-medium hover:bg-crimson-light transition-colors"
            >
              {t('readMore')}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
