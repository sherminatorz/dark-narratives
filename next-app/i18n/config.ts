export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
};

export const localeRoutes: Record<Locale, Record<string, string>> = {
  en: {
    story: 'story',
    stories: 'stories',
    category: 'category',
    search: 'search',
  },
  fr: {
    story: 'histoire',
    stories: 'histoires',
    category: 'categorie',
    search: 'recherche',
  },
};
