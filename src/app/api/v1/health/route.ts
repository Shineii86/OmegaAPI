import { successResponse } from '@/lib/utils';

export const runtime = 'edge';

const startTime = Date.now();

export async function GET() {
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
