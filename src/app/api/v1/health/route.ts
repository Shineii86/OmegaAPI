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
 */

import { successResponse } from '@/lib/utils';

export const runtime = 'edge';

// ==================== STATE ====================

/** Server start timestamp for uptime calculation */
const startTime = Date.now();

// ==================== HANDLER ====================

// ---- FEATURE: HEALTH CHECK ----

export async function GET() {
  let upstreamStatus = 'ok';
  let upstreamLatency = 0;

  // ---- FEATURE: UPSTREAM PROBE ----
  // Send a lightweight HEAD request to verify the upstream API
  // is reachable and measure round-trip latency.
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

  return successResponse({
    success: true,
    data: {
      status: 'ok',
      version: '1.0.0',
      uptime: Math.floor((Date.now() - startTime) / 1000),
      upstream: {
        status: upstreamStatus,
        latencyMs: upstreamLatency,
        url: 'https://api.omegascans.org',
      },
      timestamp: new Date().toISOString(),
    },
  });
}

// ==================== EOF ====================
