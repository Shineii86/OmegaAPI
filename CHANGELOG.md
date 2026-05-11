# Changelog

All notable changes to OmegaAPI will be documented in this file.

## [3.3.1] - 2026-05-12

### Fixed
- Table of Contents links now work correctly on GitHub — removed emojis from heading anchors that caused mismatched `#id` generation
- Updated latest version reference in README Changelog section to v3.3.0

### Added
- 18+ content warning message at top of README.md

## [3.3.0] - 2026-05-12

### Added
- Search index caching in localStorage with 1-hour TTL — saves ~30KB bandwidth per visit by avoiding full re-fetch on every page load
- Sort controls in "View All" mode: Latest, Top Rated, Most Viewed, A–Z — instant client-side sorting
- "Latest Updates" scroll row on browse page showing recently updated series (sorted by `updatedAt`)
- Image preloading in paged chapter reader — preloads next 3 pages via `new Image()` to eliminate white flash on page turn
- 18+ age verification gate on browse page — full-screen overlay with age confirmation, persists choice in localStorage so it never reappears for returning users

## [3.2.5] - 2026-05-12

### Added
- Dismiss button on "Continue Reading" section to clear reading history
- Footer component location documented: `src/components/layout.tsx`

## [3.2.4] - 2026-05-12

### Fixed
- Search now indexes ALL 263 series (was only searching first 40)
- Background fetch loads all series pages on browse page load for comprehensive search
- Search results are now accurate and complete

## [3.2.3] - 2026-05-12

### Fixed
- Landing page Common Recipes code blocks wrap on mobile instead of overflowing (white-space: pre-wrap)
- Added overflow-x: hidden to landing page main container as safety net
- Code blocks use word-break: break-all to handle long lines on small screens

## [3.2.2] - 2026-05-12

### Fixed
- View All grid cards now responsive (auto-width in grids, fixed 160px only in scroll rows)
- Grid cards use full available width instead of fixed 160px on all screen sizes
- Skeleton cards also responsive in grid layouts

### Added
- Search button in search overlay (appears when query is 2+ characters)
- Enter key also triggers search in the overlay input

## [3.2.1] - 2026-05-12

### Fixed
- Fixed Common Recipes code block horizontal overflow on mobile (proper fix)
- Code blocks now scroll horizontally within their container instead of overflowing the page
- Changed `.code-block` to `overflow-x: auto` so scrollbar is visible (was `overflow: hidden` which clipped the scrollbar)
- Set `.code-block pre` to `min-width: max-content` so code doesn't wrap
- Code blocks extend edge-to-edge within cards on mobile via negative margins

## [3.2.0] - 2026-05-12

### Added
- Grid/List view toggle in "View All" mode with IconGrid and IconList icons
- Genre synced to URL params (`/browse?genre=action`) — shareable filtered views
- Client-side search: filters by title, alternative names, author, and tags (upstream API ignores query param)

### Fixed
- Search overlay now actually filters results (was returning same results for any query due to upstream API bug)
- View All grid gap increased from `gap-4` to `gap-5` for better card spacing
- List view shows series in compact rows with thumbnail, title, rating, chapters, status, type, and bookmark button

## [3.1.1] - 2026-05-12

### Changed
- Added emojis to all README.md section headers, feature tables, and comparison tables
- Updated latest changelog version to v3.1.0 in README
- Updated GitHub repository description and topics (manga-api, manhwa, webtoon, rest-api, nextjs, typescript, vercel, free-api, cors, manga-reader, omega-scans, neo-brutalist)

## [3.1.0] - 2026-05-12

### Added
- Reading history: tracks last read chapter per series in localStorage, shows "Continue Reading" scroll row with progress bar on browse page
- Bookmarks / My List: heart button on series cards and detail modal, "My List" scroll row showing bookmarked series on browse page
- Recent searches: shown in search overlay before typing, with clear history button
- Reading position save/restore: scroll position saved per chapter in sessionStorage, restored on revisit
- `src/lib/storage.ts`: localStorage utility module for history, bookmarks, recent searches, and reading position
- IconClock component added to icon library
- IconHeart now accepts `fill` prop for filled/unfilled states

### Changed
- ManhwaCard component now includes bookmark button (heart icon) on cover overlay
- Series Detail Modal now includes bookmark toggle button in action area
- SearchOverlay saves query to recent searches on result selection
- Chapter reader saves reading history on chapter load with chapter index and total count

## [3.0.7] - 2026-05-12

### Fixed
- Fixed Common Recipes code blocks overflowing horizontally on mobile by extending them edge-to-edge within cards (negative margins, removed side borders/shadow)
- Added `min-width: 0` to `.code-block` and `.card-brutal` on mobile to prevent grid blowout
- Set `white-space: pre` and `word-break: normal` on mobile `pre` elements for consistent overflow-x scrolling

## [3.0.6] - 2026-05-12

### Added
- Browse page: "View All" button on Popular section to see all series in a paginated grid
- View All mode: full grid layout with "Load More" button showing count (e.g. "Load More (40 of 263)")
- Back button to return from View All and genre-filtered views

## [3.0.5] - 2026-05-12

### Added
- Custom 404 page with large 404 text, NOT FOUND pill badge, and navigation buttons (Home, Browse Series, API Docs)

## [3.0.4] - 2026-05-11

### Fixed
- Featured banner cover image now always visible (removed hidden sm:block that hid it on mobile)
- Featured banner uses inline styles for cross-browser reliability
- Cover image onError falls back to thumbnail instead of hiding

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
