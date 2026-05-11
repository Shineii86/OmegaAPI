/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  OmegaAPI — Stats Endpoint                                 │
 * │  Author : Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ                                   │
 * │  License: MIT                                              │
 * │  Route  : GET /api/v1/stats                                │
 * └─────────────────────────────────────────────────────────────┘
 *
 * API statistics and metadata. Returns available endpoints,
 * rate limit config, cache state, and uptime.
 *
 * Response: ApiResponse<{ name, version, endpoints, cache, rateLimit, ... }>
 */

import { getCacheStats } from '@/lib/cache';
import { successResponse } from '@/lib/utils';

export const runtime = 'edge';

// ==================== STATE ====================

/** Server start timestamp for uptime calculation */
const startTime = Date.now();

// ==================== HANDLER ====================

// ---- FEATURE: API STATS ----

export async function GET() {
  const cache = getCacheStats();

  return successResponse({
    success: true,
    data: {
      name: 'OmegaAPI',
      version: '1.0.0',
      description: 'Free Manga & Manhwa REST API powered by OmegaScans',
      uptime: Math.floor((Date.now() - startTime) / 1000),
      endpoints: [
        { method: 'GET', path: '/api/v1/series', description: 'Browse all series with search & pagination' },
        { method: 'GET', path: '/api/v1/series/:slug', description: 'Get series details (add ?include=chapters for full list)' },
        { method: 'GET', path: '/api/v1/chapters/:slug', description: 'Get chapter list for a series' },
        { method: 'GET', path: '/api/v1/chapter/:slug/:chapter', description: 'Get chapter content with images' },
        { method: 'GET', path: '/api/v1/search?q=', description: 'Search series by title' },
        { method: 'GET', path: '/api/v1/health', description: 'API health check' },
        { method: 'GET', path: '/api/v1/stats', description: 'API statistics' },
      ],
      cache: {
        entries: cache.size,
      },
      rateLimit: {
        maxRequests: 60,
        windowMs: 60000,
      },
      source: 'https://omegascans.org',
      timestamp: new Date().toISOString(),
    },
  });
}

// ==================== EOF ====================
