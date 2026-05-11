/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  OmegaAPI — OmegaScans Client & Normalizer                 │
 * │  Author : Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ                                   │
 * │  License: MIT                                              │
 * │  Module : src/lib/omega.ts                                 │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Wraps the upstream OmegaScans REST API and normalizes raw
 * responses into clean, consistent TypeScript interfaces.
 *
 * Every public function returns a standard envelope:
 *   { success: boolean, data: T, pagination?: Pagination }
 */

import type {
  NormalizedSeries,
  NormalizedChapter,
  NormalizedChapterContent,
  PaginatedResponse,
  ApiResponse,
} from '@/types';

// ==================== CONSTANTS ====================

/** Upstream OmegaScans API base URL */
const OMEGA_BASE = 'https://api.omegascans.org';

// ==================== UPSTREAM TYPES ====================
// These interfaces mirror the raw JSON returned by OmegaScans.
// They are intentionally internal — consumers should use the
// Normalized* types from @/types instead.

interface OmegaMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  first_page: number;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  previous_page_url: string | null;
}

interface OmegaChapter {
  id: number;
  chapter_name: string;
  chapter_title: string | null;
  chapter_thumbnail: string;
  chapter_slug: string;
  price: number;
  created_at: string;
  series: {
    series_slug: string;
    id: number;
    latest_chapter: unknown | null;
    meta: Record<string, unknown>;
  };
  meta: Record<string, unknown>;
}

interface OmegaChapterContent {
  chapter: {
    id: number;
    series_id: number;
    season_id: number | null;
    index: string;
    chapter_name: string;
    chapter_title: string | null;
    chapter_data: {
      images: string[];
    };
    chapter_content: unknown | null;
    chapter_thumbnail: string;
    chapter_slug: string;
    price: number;
    created_at: string;
    series: {
      series_slug: string;
      id: number;
      title: string;
      thumbnail: string;
      status: string;
      description: string;
      meta: Record<string, unknown>;
    };
  };
}

interface OmegaSeries {
  id: number;
  title: string;
  description: string;
  alternative_names: string;
  series_type: string;
  series_slug: string;
  thumbnail: string;
  total_views: number;
  status: string;
  created_at: string;
  updated_at: string;
  badge: string | null;
  rating: number;
  release_schedule: Record<string, boolean>;
  nu_link: string | null;
  is_coming_soon: boolean;
  paid_chapters: unknown[];
  free_chapters: Array<{
    id: number;
    chapter_name: string;
    chapter_slug: string;
    created_at: string;
    series_id: number;
    index: string;
    chapters_to_be_freed: unknown[];
    meta: Record<string, unknown>;
  }>;
}

interface OmegaSeriesDetail {
  id: number;
  title: string;
  series_slug: string;
  thumbnail: string;
  total_views: number;
  description: string;
  series_type: string;
  tags: Array<{ id: number; name: string; description: string; created_at: string; updated_at: string; color: string }>;
  rating: number;
  status: string;
  release_schedule: Record<string, boolean>;
  nu_link: string | null;
  seasons: unknown[];
  alternative_names: string;
  studio: string;
  author: string;
  release_year: string;
  ratings_count: number;
  viewer_rating: unknown | null;
  meta: {
    latest_update: unknown | null;
    folder_slug: string | null;
    metadata: Record<string, unknown>;
    chapters_count: string;
    who_bookmarked_count: string;
  };
}

// ==================== NORMALIZED TYPES (RE-EXPORTS) ====================

export type { NormalizedSeries, NormalizedChapter, NormalizedChapterContent, PaginatedResponse, ApiResponse };

// ==================== INTERNAL HELPERS ====================

/**
 * Generic fetch wrapper for the upstream OmegaScans API.
 *
 * @param path    - API path relative to OMEGA_BASE (e.g. "/query?type=series&page=1")
 * @param retries - Number of retry attempts on 5xx errors (default: 1)
 * @returns       - Parsed JSON response of type T
 * @throws        - Error if the upstream response is not OK after all retries
 *
 * NOTE: Uses Next.js `revalidate: 300` (5 min) for ISR caching at the fetch layer.
 * Retries once on 5xx errors with a 1-second delay to handle transient upstream failures.
 */
