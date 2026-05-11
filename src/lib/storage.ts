/**
 * localStorage utilities for reading history, bookmarks, and preferences.
 * No database needed — everything persists in the browser.
 */

/* ── Reading History ── */

export interface HistoryEntry {
  slug: string;
  title: string;
  thumbnail: string;
  chapterSlug: string;
  chapterName: string;
  chapterIndex: number;
  totalChapters: number;
  timestamp: number;
}

const HISTORY_KEY = 'omega_history';

export function getHistory(): Record<string, HistoryEntry> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');
  } catch {
    return {};
  }
}

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

export function getContinueReading(): HistoryEntry[] {
  return Object.values(getHistory())
    .sort((a, b) => b.timestamp - a.timestamp)
    .filter(e => e.chapterIndex < e.totalChapters); // Exclude completed series
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
}

/* ── Bookmarks ── */

const BOOKMARKS_KEY = 'omega_bookmarks';

export function getBookmarks(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]');
  } catch {
    return [];
  }
}

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

export function isBookmarked(slug: string): boolean {
  return getBookmarks().includes(slug);
}

export function clearBookmarks(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(BOOKMARKS_KEY);
}

/* ── Recent Searches ── */

const SEARCHES_KEY = 'omega_recent_searches';
const MAX_SEARCHES = 8;

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(SEARCHES_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveSearch(query: string): void {
  if (typeof window === 'undefined') return;
  const q = query.trim();
  if (!q) return;
  const searches = getRecentSearches().filter(s => s !== q);
  searches.unshift(q);
  localStorage.setItem(SEARCHES_KEY, JSON.stringify(searches.slice(0, MAX_SEARCHES)));
}

export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SEARCHES_KEY);
}

/* ── Reading Position (per chapter scroll) ── */

export function saveReadingPosition(seriesSlug: string, chapterSlug: string, scrollY: number): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(`omega_pos_${seriesSlug}_${chapterSlug}`, String(scrollY));
}

export function getReadingPosition(seriesSlug: string, chapterSlug: string): number {
  if (typeof window === 'undefined') return 0;
  const val = sessionStorage.getItem(`omega_pos_${seriesSlug}_${chapterSlug}`);
  return val ? parseInt(val, 10) || 0 : 0;
}
