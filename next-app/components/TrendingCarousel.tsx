'use client';

import { useRef, useState, useEffect } from 'react';
import { Story } from '@/lib/types';
import StoryCard from './StoryCard';

interface TrendingCarouselProps {
  stories: Story[];
  locale: string;
}

export default function TrendingCarousel({ stories, locale }: TrendingCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    return () => el.removeEventListener('scroll', checkScroll);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div className="relative group">
      {/* Left fade + arrow */}
      {canScrollLeft && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-foreground hover:bg-crimson hover:border-crimson hover:text-white transition-all opacity-0 group-hover:opacity-100"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 4l-4 4 4 4" />
            </svg>
          </button>
        </>
      )}

      {/* Right fade + arrow */}
      {canScrollRight && (
        <>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-foreground hover:bg-crimson hover:border-crimson hover:text-white transition-all opacity-0 group-hover:opacity-100"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 4l4 4-4 4" />
            </svg>
          </button>
        </>
      )}

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth -mx-4 px-4"
      >
        {stories.map((story) => (
          <div key={story.id} className="min-w-[280px] md:min-w-[340px] lg:min-w-[380px] snap-start flex-shrink-0">
            <StoryCard story={story} locale={locale} />
          </div>
        ))}
      </div>
    </div>
  );
}
