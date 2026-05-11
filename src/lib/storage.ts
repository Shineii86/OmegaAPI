/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  OmegaAPI — Browser Storage Utilities                      │
 * │  Author : Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ                                   │
 * │  License: MIT                                              │
 * │  Module : src/lib/storage.ts                               │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Client-side persistence layer using localStorage and sessionStorage.
 * Handles reading history, bookmarks, recent searches, and scroll position.
 *
 * All functions are SSR-safe — they check for `window` before accessing
 * storage, returning sensible defaults during server-side rendering.
 */

// ==================== READING HISTORY ====================
// ---- FEATURE: READING HISTORY ----

/**
 * A single reading history entry representing the last-read chapter
 * for a given series.
 */
export interface HistoryEntry {
  slug: string;           // Series slug (unique key)
  title: string;          // Series display title
  thumbnail: string;      // Series cover image URL
  chapterSlug: string;    // Last-read chapter slug
  chapterName: string;    // Last-read chapter display name
  chapterIndex: number;   // Chapter index (for progress calculation)
  totalChapters: number;  // Total chapters in the series
  timestamp: number;      // Unix timestamp of last read
}

const HISTORY_KEY = 'omega_history';

/**
 * Retrieve all reading history entries.
 *
 * @returns - Map of series slug → HistoryEntry, or empty object on SSR
 */
export function getHistory(): Record<string, HistoryEntry> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');
  } catch {
    return {};
  }
}

/**
 * Save or update a reading history entry.
 *
 * NOTE: Only one entry per series is kept (latest wins).
 * History is capped at 50 entries to prevent localStorage bloat.
 * Oldest entries are pruned when the cap is exceeded.
 *
 * @param entry - HistoryEntry to save
 */
export function saveHistory(entry: HistoryEntry): void {
  if (typeof window === 'undefined') return;
  const history = getHistory();
  // Keep only the latest entry per series
  history[entry.slug] = entry;
  // Cap at 50 entries to avoid bloat
  const entries = Object.values(history).sort((a, b) => b.timestamp - a.timestamp);
  const capped = Object.fromEntries(entries.slice(0, 50).map(e => [e.slug, e]));
  localStorage.setItem(HISTORY_KEY, JSON.stringify(capped));
}

/**
 * Get series that have unfinished chapters (for "Continue Reading" section).
 *
 * NOTE: Filters out series where the last-read chapter is the final one,
 * so completed series don't clutter the continue reading row.
 *
 * @returns - Sorted array of HistoryEntry (most recent first), excluding completed series
 */
export function getContinueReading(): HistoryEntry[] {
  return Object.values(getHistory())
    .sort((a, b) => b.timestamp - a.timestamp)
    .filter(e => e.chapterIndex < e.totalChapters); // Exclude completed series
}

/**
 * Clear all reading history.
 */
export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
}

// ==================== BOOKMARKS ====================
// ---- FEATURE: BOOKMARKS ----

const BOOKMARKS_KEY = 'omega_bookmarks';

/**
 * Retrieve all bookmarked series slugs.
 *
 * @returns - Array of series slugs, or empty array on SSR
 */
export function getBookmarks(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]');
  } catch {
    return [];
  }
}

/**
 * Toggle a bookmark on or off.
 *
 * @param slug - Series slug to toggle
 * @returns    - `true` if bookmarked, `false` if removed
 */
export function toggleBookmark(slug: string): boolean {
  if (typeof window === 'undefined') return false;
  const bookmarks = getBookmarks();
  const idx = bookmarks.indexOf(slug);
  if (idx >= 0) {
    bookmarks.splice(idx, 1);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    return false; // Removed
  } else {
    bookmarks.push(slug);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    return true; // Added
  }
}

/**
 * Check if a series is bookmarked.
 *
 * @param slug - Series slug to check
 * @returns    - `true` if bookmarked
 */
export function isBookmarked(slug: string): boolean {
  return getBookmarks().includes(slug);
}

/**
 * Clear all bookmarks.
 */
export function clearBookmarks(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(BOOKMARKS_KEY);
}

// ==================== RECENT SEARCHES ====================
// ---- FEATURE: RECENT SEARCHES ----

const SEARCHES_KEY = 'omega_recent_searches';

/** Maximum number of recent searches to retain */
const MAX_SEARCHES = 8;

/**
 * Retrieve recent search queries.
 *
 * @returns - Array of recent search strings (most recent first)
 */
export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(SEARCHES_KEY) || '[]');
  } catch {
    return [];
  }
}

/**
 * Save a search query to recent searches.
 *
 * NOTE: Deduplicates — if the query already exists, it's moved to the front.
 * List is capped at MAX_SEARCHES (8) entries.
 *
 * @param query - Search string to save
 */
export function saveSearch(query: string): void {
  if (typeof window === 'undefined') return;
  const q = query.trim();
  if (!q) return;
  const searches = getRecentSearches().filter(s => s !== q);
  searches.unshift(q);
  localStorage.setItem(SEARCHES_KEY, JSON.stringify(searches.slice(0, MAX_SEARCHES)));
}

/**
 * Clear all recent searches.
 */
export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SEARCHES_KEY);
}

// ==================== READING POSITION ====================
// ---- FEATURE: READING POSITION ----

/**
 * Save the scroll position for a specific chapter.
 *
 * NOTE: Uses sessionStorage (not localStorage) so position is
 * only preserved within the current tab/session. This avoids
 * stale scroll positions persisting across visits.
 *
 * @param seriesSlug  - Parent series slug
 * @param chapterSlug - Chapter slug
 * @param scrollY     - Vertical scroll offset in pixels
 */
export function saveReadingPosition(seriesSlug: string, chapterSlug: string, scrollY: number): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(`omega_pos_${seriesSlug}_${chapterSlug}`, String(scrollY));
}

/**
 * Retrieve the saved scroll position for a chapter.
 *
 * @param seriesSlug  - Parent series slug
 * @param chapterSlug - Chapter slug
 * @returns           - Scroll offset in pixels, or 0 if not saved
 */
export function getReadingPosition(seriesSlug: string, chapterSlug: string): number {
  if (typeof window === 'undefined') return 0;
  const val = sessionStorage.getItem(`omega_pos_${seriesSlug}_${chapterSlug}`);
  return val ? parseInt(val, 10) || 0 : 0;
}

// ==================== EOF ====================
