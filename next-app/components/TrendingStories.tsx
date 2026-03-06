import { Story } from '@/lib/types';
import StoryCard from './StoryCard';

interface TrendingStoriesProps {
  stories: Story[];
  locale: string;
}

export default function TrendingStories({ stories, locale }: TrendingStoriesProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
      {stories.map((story) => (
        <div key={story.id} className="min-w-[300px] md:min-w-[350px] snap-start flex-shrink-0">
          <StoryCard story={story} locale={locale} />
        </div>
      ))}
    </div>
  );
}
