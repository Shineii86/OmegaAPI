/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  OmegaAPI — In-Memory Cache                                │
 * │  Author : Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ                                   │
 * │  License: MIT                                              │
 * │  Module : src/lib/cache.ts                                 │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Simple in-memory cache with TTL-based expiry.
 * Used by API routes to avoid hammering the upstream OmegaScans API.
 *
 * NOTE: This is a process-level cache. On Vercel's serverless model,
 * each cold start gets a fresh cache. For persistent caching across
 * deploys, consider Vercel KV or Upstash Redis.
 */

// ==================== TYPES ====================

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

// ==================== STATE ====================

/** Global cache store — lives for the lifetime of the serverless instance */
const cache = new Map<string, CacheEntry<unknown>>();

// ==================== CONFIGURATION ====================

/** Default TTL for cached responses: 5 minutes */
const DEFAULT_TTL = 5 * 60 * 1000;

/**
 * Extended TTL for search results: 10 minutes.
 *
 * NOTE: Search hits the upstream API the same way as listing,
 * but search queries are more expensive (full scan), so we
 * cache them longer to reduce load.
 */
const SEARCH_TTL = 10 * 60 * 1000;

// ==================== PUBLIC FUNCTIONS ====================

// ---- FEATURE: CACHE READ ----

/**
 * Retrieve a cached value by key.
 *
 * @param key - Cache key (e.g. "series:list:1:20:")
 * @returns   - Cached data if found and not expired, null otherwise
 *
 * NOTE: Expired entries are lazily deleted on read.
 */
export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

// ---- FEATURE: CACHE WRITE ----

/**
 * Store a value in the cache with a TTL.
 *
 * @param key  - Cache key
 * @param data - Value to cache
 * @param ttl  - Time-to-live in milliseconds (default: 5 min)
 */
export function setCache<T>(key: string, data: T, ttl = DEFAULT_TTL): void {
  cache.set(key, { data, expiry: Date.now() + ttl });
}

/**
 * Get the search-specific TTL value.
 *
 * @returns - Search TTL in milliseconds (10 min)
 */
export function getSearchTTL(): number {
  return SEARCH_TTL;
}

// ---- FEATURE: CACHE STATS ----

/**
 * Return cache statistics for the /stats endpoint.
 *
 * @returns - Object with cache size and all active keys
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}

// ==================== GARBAGE COLLECTION ====================

/**
 * Periodic cleanup of expired cache entries.
 *
 * NOTE: Runs every 10 minutes via setInterval. This prevents
 * unbounded memory growth from stale entries that were never
 * read (lazy deletion only triggers on cache hits).
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now > entry.expiry) {
      cache.delete(key);
    }
  }
}, 10 * 60 * 1000);

// ==================== EOF ====================
