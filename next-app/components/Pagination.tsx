import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  locale: string;
}

export default async function PaginationControls({
  currentPage,
  totalPages,
  basePath,
  locale,
}: PaginationControlsProps) {
  const t = await getTranslations({ locale, namespace: 'pagination' });

  const separator = basePath.includes('?') ? '&' : '?';

  const getPageUrl = (page: number) => `${basePath}${separator}page=${page}`;

  const pages: (number | '...')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="px-4 py-2 text-sm border border-border rounded hover:border-crimson hover:text-crimson transition-colors"
        >
          {t('previous')}
        </Link>
      ) : (
        <span className="px-4 py-2 text-sm border border-border rounded text-foreground-muted/40 cursor-not-allowed">
          {t('previous')}
        </span>
      )}

      {/* Page Numbers */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-foreground-muted">…</span>
        ) : (
          <Link
            key={p}
            href={getPageUrl(p)}
            className={`w-10 h-10 flex items-center justify-center text-sm rounded transition-colors ${
              p === currentPage
                ? 'bg-crimson text-white'
                : 'border border-border hover:border-crimson hover:text-crimson'
            }`}
          >
            {p}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="px-4 py-2 text-sm border border-border rounded hover:border-crimson hover:text-crimson transition-colors"
        >
          {t('next')}
        </Link>
      ) : (
        <span className="px-4 py-2 text-sm border border-border rounded text-foreground-muted/40 cursor-not-allowed">
          {t('next')}
        </span>
      )}
    </nav>
  );
}