async function fetchOmega<T>(path: string, retries = 1): Promise<T> {
  const url = `${OMEGA_BASE}${path}`;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'OmegaAPI/1.0',
          'Accept': 'application/json',
        },
        next: { revalidate: 300 },
      });

      if (res.ok) return res.json();

      // ---- FEATURE: RETRY LOGIC ----
      // Only retry on 5xx (server errors), not 4xx (client errors)
      if (res.status >= 500 && attempt < retries) {
        await new Promise(r => setTimeout(r, 1000));
        continue;
      }

      throw new Error(`OmegaScans API error: ${res.status} ${res.statusText}`);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 1000));
        continue;
      }
    }
  }

  throw lastError || new Error('OmegaScans API error: unknown');
}

// ---- FEATURE: NORMALIZATION ----
// These functions transform raw upstream objects into the clean
// NormalizedSeries / NormalizedChapter / NormalizedChapterContent
// interfaces used by all API endpoints.

/**
 * Normalize a series from the list endpoint.
 *
 * NOTE: The list endpoint returns fewer fields than the detail endpoint.
 * Fields like `author`, `studio`, `tags`, and `bookmarksCount` are
 * only available via getSeriesDetail().
 *
 * @param series - Raw OmegaSeries from the upstream list API
 * @returns      - Clean NormalizedSeries object
 */
function normalizeSeries(series: OmegaSeries): NormalizedSeries {
  // Extract active release days from the boolean map
  // e.g. { monday: true, friday: true } → ["Monday", "Friday"]
  const days = Object.entries(series.release_schedule || {})
    .filter(([, v]) => v)
    .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1));

  return {
    id: series.id,
    title: series.title,
    slug: series.series_slug,
    description: stripHtml(series.description),
    thumbnail: normalizeImageUrl(series.thumbnail),
    cover: normalizeImageUrl(series.thumbnail),
    status: series.status,
    type: series.series_type,
    rating: Math.round(series.rating * 100) / 100,
    totalViews: series.total_views,
    alternativeNames: series.alternative_names || '',
    author: '',
    studio: '',
    releaseYear: '',
    releaseSchedule: days,
    tags: [],
    chaptersCount: series.free_chapters?.length || 0,
    bookmarksCount: 0,
    isComingSoon: series.is_coming_soon || false,
    badge: series.badge,
    createdAt: series.created_at,
    updatedAt: series.updated_at,
    chapters: (series.free_chapters || []).map((ch) => ({
      id: ch.id,
      name: ch.chapter_name,
      title: null,
      slug: ch.chapter_slug,
      thumbnail: '',
      price: 0,
      isFree: true,
      createdAt: ch.created_at,
      index: ch.index,
      url: `/api/v1/chapter/${series.series_slug}/${ch.chapter_slug}`,
    })),
    url: `/api/v1/series/${series.series_slug}`,
  };
}

/**
 * Normalize a series from the detail endpoint.
 *
 * NOTE: The detail endpoint includes extra fields (author, studio, tags,
 * bookmarksCount, chaptersCount) not available in the list endpoint.
 * It does NOT include chapters — those must be fetched separately.
 *
 * @param series - Raw OmegaSeriesDetail from the upstream detail API
 * @returns      - Clean NormalizedSeries object with enriched metadata
 */
