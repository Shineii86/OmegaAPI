/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  OmegaAPI — Chapter Content Endpoint                       │
 * │  Author : Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ                                   │
 * │  License: MIT                                              │
 * │  Route  : GET /api/v1/chapter/:slug/:chapter               │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Get chapter content (images) for the reader.
 *
 * Path Parameters:
 *   slug    - Series slug (e.g. "solo-leveling")
 *   chapter - Chapter slug (e.g. "chapter-1")
 *
 * Response: ApiResponse<NormalizedChapterContent>
 * Headers:  X-Cache, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
 */

import { NextRequest } from 'next/server';
import { getChapterContent } from '@/lib/omega';
import { getCached, setCache } from '@/lib/cache';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp, successResponse, errorResponse } from '@/lib/utils';

export const runtime = 'edge';

// ==================== HANDLER ====================

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string; chapter: string } }
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
    const { slug, chapter } = params;

    // ---- FEATURE: CACHE LAYER ----
    const cacheKey = `chapter:${slug}:${chapter}`;
    const cached = getCached<ReturnType<typeof getChapterContent> extends Promise<infer R> ? R : never>(cacheKey);
    if (cached) return successResponse(cached, 200, { 'X-Cache': 'HIT' });

    const data = await getChapterContent(slug, chapter);

    // NOTE: Chapter content is cached longer (15 min) because
    // images rarely change once published. This significantly
    // reduces upstream load for popular chapters.
    setCache(cacheKey, data, 15 * 60 * 1000); // 15 min TTL for chapter content

    return successResponse(data, 200, {
      'X-RateLimit-Limit': '60',
      'X-RateLimit-Remaining': String(rate.remaining),
      'X-RateLimit-Reset': String(Math.ceil(rate.resetTime / 1000)),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    if (message.includes('404') || message.includes('not found')) {
      return errorResponse('Chapter not found', 404);
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
