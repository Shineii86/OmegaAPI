/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  OmegaAPI — Series Detail Endpoint                         │
 * │  Author : Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ                                   │
 * │  License: MIT                                              │
 * │  Route  : GET /api/v1/series/:slug                         │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Get detailed metadata for a single series by slug.
 *
 * Query Parameters:
 *   include - Set to "chapters" to embed the full chapter list
 *
 * Response: ApiResponse<NormalizedSeries>
 * Headers:  X-Cache, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
 */

import { NextRequest } from 'next/server';
import { getSeriesDetail, getSeriesChapters } from '@/lib/omega';
import { getCached, setCache } from '@/lib/cache';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp, successResponse, errorResponse } from '@/lib/utils';

export const runtime = 'edge';

// ==================== HANDLER ====================

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  // ---- FEATURE: RATE LIMITING ----
  const ip = getClientIp(req);
  const rate = checkRateLimit(ip);
  if (!rate.remaining && !rate.allowed) {
    return errorResponse('Rate limit exceeded. Try again later.', 429, {
      retryAfter: Math.ceil((rate.resetTime - Date.now()) / 1000),
    });
  }

  try {
    const { slug } = params;
    const { searchParams } = new URL(req.url);
    const includeChapters = searchParams.get('include') === 'chapters';

    // ---- FEATURE: CACHE LAYER ----
    const cacheKey = `series:detail:${slug}:${includeChapters ? 'full' : 'basic'}`;
    const cached = getCached<ReturnType<typeof getSeriesDetail> extends Promise<infer R> ? R : never>(cacheKey);
    if (cached) return successResponse(cached, 200, { 'X-Cache': 'HIT' });

    // ---- FEATURE: CHAPTER EMBEDDING ----
    // When ?include=chapters, fetch the series detail AND chapter list
    // in parallel, then merge them into a single response.
    const seriesData = await getSeriesDetail(slug);

    let result;
    if (includeChapters && seriesData.data.id) {
      const chaptersData = await getSeriesChapters(seriesData.data.id, 1, 10000, slug);
      result = {
        success: true,
        data: {
          ...seriesData.data,
          chapters: chaptersData.data,
        },
      };
    } else {
      result = seriesData;
    }

    setCache(cacheKey, result);

    return successResponse(result, 200, {
      'X-RateLimit-Limit': '60',
      'X-RateLimit-Remaining': String(rate.remaining),
      'X-RateLimit-Reset': String(Math.ceil(rate.resetTime / 1000)),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    if (message.includes('404') || message.includes('not found')) {
      return errorResponse('Series not found', 404);
    }
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
