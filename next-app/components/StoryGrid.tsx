import { Story } from '@/lib/types';
import StoryCard from './StoryCard';
import FadeIn from './FadeIn';

interface StoryGridProps {
  stories: Story[];
  locale: string;
}

export default function StoryGrid({ stories, locale }: StoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map((story, i) => (
        <FadeIn key={story.id} delay={i * 100}>
          <StoryCard story={story} locale={locale} />
        </FadeIn>
      ))}
    </div>
  );
}
