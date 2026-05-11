# Changelog

All notable changes to OmegaAPI will be documented in this file.

## [3.0.3] - 2026-05-11

### Fixed
- Fixed chapter images not loading: relative image paths (e.g. `uploads/series/...`) are now normalized to full URLs (`https://media.omegascans.org/...`)
- Fixed series thumbnails and covers: all image URLs now normalized through `normalizeImageUrl()` helper
- Fixed chapter thumbnails: normalized through the same helper
- Fixed Common Recipes section overflow on mobile: added `overflow-hidden` to recipe cards
- Removed JSON API links from browse series detail page (nav bar and bottom)
- Removed JSON API link from chapter reader footer

## [3.0.2] - 2026-05-11

### Changed
- Complete README.md rewrite matching ShineiAPI style
- Added centered header with badges (license, stars, forks, issues, PRs)
- Added tech stack badges (Next.js, Vercel, Node.js, Tailwind, TypeScript)
- Added table of contents with anchor links to all sections
- Added About, Why OmegaAPI, Key Features sections
- Added detailed API endpoint documentation with parameters and response examples
- Added code examples in JavaScript, Python, cURL+jq, Go, PHP, Ruby
- Added collapsible sections for response examples
- Added FAQ section with 10 common questions
- Added Contributing guide with commit conventions
- Added Tech Stack, Project Structure, Local Development, Deployment sections
- Added Legal Disclaimer, Acknowledgments, and footer links

## [3.0.1] - 2026-05-11

### Added
- Chapter reader: bottom navigation bar with Previous Chapter, Home (Series), Chapter List dropdown, and Next Chapter buttons
- Chapter reader: fetches chapter list to determine prev/next navigation
- Chapter reader: hover dropdown showing all chapters with current chapter highlighted
- Next chapter button styled as primary (red with brutal shadow), prev as secondary
- Added IconHome icon component

## [3.0.0] - 2026-05-11

### Changed
- Complete frontend redesign with Neo-Brutalist × Apple Polish design language
- Landing page: Cool navy/cyan/amber color scheme with bold uppercase headings, brutalist buttons, card-lift effects, terminal-style code blocks, pill-tag badges, marquee banner, reveal animations, animated counters, recipe tabs, live playground
- Browse page: Full manhwa website style with dark theme (#121218 bg), featured series banner, horizontal scroll rows (Popular, Trending, Top Rated), cover-focused series cards with rating badges and hover overlays, debounced search with autocomplete dropdown, genre filter pills, series detail modal with banner/cover/synopsis/metadata/chapters, skeleton loaders, scroll row navigation
- Series detail page: Dark theme with brutalist styling, genre pills, dark chapter list
- Chapter reader: Dark theme for immersive reading experience
- Docs, Support, Terms, Privacy pages: Updated nav/footer with new design system
- globals.css: New design tokens for light (landing) and dark (browse) themes, brutalist component classes, syntax highlighting tokens, reveal animations, shadow tokens, font-display class, heartbeat animation
- tailwind.config.js: Added primary/secondary/tertiary/accent color scales, surface colors, display font family, container max-width
- components/icons.tsx: Added 16 new icons (IconArrowRight, IconArrowLeft, IconGithub, IconStarFilled, IconCopy, IconCheck, IconCode, IconSparkles, IconHeart, IconLayers, IconTerminal, IconShuffle, IconTrophy, IconTag, IconMenu, IconX, IconFire, IconCrown)
- components/layout.tsx: Redesigned Navbar with light/dark theme support, brutalist logo, uppercase tracking; Footer with dark background, heartbeat animation, brutalist links

## [2.1.1] - 2026-05-11

### Added
- robots.txt allowing all crawlers, disallowing /api/, pointing to sitemap
- Dynamic sitemap.xml (Next.js App Router sitemap.ts) with all static pages and series pages
- Sitemap auto-fetches series slugs from API, revalidates hourly

## [2.1.0] - 2026-05-11

### Added
- SVG favicon with Ω symbol and gradient background
- PNG favicon variants (16x16, 32x32, 180x180 apple-touch-icon)
- OG image (1200x630 PNG) for social media sharing
- Full Open Graph meta tags (title, description, image, locale, siteName, url)
- Twitter Card meta tags (summary_large_image with image)
- JSON-LD structured data (WebApplication schema with SearchAction)
- Canonical URL, robots meta, author/creator/publisher metadata
- Viewport meta with theme color
- Preconnect hints for Google Fonts

## [2.0.1] - 2026-05-11

### Fixed
- Fixed React error #31: tags returned as objects from upstream API caused client-side crash
- Tags are now properly normalized by extracting the `name` field from tag objects
- This was the root cause of the crash on `/browse/glory-hole-shop` and all series with tags
- Fixed code blocks overflowing on mobile in Common Recipes and other sections
- Added overflow-hidden and max-width constraints to glass-card and code-block elements
- Added mobile-specific styles for code blocks with touch-friendly scrolling

## [2.0.0] - 2026-05-11

### Changed
- Complete frontend redesign with clean light theme (white background, indigo accents, soft shadows)
- Replaced dark glassmorphism design with modern, minimal light aesthetic
- New CSS design system with CSS variables for consistent theming
- Updated all pages: Home, Browse, Series Detail, Chapter Reader, Docs, Support, Terms, Privacy
- Redesigned navbar with frosted glass effect on light background
- Updated code blocks to dark indigo theme (contrast against light UI)
- New card design with subtle shadows and hover states
- Updated hero section with mesh gradient background
- Improved typography spacing and hierarchy
- Light-themed search modal, playground, and interactive elements
- Updated tags, badges, buttons, and form inputs for light theme
- Responsive design improvements across all breakpoints

## [1.1.0] - 2026-05-11

### Fixed
- Fixed client-side crash on `/browse/[slug]` pages caused by missing null safety on `releaseSchedule`, `tags`, and `chapters` arrays
- Fixed `normalizeChapter` not populating the `index` field, breaking chapter sort order
- Fixed series detail API response structure when using `?include=chapters` (spread operator was flattening nested data)
- Added defensive `onError` handlers on all `<img>` elements to prevent render crashes on broken images
- Added fallback text for missing descriptions, covers, and series metadata
- Fixed chapter reader crash when `chapter.series` or `chapter.images` is undefined

### Changed
- Modularized codebase: extracted shared types to `src/types/index.ts`
- Extracted reusable icon components to `src/components/icons.tsx`
- Extracted shared layout components (Navbar, Footer) to `src/components/layout.tsx`
- Extracted shared UI utilities (CodeBlock, CopyBtn, formatViews, formatDate) to `src/components/ui.tsx`
- Series detail page now applies defensive normalization on API response data
- Chapter reader page now validates image array before rendering

## [1.0.0] - 2026-05-11

### Added
- Initial release of OmegaAPI
- Series browsing with search and pagination
- Series detail endpoint with optional chapter embedding
- Chapter list and chapter content endpoints
- Full-text search across all series
- Genre listing endpoint
- Health check with upstream probe
- API statistics endpoint
- In-memory caching with configurable TTL (5-15 min)
- IP-based rate limiting (60 req/min)
- CORS support for all origins
- Edge runtime on Vercel
- Landing page with live playground and ⌘K search
- Full API documentation page
- Browse interface with grid/list view modes
- Chapter reader with vertical and paged reading modes
- Terms of Service and Privacy Policy pages
- Support page with FAQ
