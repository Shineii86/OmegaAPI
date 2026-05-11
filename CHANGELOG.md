# Changelog

All notable changes to OmegaAPI will be documented in this file.

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
