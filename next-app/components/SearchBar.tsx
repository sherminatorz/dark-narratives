'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface SearchBarProps {
  locale: string;
  initialQuery?: string;
}

export default function SearchBar({ locale, initialQuery = '' }: SearchBarProps) {
  const t = useTranslations('search');
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('placeholder')}
        className="w-full bg-surface border border-border rounded-lg px-4 py-3 pl-12 text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-crimson transition-colors"
      />
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    </form>
  );
}
