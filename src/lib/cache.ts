interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const SEARCH_TTL = 10 * 60 * 1000; // 10 minutes

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCache<T>(key: string, data: T, ttl = DEFAULT_TTL): void {
  cache.set(key, { data, expiry: Date.now() + ttl });
}

export function getSearchTTL(): number {
  return SEARCH_TTL;
}

export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}

// Cleanup expired entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now > entry.expiry) {
      cache.delete(key);
    }
  }
}, 10 * 60 * 1000);
