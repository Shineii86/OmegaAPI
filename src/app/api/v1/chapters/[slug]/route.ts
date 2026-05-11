/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  OmegaAPI — Chapter List Endpoint                          │
 * │  Author : Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ                                   │
 * │  License: MIT                                              │
 * │  Route  : GET /api/v1/chapters/:slug                       │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Get all chapters for a series by its slug.
 *
 * Query Parameters:
 *   page    - Page number (default: 1)
 *   perPage - Results per page (1–500, default: 100)
 *
 * Response: PaginatedResponse<NormalizedChapter>
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
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const perPage = Math.min(500, Math.max(1, parseInt(searchParams.get('perPage') || '100', 10)));

    // ---- FEATURE: CACHE LAYER ----
    const cacheKey = `chapters:${slug}:${page}:${perPage}`;
    const cached = getCached<ReturnType<typeof getSeriesChapters> extends Promise<infer R> ? R : never>(cacheKey);
    if (cached) return successResponse(cached, 200, { 'X-Cache': 'HIT' });

    // NOTE: We need the series ID to fetch chapters, so we fetch
    // the series detail first, then use its ID for the chapter query.
    const seriesData = await getSeriesDetail(slug);
    const chaptersData = await getSeriesChapters(seriesData.data.id, page, perPage, slug);

    setCache(cacheKey, chaptersData);

    return successResponse(chaptersData, 200, {
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
