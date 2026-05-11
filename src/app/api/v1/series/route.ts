/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  OmegaAPI — Series List Endpoint                           │
 * │  Author : Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ                                   │
 * │  License: MIT                                              │
 * │  Route  : GET /api/v1/series                               │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Browse all series with optional search, sorting, and filtering.
 *
 * Query Parameters:
 *   page    - Page number (default: 1)
 *   perPage - Results per page (1–100, default: 20)
 *   q       - Search query to filter by title
 *   sort    - Sort field: title, rating, views, updated (default: none)
 *   order   - Sort order: asc, desc (default: desc)
 *   status  - Filter by status: ongoing, completed, hiatus
 *   type    - Filter by type: manga, manhwa, manhua
 *
 * Response: PaginatedResponse<NormalizedSeries>
 * Headers:  X-Cache, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset,
 *           X-Pagination-*
 */

import { NextRequest } from 'next/server';
import type { NormalizedSeries } from '@/types';
import { getSeriesList } from '@/lib/omega';
import { getCached, setCache, getSearchTTL } from '@/lib/cache';
import { checkRateLimit } from '@/lib/rate-limit';
import { getClientIp, successResponse, errorResponse, paginationHeaders } from '@/lib/utils';

export const runtime = 'edge';

// ==================== SORTING & FILTERING ====================
// ---- FEATURE: SORTING ----

type SortField = 'title' | 'rating' | 'views' | 'updated';
type SortOrder = 'asc' | 'desc';

/**
 * Sort an array of series by the given field and order.
 *
 * @param data  - Array of NormalizedSeries to sort
 * @param sort  - Field to sort by
 * @param order - Sort direction
 * @returns     - New sorted array (does not mutate original)
 */
function sortSeries(data: NormalizedSeries[], sort: SortField, order: SortOrder): NormalizedSeries[] {
  const sorted = [...data];
  const dir = order === 'asc' ? 1 : -1;

  sorted.sort((a, b) => {
    switch (sort) {
      case 'title':
        return dir * a.title.localeCompare(b.title);
      case 'rating':
        return dir * (a.rating - b.rating);
      case 'views':
        return dir * (a.totalViews - b.totalViews);
      case 'updated':
        return dir * (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
      default:
        return 0;
    }
  });

  return sorted;
}

// ---- FEATURE: FILTERING ----

/**
 * Filter series by status and/or type.
 *
 * @param data   - Array of NormalizedSeries to filter
 * @param status - Status filter (case-insensitive)
 * @param type   - Type filter (case-insensitive)
 * @returns      - Filtered array
 */
function filterSeries(data: NormalizedSeries[], status?: string, type?: string): NormalizedSeries[] {
  let result = data;
  if (status) {
    result = result.filter(s => s.status.toLowerCase() === status.toLowerCase());
  }
  if (type) {
    result = result.filter(s => s.type.toLowerCase() === type.toLowerCase());
  }
  return result;
}

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
    const sort = searchParams.get('sort') as SortField | null;
    const order = (searchParams.get('order') as SortOrder) || 'desc';
    const status = searchParams.get('status') || undefined;
    const type = searchParams.get('type') || undefined;

    // ---- FEATURE: CACHE LAYER ----
    const cacheKey = `series:list:${page}:${perPage}:${q || ''}:${sort || ''}:${order}:${status || ''}:${type || ''}`;
    const cached = getCached<ReturnType<typeof getSeriesList> extends Promise<infer R> ? R : never>(cacheKey);
    if (cached) return successResponse(cached, 200, { 'X-Cache': 'HIT' });

    const data = await getSeriesList(page, perPage, q);

    // ---- FEATURE: POST-FETCH SORTING & FILTERING ----
    // NOTE: The upstream API doesn't support sorting or filtering.
    // We apply these client-side after fetching. This means results
    // are sorted/filtered within the current page only, not globally.
    let seriesData = data.data;
    if (status || type) {
      seriesData = filterSeries(seriesData, status, type);
    }
    if (sort) {
      seriesData = sortSeries(seriesData, sort, order);
    }

    const result = {
      ...data,
      data: seriesData,
      pagination: {
        ...data.pagination,
        total: seriesData.length,
      },
    };

    // Search results get a longer TTL (10 min vs 5 min)
    setCache(cacheKey, result, q ? getSearchTTL() : undefined);

    return successResponse(result, 200, {
      'X-RateLimit-Limit': '60',
      'X-RateLimit-Remaining': String(rate.remaining),
      'X-RateLimit-Reset': String(Math.ceil(rate.resetTime / 1000)),
      ...paginationHeaders(result.pagination),
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
