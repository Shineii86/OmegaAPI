/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  OmegaAPI — Shared Type Definitions                        │
 * │  Author : Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ                                   │
 * │  License: MIT                                              │
 * │  Module : src/types/index.ts                               │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Canonical TypeScript interfaces for all normalized API data.
 * These types are shared between API routes and frontend components.
 *
 * Naming convention:
 *   - Upstream raw types → Omega* (internal to src/lib/omega.ts)
 *   - Normalized public types → Chapter, Series, ChapterData, etc.
 */

// ==================== CHAPTER TYPES ====================
// ---- FEATURE: CHAPTER ----

/**
 * A chapter entry in a series chapter list.
 * Returned by: GET /api/v1/chapters/:slug
 */
export interface Chapter {
  id: number;
  name: string;           // e.g. "Chapter 1"
  title: string | null;   // Optional subtitle
  slug: string;           // URL-safe identifier
  thumbnail: string;      // Chapter cover image URL
  price: number;          // 0 = free, >0 = paid (upstream)
  isFree: boolean;        // Derived: price === 0
  createdAt: string;      // ISO 8601 timestamp
  index: string;          // Sort key (e.g. "1", "1.5", "2")
  url: string;            // API endpoint for this chapter
}

// ---- FEATURE: CHAPTER DATA ----

/**
 * Full chapter content with images for the reader.
 * Returned by: GET /api/v1/chapter/:slug/:chapter
 */
export interface ChapterData {
  id: number;
  name: string;
  title: string | null;
  slug: string;
  index: string;
  price: number;
  isFree: boolean;
  thumbnail: string;
  images: string[];       // Ordered array of page image URLs
  pageCount: number;      // images.length
  createdAt: string;
  series: {               // Parent series metadata (for nav breadcrumbs)
    id: number;
    title: string;
    slug: string;
    thumbnail: string;
    status: string;
    description: string;
  };
}

// ==================== SERIES TYPES ====================
// ---- FEATURE: SERIES ----

/**
 * A series with optional embedded chapters.
 * Returned by: GET /api/v1/series (list) and GET /api/v1/series/:slug (detail)
 *
 * NOTE: The list endpoint returns empty `tags`, `author`, `studio`.
 * Use `?include=chapters` on the detail endpoint to populate `chapters`.
 */
export interface Series {
  id: number;
  title: string;
  slug: string;
  description: string;        // Plain text (HTML stripped)
  thumbnail: string;          // Cover image URL
  cover: string;              // Same as thumbnail (alias)
  status: string;             // e.g. "Ongoing", "Completed"
  type: string;               // e.g. "manga", "manhwa"
  rating: number;             // 0–5 scale (2 decimal places)
  totalViews: number;
  alternativeNames: string;   // Comma-separated aliases
  author: string;             // Only populated from detail endpoint
  studio: string;             // Only populated from detail endpoint
  releaseYear: string;        // Only populated from detail endpoint
  releaseSchedule: string[];  // e.g. ["Monday", "Friday"]
  tags: string[];             // Only populated from detail endpoint
  chaptersCount: number;      // From detail endpoint metadata
  bookmarksCount: number;     // From detail endpoint metadata
  isComingSoon: boolean;
  badge: string | null;       // e.g. "HOT", "NEW"
  createdAt: string;
  updatedAt: string;
  chapters: Chapter[];        // Only populated with ?include=chapters
  url: string;                // API endpoint for this series
}

// ==================== PAGINATION ====================
// ---- FEATURE: PAGINATION ----

/**
 * Pagination metadata for paginated API responses.
 */
export interface Pagination {
  total: number;          // Total items across all pages
  perPage: number;        // Items per page
  currentPage: number;    // Current page (1-indexed)
  lastPage: number;       // Last available page
  hasNext: boolean;       // Whether a next page exists
  hasPrevious: boolean;   // Whether a previous page exists
}

// ==================== API ENVELOPE ====================
// ---- FEATURE: API RESPONSE ----

/**
 * Standard API response envelope.
 *
 * All endpoints return this shape. For paginated endpoints,
 * the `pagination` field is included. For errors, `error` is set.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  pagination?: Pagination;
}

// ==================== EOF ====================
