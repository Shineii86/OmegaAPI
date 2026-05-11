/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  OmegaAPI — Series List Endpoint                           │
 * │  Author : Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ                                   │
 * │  License: MIT                                              │
 * │  Route  : GET /api/v1/series                               │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Browse all series with optional search and pagination.
 *
 * Query Parameters:
 *   page    - Page number (default: 1)
 *   perPage - Results per page (1–100, default: 20)
 *   q       - Search query to filter by title
 *
 * Response: PaginatedResponse<NormalizedSeries>
 * Headers:  X-Cache, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
 */

import { NextRequest } from 'next/server';
import { getSeriesList } from '@/lib/omega';
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
    // ---- FEATURE: PARAMETER PARSING ----
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get('perPage') || '20', 10)));
    const q = searchParams.get('q') || undefined;

    // ---- FEATURE: CACHE LAYER ----
    const cacheKey = `series:list:${page}:${perPage}:${q || ''}`;
    const cached = getCached<ReturnType<typeof getSeriesList> extends Promise<infer R> ? R : never>(cacheKey);
    if (cached) return successResponse(cached, 200, { 'X-Cache': 'HIT' });

    const data = await getSeriesList(page, perPage, q);

    // Search results get a longer TTL (10 min vs 5 min)
    setCache(cacheKey, data, q ? getSearchTTL() : undefined);

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
