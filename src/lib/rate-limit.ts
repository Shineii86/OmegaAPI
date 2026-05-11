/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  OmegaAPI — IP-Based Rate Limiter                          │
 * │  Author : Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ                                   │
 * │  License: MIT                                              │
 * │  Module : src/lib/rate-limit.ts                            │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Sliding-window rate limiter keyed by client IP address.
 * Limits each IP to 60 requests per 60-second window.
 *
 * NOTE: This is in-memory and per-instance. On Vercel's serverless
 * model, each edge function instance maintains its own counter.
 * For global rate limiting across all regions, use Vercel KV or
 * a dedicated rate-limiting service.
 */

// ==================== TYPES ====================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// ==================== STATE ====================

/** Per-IP rate limit counters — reset on cold start */
const rateLimitMap = new Map<string, RateLimitEntry>();

// ==================== CONFIGURATION ====================

/** Maximum requests allowed per window */
const RATE_LIMIT = 60;

/** Window duration in milliseconds (1 minute) */
const WINDOW_MS = 60 * 1000;

// ==================== PUBLIC FUNCTIONS ====================

// ---- FEATURE: RATE LIMIT CHECK ----

/**
 * Check and increment the rate limit counter for a given IP.
 *
 * @param ip - Client IP address (from x-forwarded-for or x-real-ip)
 * @returns  - Object with:
 *   - `allowed`    : whether the request should proceed
 *   - `remaining`  : how many requests are left in the current window
 *   - `resetTime`  : Unix timestamp (ms) when the window resets
 *
 * NOTE: The first request from a new IP starts a fresh window.
 * Once the window expires, the counter resets automatically.
 */
export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // ---- FEATURE: WINDOW RESET ----
  // If no entry exists or the window has expired, start a new one
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT - 1, resetTime: now + WINDOW_MS };
  }

  // ---- FEATURE: LIMIT ENFORCEMENT ----
  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT - entry.count, resetTime: entry.resetTime };
}

// ==================== GARBAGE COLLECTION ====================

/**
 * Periodic cleanup of stale rate limit entries.
 *
 * NOTE: Runs every 5 minutes. Without this, expired entries
 * would accumulate in memory for IPs that never return.
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

// ==================== EOF ====================
