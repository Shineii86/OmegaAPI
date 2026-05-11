/**
 * Payment verification utilities for OmegaAPI Premium Access
 * Codes verified server-side via /api/v1/auth/verify
 * Each code is device-bound and plan-scoped.
 */

const PAYMENT_KEY = 'omega_premium_access';
const PAYMENT_EXPIRY_KEY = 'omega_premium_expiry';
const PAYMENT_PLAN_KEY = 'omega_premium_plan';
const FINGERPRINT_KEY = 'omega_device_fp';

/** Generate a simple device fingerprint from browser characteristics */
function getDeviceFingerprint(): string {
  try {
    const stored = localStorage.getItem(FINGERPRINT_KEY);
    if (stored) return stored;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('fingerprint', 2, 2);
    }

    const parts = [
      navigator.userAgent,
      navigator.language,
      `${screen.width}x${screen.height}`,
      screen.colorDepth.toString(),
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas.toDataURL(),
      navigator.hardwareConcurrency?.toString() || '0',
      navigator.maxTouchPoints?.toString() || '0',
    ];

    let hash = 0;
    const str = parts.join('|');
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }

    const fp = `fp_${Math.abs(hash).toString(36)}_${str.length}`;
    localStorage.setItem(FINGERPRINT_KEY, fp);
    return fp;
  } catch {
    return `fp_${Date.now().toString(36)}`;
  }
}

/** Check if user has premium access (not expired) */
export function hasPremiumAccess(): boolean {
  try {
    const token = localStorage.getItem(PAYMENT_KEY);
    const expiry = localStorage.getItem(PAYMENT_EXPIRY_KEY);
    if (!token || !expiry) return false;

    if (Date.now() > parseInt(expiry, 10)) {
      // Expired — clean up
      localStorage.removeItem(PAYMENT_KEY);
      localStorage.removeItem(PAYMENT_EXPIRY_KEY);
      localStorage.removeItem(PAYMENT_PLAN_KEY);
      return false;
    }

    return token === 'verified';
  } catch {
    return false;
  }
}

/** Verify access code via server-side API (device-bound, plan-scoped) */
export async function verifyAccessCode(
  accessCode: string,
  planId: string = 'monthly'
): Promise<{ success: boolean; error?: string }> {
  try {
    const fingerprint = getDeviceFingerprint();

    const res = await fetch('/api/v1/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: accessCode, fingerprint, planId }),
    });

    const data = await res.json();

    if (data.success && data.data?.token === 'verified') {
      try {
        const expiresAt = data.data.expiresAt || Date.now() + (data.data.expiresIn || 0);
        localStorage.setItem(PAYMENT_KEY, 'verified');
        localStorage.setItem(PAYMENT_EXPIRY_KEY, expiresAt.toString());
        localStorage.setItem(PAYMENT_PLAN_KEY, data.data.planId || planId);
        return { success: true };
      } catch {
        return { success: false, error: 'Failed to save access. Please try again.' };
      }
    }

    return { success: false, error: data.error || 'Invalid access code' };
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
}

/** Revoke premium access (logout) */
export function revokePremiumAccess(): void {
  try {
    localStorage.removeItem(PAYMENT_KEY);
    localStorage.removeItem(PAYMENT_EXPIRY_KEY);
    localStorage.removeItem(PAYMENT_PLAN_KEY);
  } catch { /* silent */ }
}

/** Get remaining time as human-readable string */
export function getRemainingTime(): string {
  try {
    const expiry = localStorage.getItem(PAYMENT_EXPIRY_KEY);
    if (!expiry) return '';

    const remaining = parseInt(expiry, 10) - Date.now();
    if (remaining <= 0) return 'Expired';

    const minutes = Math.floor(remaining / (60 * 1000));
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000));

    if (days > 0) {
      const remHours = Math.floor((remaining - days * 24 * 60 * 60 * 1000) / (60 * 60 * 1000));
      return remHours > 0 ? `${days}d ${remHours}h remaining` : `${days}d remaining`;
    }
    if (hours > 0) {
      const remMins = Math.floor((remaining - hours * 60 * 60 * 1000) / (60 * 1000));
      return remMins > 0 ? `${hours}h ${remMins}m remaining` : `${hours}h remaining`;
    }
    return `${minutes}m remaining`;
  } catch {
    return '';
  }
}

/** Get current plan ID */
export function getCurrentPlan(): string {
  try {
    return localStorage.getItem(PAYMENT_PLAN_KEY) || '';
  } catch {
    return '';
  }
}
