import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getCategories } from '@/lib/api';
import { type Locale } from '@/i18n/config';

export default async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'footer' });
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const categories = await getCategories();

  return (
    <footer className="bg-surface border-t border-border mt-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-4">
              <span className="text-crimson text-xl font-display font-bold">Dark</span>
              <span className="text-foreground text-xl font-display font-light">Chronicles</span>
            </Link>
            <p className="text-foreground-muted text-sm leading-relaxed">{t('tagline')}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li><Link href={`/${locale}`} className="text-foreground-muted hover:text-crimson text-sm transition-colors">{tNav('home')}</Link></li>
              <li><Link href={`/${locale}/stories`} className="text-foreground-muted hover:text-crimson text-sm transition-colors">{tNav('stories')}</Link></li>
              <li><Link href={`/${locale}/search`} className="text-foreground-muted hover:text-crimson text-sm transition-colors">{tNav('search')}</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">{t('categories')}</h3>
            <ul className="space-y-2">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${locale}/category/${cat.slug}`}
                    className="text-foreground-muted hover:text-crimson text-sm transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">{t('newsletter')}</h3>
            <p className="text-foreground-muted text-sm mb-4">{t('newsletterText')}</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder={t('emailPlaceholder')}
                className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-crimson"
              />
              <button
                type="submit"
                className="bg-crimson text-white px-4 py-2 rounded text-sm font-medium hover:bg-crimson-light transition-colors whitespace-nowrap"
              >
                {t('subscribe')}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-foreground-muted text-xs">
            © {new Date().getFullYear()} Dark Chronicles. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
