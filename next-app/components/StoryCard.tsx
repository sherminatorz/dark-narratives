import Image from 'next/image';
import Link from 'next/link';
import { Story } from '@/lib/types';

interface StoryCardProps {
  story: Story;
  locale: string;
}

export default function StoryCard({ story, locale }: StoryCardProps) {
  return (
    <Link href={`/${locale}/story/${story.slug}`} className="group block">
      <article className="bg-surface rounded-lg overflow-hidden border border-border hover:border-crimson/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(177,18,38,0.2)] hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={story.image}
            alt={story.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60" />
          <span className="absolute top-3 left-3 bg-crimson text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
            {story.category.name}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-display font-semibold leading-snug mb-2 group-hover:text-crimson group-hover:brightness-125 transition-all line-clamp-2">
            {story.title}
          </h3>
          <p className="text-foreground-muted text-sm leading-relaxed line-clamp-2 mb-4">
            {story.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-foreground-muted">
            <span>{story.author.name}</span>
            <span>{story.readingTime} min</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
