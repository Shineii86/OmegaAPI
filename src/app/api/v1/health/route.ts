/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  OmegaAPI — Health Check Endpoint                          │
 * │  Author : Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ                                   │
 * │  License: MIT                                              │
 * │  Route  : GET /api/v1/health                               │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Health check with upstream probe. Pings the OmegaScans API
 * to verify connectivity and measures latency.
 *
 * Response: ApiResponse<{ status, version, uptime, upstream, timestamp }>
 *
 * NOTE: Upstream probe result is cached for 30 seconds to avoid
 * hammering OmegaScans on every health check request.
 */

import { successResponse } from '@/lib/utils';

export const runtime = 'edge';

// ==================== STATE ====================

/** Server start timestamp for uptime calculation */
const startTime = Date.now();

// ---- FEATURE: HEALTH CHECK CACHE ----

/** Cached upstream probe result (refreshed every 30s) */
let cachedProbe: { status: string; latencyMs: number } | null = null;
let probeCacheTime = 0;
const PROBE_CACHE_TTL = 30 * 1000; // 30 seconds

// ==================== HANDLER ====================

// ---- FEATURE: HEALTH CHECK ----

export async function GET() {
  const now = Date.now();

  // ---- FEATURE: UPSTREAM PROBE ----
  // Use cached probe result if it's less than 30 seconds old.
  // This prevents hammering the upstream API on repeated health checks.
  if (!cachedProbe || now - probeCacheTime > PROBE_CACHE_TTL) {
    let upstreamStatus = 'ok';
    let upstreamLatency = 0;

    try {
      const start = performance.now();
      const res = await fetch('https://api.omegascans.org/query?type=series&page=1', {
        method: 'HEAD',
        headers: { 'User-Agent': 'OmegaAPI/1.0' },
      });
      upstreamLatency = Math.round(performance.now() - start);
      if (!res.ok) upstreamStatus = 'degraded';
    } catch {
      upstreamStatus = 'down';
    }

    cachedProbe = { status: upstreamStatus, latencyMs: upstreamLatency };
    probeCacheTime = now;
  }

  return successResponse({
    success: true,
    data: {
      status: 'ok',
      version: '3.8.0',
      uptime: Math.floor((now - startTime) / 1000),
      upstream: {
        status: cachedProbe.status,
        latencyMs: cachedProbe.latencyMs,
        url: 'https://api.omegascans.org',
        cached: now - probeCacheTime < PROBE_CACHE_TTL,
      },
      timestamp: new Date().toISOString(),
    },
  });
}

// ==================== EOF ====================
