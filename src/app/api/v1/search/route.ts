/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  OmegaAPI — Search Endpoint                                │
 * │  Author : Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ                                   │
 * │  License: MIT                                              │
 * │  Route  : GET /api/v1/search                               │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Search series by title.
 *
 * Query Parameters:
 *   q    - Search query (required, must not be empty)
 *   page - Page number (default: 1)
 *
 * Response: PaginatedResponse<NormalizedSeries>
 * Headers:  X-Cache, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
 */

import { NextRequest } from 'next/server';
import { searchSeries } from '@/lib/omega';
import { getCached, setCache, getSearchTTL } from '@/lib/cache';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp, successResponse, errorResponse } from '@/lib/utils';

export const runtime = 'edge';

// ==================== HANDLER ====================

export async function GET(req: NextRequest) {
  // ---- FEATURE: RATE LIMITING ----
  const ip = getClientIp(req);
  const rate = checkRateLimit(ip);
  if (!rate.remaining && !rate.allowed) {
    return errorResponse('Rate limit exceeded. Try again later.', 429, {
      retryAfter: Math.ceil((rate.resetTime - Date.now()) / 1000),
    });
  }

  try {
    // ---- FEATURE: PARAMETER VALIDATION ----
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

    if (!q || q.trim().length === 0) {
      return errorResponse('Search query parameter "q" is required', 400);
    }

    // ---- FEATURE: CACHE LAYER ----
    const cacheKey = `search:${q}:${page}`;
    const cached = getCached<ReturnType<typeof searchSeries> extends Promise<infer R> ? R : never>(cacheKey);
    if (cached) return successResponse(cached, 200, { 'X-Cache': 'HIT' });

    const data = await searchSeries(q, page);

    // NOTE: Search results get the extended 10-min TTL
    // since queries are more expensive than list browsing.
    setCache(cacheKey, data, getSearchTTL());

    return successResponse(data, 200, {
      'X-RateLimit-Limit': '60',
      'X-RateLimit-Remaining': String(rate.remaining),
      'X-RateLimit-Reset': String(Math.ceil(rate.resetTime / 1000)),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return errorResponse(message, 500);
  }
}

// ==================== CORS PREFLIGHT ====================

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// ==================== EOF ====================
