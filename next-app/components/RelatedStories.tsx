import { Story } from '@/lib/types';
import StoryGrid from './StoryGrid';

interface RelatedStoriesProps {
  stories: Story[];
  locale: string;
}

export default function RelatedStories({ stories, locale }: RelatedStoriesProps) {
  return <StoryGrid stories={stories} locale={locale} />;
}
