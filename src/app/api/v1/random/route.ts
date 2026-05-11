/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  OmegaAPI — Random Series Endpoint                         │
 * │  Author : Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ                                   │
 * │  License: MIT                                              │
 * │  Route  : GET /api/v1/random                               │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Get a random series for discovery.
 *
 * Query Parameters:
 *   count - Number of random series to return (1–10, default: 1)
 *
 * Response: ApiResponse<NormalizedSeries | NormalizedSeries[]>
 */

import { NextRequest } from 'next/server';
import type { NormalizedSeries } from '@/types';
import { getSeriesList } from '@/lib/omega';
import { getCached, setCache } from '@/lib/cache';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp, successResponse, errorResponse } from '@/lib/utils';

export const runtime = 'edge';

// ==================== HANDLER ====================
// ---- FEATURE: RANDOM SERIES ----

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const rate = checkRateLimit(ip);
  if (!rate.remaining && !rate.allowed) {
    return errorResponse('Rate limit exceeded. Try again later.', 429, {
      retryAfter: Math.ceil((rate.resetTime - Date.now()) / 1000),
    });
  }

  try {
    const { searchParams } = new URL(req.url);
    const count = Math.min(10, Math.max(1, parseInt(searchParams.get('count') || '1', 10)));

    // Fetch a page of series and pick random ones from it
    const cacheKey = 'random:pool';
    let pool = getCached<NormalizedSeries[]>(cacheKey);

    if (!pool) {
      // Fetch multiple pages to get a good pool of series
      const page1 = await getSeriesList(1, 100);
      const page2 = await getSeriesList(2, 100);
      pool = [...page1.data, ...page2.data];
      setCache(cacheKey, pool, 10 * 60 * 1000); // Cache pool for 10 min
    }

    // Fisher-Yates shuffle and pick `count` items
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const result = count === 1 ? shuffled[0] : shuffled.slice(0, count);

    return successResponse({
      success: true,
      data: result,
    }, 200, {
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