function normalizeSeriesDetail(series: OmegaSeriesDetail): NormalizedSeries {
  const days = Object.entries(series.release_schedule || {})
    .filter(([, v]) => v)
    .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1));

  return {
    id: series.id,
    title: series.title,
    slug: series.series_slug,
    description: stripHtml(series.description),
    thumbnail: normalizeImageUrl(series.thumbnail),
    cover: normalizeImageUrl(series.thumbnail),
    status: series.status,
    type: series.series_type,
    rating: Math.round(series.rating * 100) / 100,
    totalViews: series.total_views,
    alternativeNames: series.alternative_names || '',
    author: series.author || '',
    studio: series.studio || '',
    releaseYear: series.release_year || '',
    releaseSchedule: days,
    tags: (series.tags || []).map((t) => typeof t === 'string' ? t : t.name),
    chaptersCount: parseInt(series.meta?.chapters_count || '0', 10),
    bookmarksCount: parseInt(series.meta?.who_bookmarked_count || '0', 10),
    isComingSoon: false,
    badge: null,
    createdAt: '',
    updatedAt: '',
    chapters: [],
    url: `/api/v1/series/${series.series_slug}`,
  };
}

/**
 * Normalize a single chapter object.
 *
 * @param ch         - Raw OmegaChapter from the upstream API
 * @param seriesSlug - Parent series slug (not included in chapter response)
 * @returns          - Clean NormalizedChapter object
 */
function normalizeChapter(ch: OmegaChapter, seriesSlug: string): NormalizedChapter {
  return {
    id: ch.id,
    name: ch.chapter_name,
    title: ch.chapter_title,
    slug: ch.chapter_slug,
    thumbnail: normalizeImageUrl(ch.chapter_thumbnail),
    price: ch.price,
    isFree: ch.price === 0,
    createdAt: ch.created_at,
    index: ch.meta?.index as string || '',
    url: `/api/v1/chapter/${seriesSlug}/${ch.chapter_slug}`,
  };
}

/**
 * Convert relative image paths to full URLs.
 *
 * NOTE: The upstream API returns images as relative paths like
 * "uploads/series/slug/chapter/001.jpg". This prepends the media CDN.
 *
 * @param url - Raw image path (relative or absolute)
 * @returns   - Full HTTPS URL to the image
 */
function normalizeImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://media.omegascans.org/${url.replace(/^\//, '')}`;
}

/**
 * Normalize chapter content (the reader payload with images).
 *
 * @param ch - Raw chapter object from the content endpoint
 * @returns  - Clean NormalizedChapterContent with resolved image URLs
 */
function normalizeChapterContent(ch: OmegaChapterContent['chapter']): NormalizedChapterContent {
  const rawImages = ch.chapter_data?.images || [];
  const images = rawImages.map(normalizeImageUrl);

  return {
    id: ch.id,
    name: ch.chapter_name,
    title: ch.chapter_title,
    slug: ch.chapter_slug,
    index: ch.index,
    price: ch.price,
    isFree: ch.price === 0,
    thumbnail: normalizeImageUrl(ch.chapter_thumbnail),
    images,
    pageCount: images.length,
    createdAt: ch.created_at,
    series: {
      id: ch.series.id,
      title: ch.series.title,
      slug: ch.series.series_slug,
      thumbnail: normalizeImageUrl(ch.series.thumbnail),
      status: ch.series.status,
      description: stripHtml(ch.series.description),
    },
    url: `/api/v1/chapter/${ch.series.series_slug}/${ch.chapter_slug}`,
  };
}

/**
 * Strip HTML tags and decode common HTML entities.
 *
 * @param html - Raw HTML string from the upstream API
 * @returns    - Plain text with entities decoded and whitespace normalized
 */
function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&ldquo;/g, '\u201C')
    .replace(/&rdquo;/g, '\u201D')
    .replace(/&mdash;/g, '\u2014')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ==================== PUBLIC API FUNCTIONS ====================
// ---- FEATURE: SERIES ----

/**
 * Fetch a paginated list of series, optionally filtered by search query.
 *
 * @param page    - Page number (1-indexed, default: 1)
 * @param perPage - Results per page (1–100, default: 20)
 * @param q       - Optional search query to filter by title
 * @returns       - Paginated list of normalized series
 */
