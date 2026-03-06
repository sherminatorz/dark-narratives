

# Next.js True Crime Storytelling Platform — Full Codebase Generation

## Overview
Generate the complete Next.js 14 App Router codebase with all pages, components, i18n, SEO files, static generation, and pagination. The preview won't render (Lovable runs Vite), but the code will be exportable and deployable to Vercel.

## Files to Generate

### Config & Root
- `next.config.js` — Next.js config with next-intl plugin, image domains (Unsplash)
- `tailwind.config.ts` — Dark theme colors, Playfair Display + Inter fonts
- `middleware.ts` — Locale detection, redirect `/` → `/en`
- `package.json` — Next.js 14, next-intl, dependencies

### SEO Files
- `app/sitemap.ts` — Dynamic sitemap from all stories/categories
- `app/robots.ts` — Allow all crawlers, reference sitemap

### Data Layer
- `lib/types.ts` — Story, Category, Author interfaces
- `lib/mock-data.ts` — 10+ realistic true crime stories, 6 categories, mock images
- `lib/api.ts` — `getStories()`, `getStoryBySlug()`, `getCategories()`, `searchStories()` with pagination support; structured to swap mock data for WordPress REST API fetch calls

### i18n
- `i18n/config.ts` — Locale config (en, fr)
- `i18n/en.json` / `i18n/fr.json` — UI string translations
- `i18n/request.ts` — next-intl server config

### Layouts
- `app/[locale]/layout.tsx` — Root layout with fonts, Navbar, Footer, metadata
- `app/layout.tsx` — HTML shell

### Pages (all with `generateMetadata()`)
- `app/[locale]/page.tsx` — Homepage: Hero, Trending (horizontal scroll), Latest grid, Category blocks
- `app/[locale]/story/[slug]/page.tsx` — Story detail with `generateStaticParams()`, reading progress bar, share buttons, related stories, JSON-LD structured data
- `app/[locale]/stories/page.tsx` — All stories listing with pagination (page query param)
- `app/[locale]/category/[slug]/page.tsx` — Category filtered stories with pagination
- `app/[locale]/search/page.tsx` — Search with query-based filtering
- `app/not-found.tsx` — 404 page

### Components
- `components/Navbar.tsx` — Logo, nav links, language switcher, mobile menu
- `components/Footer.tsx` — Category links, newsletter input, copyright
- `components/StoryCard.tsx` — Dark card with Next.js Image, red badge, hover zoom/glow
- `components/StoryHero.tsx` — Full-width cinematic hero with gradient overlay
- `components/StoryGrid.tsx` — Responsive grid of StoryCards
- `components/CategoryGrid.tsx` — Visual category blocks with images
- `components/SearchBar.tsx` — Search input with icon
- `components/ReadingProgressBar.tsx` — Crimson scroll-tracking bar
- `components/ShareButtons.tsx` — Twitter, Facebook, copy link
- `components/RelatedStories.tsx` — Grid of related story cards
- `components/Pagination.tsx` — Previous/Next with page numbers
- `components/TrendingStories.tsx` — Horizontal scrollable Netflix-style row
- `components/FadeIn.tsx` — Intersection Observer scroll reveal wrapper

### Key Technical Details
- All images use `next/image` with proper width/height/alt
- `generateStaticParams()` on story pages for SSG
- Pagination via `?page=` query params, configurable page size
- Data layer functions accept `{ page, perPage, locale }` params
- WordPress-ready: each API function has commented fetch call ready to uncomment

