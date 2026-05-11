import { NextResponse } from 'next/server';

/**
 * POST /api/v1/auth/verify
 * Server-side access code verification with device binding and plan-aware codes.
 *
 * Environment variables:
 *   ACCESS_CODES          - Comma-separated codes valid for ANY plan
 *   ACCESS_CODES_HOURLY   - Codes valid for 1-hour plan
 *   ACCESS_CODES_DAILY    - Codes valid for 1-day plan
 *   ACCESS_CODES_WEEKLY   - Codes valid for 1-week plan
 *   ACCESS_CODES_MONTHLY  - Codes valid for 1-month plan
 *   ACCESS_CODES_QUARTERLY - Codes valid for 3-month plan
 *
 * Plan-specific codes ONLY work with their matching plan.
 * Generic ACCESS_CODES work with any plan.
 */

const codeUsage = new Map<string, {
  fingerprint: string;
  planId: string;
  usedAt: number;
  expiresAt: number;
}>();

const PLAN_DURATIONS: Record<string, number> = {
  hourly:    60 * 60 * 1000,
  daily:     24 * 60 * 60 * 1000,
  weekly:    7 * 24 * 60 * 60 * 1000,
  monthly:   30 * 24 * 60 * 60 * 1000,
  quarterly: 90 * 24 * 60 * 60 * 1000,
};

const PLAN_ENV_MAP: Record<string, string> = {
  hourly:    'ACCESS_CODES_HOURLY',
  daily:     'ACCESS_CODES_DAILY',
  weekly:    'ACCESS_CODES_WEEKLY',
  monthly:   'ACCESS_CODES_MONTHLY',
  quarterly: 'ACCESS_CODES_QUARTERLY',
};

function parseCodes(envVar: string): string[] {
  return (process.env[envVar] || '')
    .split(',')
    .map((c: string) => c.trim().toUpperCase())
    .filter(Boolean);
}

async function kvGet(key: string): Promise<string | null> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const res = await fetch(`${process.env.KV_REST_API_URL}/get/${key}`, {
        headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
      });
      const data = await res.json();
      return data.result ?? null;
    }
  } catch { /* fallback */ }
  const entry = codeUsage.get(key);
  return entry ? JSON.stringify(entry) : null;
}

async function kvSet(key: string, value: string): Promise<void> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      await fetch(`${process.env.KV_REST_API_URL}/set/${key}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value, ex: 90 * 24 * 60 * 60 }),
      });
      return;
    }
  } catch { /* fallback */ }
  codeUsage.set(key, JSON.parse(value));
}

export async function POST(request: Request) {
  try {
    const { code, fingerprint, planId } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ success: false, error: 'Access code is required' }, { status: 400 });
    }
    if (!fingerprint || typeof fingerprint !== 'string') {
      return NextResponse.json({ success: false, error: 'Device verification failed' }, { status: 400 });
    }

    const plan = planId && PLAN_DURATIONS[planId] ? planId : 'monthly';
    const durationMs = PLAN_DURATIONS[plan];
    const normalizedCode = code.trim().toUpperCase();

    // Check if any codes are configured at all
    const genericCodes = parseCodes('ACCESS_CODES');
    const planCodes = parseCodes(PLAN_ENV_MAP[plan]);
    const allCodesForPlan = [...genericCodes, ...planCodes];

    if (allCodesForPlan.length === 0) {
      return NextResponse.json({ success: false, error: 'Access codes not configured' }, { status: 503 });
    }

    // Check if code is valid for this plan
    // First check plan-specific codes, then generic codes
    const isPlanSpecific = planCodes.includes(normalizedCode);
    const isGeneric = genericCodes.includes(normalizedCode);

    if (!isPlanSpecific && !isGeneric) {
      // Also check if the code exists in ANY plan-specific list (wrong plan selected)
      const allPlanCodes = Object.values(PLAN_ENV_MAP).flatMap(env => parseCodes(env));
      if (allPlanCodes.includes(normalizedCode)) {
        return NextResponse.json(
          { success: false, error: 'This code is for a different plan. Please select the correct plan.' },
          { status: 403 }
        );
      }
      return NextResponse.json({ success: false, error: 'Invalid access code' }, { status: 401 });
    }

    // Device binding check
    const usageKey = `code:${normalizedCode}`;
    const existing = await kvGet(usageKey);

    if (existing) {
      const entry = typeof existing === 'string' ? JSON.parse(existing) : existing;

      // Expired — allow re-use
      if (entry.expiresAt && Date.now() > entry.expiresAt) {
        const newEntry = { fingerprint, planId: plan, usedAt: Date.now(), expiresAt: Date.now() + durationMs };
        await kvSet(usageKey, JSON.stringify(newEntry));
        return NextResponse.json({
          success: true,
          data: { token: 'verified', expiresIn: durationMs, planId: plan, expiresAt: newEntry.expiresAt },
        });
      }

      // Same device — allow re-verification
      if (entry.fingerprint === fingerprint) {
        return NextResponse.json({
          success: true,
          data: { token: 'verified', expiresIn: entry.expiresAt - Date.now(), planId: entry.planId, expiresAt: entry.expiresAt },
        });
      }

      // Different device, not expired
      return NextResponse.json(
        { success: false, error: 'This code is already in use on another device' },
        { status: 403 }
      );
    }

    // First use — bind to device
    const entry = { fingerprint, planId: plan, usedAt: Date.now(), expiresAt: Date.now() + durationMs };
    await kvSet(usageKey, JSON.stringify(entry));

    return NextResponse.json({
      success: true,
      data: { token: 'verified', expiresIn: durationMs, planId: plan, expiresAt: entry.expiresAt },
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
