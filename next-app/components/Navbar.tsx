'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { type Locale, locales, localeNames } from '@/i18n/config';

export default function Navbar({ locale }: { locale: Locale }) {
  const t = useTranslations('nav');
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/stories`, label: t('stories') },
    { href: `/${locale}/search`, label: t('search') },
  ];

  const otherLocale = locale === 'en' ? 'fr' : 'en';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <span className="text-crimson text-2xl font-display font-bold">Dark</span>
          <span className="text-foreground text-2xl font-display font-light">Chronicles</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground-muted hover:text-foreground transition-colors text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}

          {/* Language Switcher */}
          <Link
            href={`/${otherLocale}`}
            className="text-xs uppercase tracking-wider border border-border px-3 py-1.5 rounded hover:border-crimson hover:text-crimson transition-colors"
          >
            {localeNames[otherLocale]}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground p-2"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface border-b border-border">
          <div className="px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-foreground-muted hover:text-foreground transition-colors text-sm font-medium py-2"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`/${otherLocale}`}
              className="text-xs uppercase tracking-wider border border-border px-3 py-1.5 rounded w-fit hover:border-crimson hover:text-crimson transition-colors"
            >
              {localeNames[otherLocale]}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
