import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/lib/types';
import FadeIn from './FadeIn';

interface CategoryGridProps {
  categories: Category[];
  locale: string;
}

export default function CategoryGrid({ categories, locale }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((cat, i) => (
        <FadeIn key={cat.id} delay={i * 80}>
          <Link
            href={`/${locale}/category/${cat.slug}`}
            className="group relative block h-48 rounded-lg overflow-hidden"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-crimson/60 transition-all duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-display font-bold">{cat.name}</h3>
              <p className="text-foreground-muted text-xs mt-1">{cat.storyCount} stories</p>
            </div>
          </Link>
        </FadeIn>
      ))}
    </div>
  );
}