export async function getSeriesList(
  page = 1,
  perPage = 20,
  q?: string
): Promise<PaginatedResponse<NormalizedSeries>> {
  const searchPath = q ? `/query?q=${encodeURIComponent(q)}&type=series&page=${page}` : `/query?type=series&page=${page}`;
  const data = await fetchOmega<{ meta: OmegaMeta; data: OmegaSeries[] }>(searchPath);

  return {
    success: true,
    data: data.data.map(normalizeSeries),
    pagination: {
      total: data.meta.total,
      perPage: data.meta.per_page,
      currentPage: data.meta.current_page,
      lastPage: data.meta.last_page,
      hasNext: !!data.meta.next_page_url,
      hasPrevious: !!data.meta.previous_page_url,
    },
  };
}

/**
 * Fetch detailed metadata for a single series by slug.
 *
 * @param slug - Series slug (e.g. "solo-leveling")
 * @returns    - Normalized series with enriched fields (author, tags, etc.)
 */
export async function getSeriesDetail(slug: string): Promise<ApiResponse<NormalizedSeries>> {
  const data = await fetchOmega<OmegaSeriesDetail>(`/series/${slug}`);
  return {
    success: true,
    data: normalizeSeriesDetail(data),
  };
}

// ---- FEATURE: CHAPTERS ----

/**
 * Fetch all chapters for a given series.
 *
 * NOTE: Uses a very high perPage (10000) to get all chapters in one request.
 * The upstream API doesn't support sorting, so results arrive in API order.
 *
 * @param seriesId   - Numeric series ID (from getSeriesDetail)
 * @param page       - Page number (default: 1)
 * @param perPage    - Results per page (default: 10000)
 * @param seriesSlug - Series slug for URL generation
 * @returns          - Paginated list of normalized chapters
 */
export async function getSeriesChapters(
  seriesId: number,
  page = 1,
  perPage = 10000,
  seriesSlug = ''
): Promise<PaginatedResponse<NormalizedChapter>> {
  const data = await fetchOmega<{ meta: OmegaMeta; data: OmegaChapter[] }>(
    `/chapter/query?page=${page}&perPage=${perPage}&series_id=${seriesId}`
  );

  return {
    success: true,
    data: data.data.map((ch) => normalizeChapter(ch, seriesSlug)),
    pagination: {
      total: data.meta.total,
      perPage: data.meta.per_page,
      currentPage: data.meta.current_page,
      lastPage: data.meta.last_page,
      hasNext: !!data.meta.next_page_url,
      hasPrevious: !!data.meta.previous_page_url,
    },
  };
}

/**
 * Fetch the content (images) of a specific chapter.
 *
 * @param seriesSlug  - Parent series slug
 * @param chapterSlug - Chapter slug
 * @returns           - Normalized chapter content with resolved image URLs
 */
export async function getChapterContent(
  seriesSlug: string,
  chapterSlug: string
): Promise<ApiResponse<NormalizedChapterContent>> {
  const data = await fetchOmega<OmegaChapterContent>(
    `/chapter/${seriesSlug}/${chapterSlug}`
  );
  return {
    success: true,
    data: normalizeChapterContent(data.chapter),
  };
}

// ---- FEATURE: SEARCH ----

/**
 * Search series by title.
 *
 * @param query - Search string
 * @param page  - Page number (default: 1)
 * @returns     - Paginated list of matching normalized series
 */
export async function searchSeries(
  query: string,
  page = 1
): Promise<PaginatedResponse<NormalizedSeries>> {
  const data = await fetchOmega<{ meta: OmegaMeta; data: OmegaSeries[] }>(
    `/query?q=${encodeURIComponent(query)}&type=series&page=${page}`
  );

  return {
    success: true,
    data: data.data.map(normalizeSeries),
    pagination: {
      total: data.meta.total,
      perPage: data.meta.per_page,
      currentPage: data.meta.current_page,
      lastPage: data.meta.last_page,
      hasNext: !!data.meta.next_page_url,
      hasPrevious: !!data.meta.previous_page_url,
    },
  };
}

// ==================== EOF ====================
