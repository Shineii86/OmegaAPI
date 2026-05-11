/**
 * Subscription packages and pricing configuration
 * Prices in INR (₹) and USD ($)
 */

export interface SubscriptionPlan {
  id: string;
  name: string;
  durationMs: number;
  durationLabel: string;
  priceINR: number;
  priceUSD: number;
  popular?: boolean;
  badge?: string;
  description: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'hourly',
    name: 'Quick Access',
    durationMs: 60 * 60 * 1000,
    durationLabel: '1 Hour',
    priceINR: 29,
    priceUSD: 0.49,
    description: 'Try the browse page for an hour',
  },
  {
    id: 'daily',
    name: 'Day Pass',
    durationMs: 24 * 60 * 60 * 1000,
    durationLabel: '1 Day',
    priceINR: 69,
    priceUSD: 0.99,
    description: 'Full day access to all content',
  },
  {
    id: 'weekly',
    name: 'Week Pass',
    durationMs: 7 * 24 * 60 * 60 * 1000,
    durationLabel: '1 Week',
    priceINR: 149,
    priceUSD: 2.99,
    badge: 'POPULAR',
    popular: true,
    description: 'Best for short-term readers',
  },
  {
    id: 'monthly',
    name: 'Monthly',
    durationMs: 30 * 24 * 60 * 60 * 1000,
    durationLabel: '1 Month',
    priceINR: 299,
    priceUSD: 5.99,
    badge: 'BEST VALUE',
    description: 'Unlimited access for a full month',
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    durationMs: 90 * 24 * 60 * 60 * 1000,
    durationLabel: '3 Months',
    priceINR: 699,
    priceUSD: 14.99,
    badge: 'SAVE 22%',
    description: 'Lock in savings with 3-month access',
  },
];

/** Get plan by ID */
export function getPlanById(id: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find(p => p.id === id);
}

/** Format price for display */
export function formatPrice(plan: SubscriptionPlan, currency: 'INR' | 'USD' = 'INR'): string {
  if (currency === 'INR') {
    return `₹${plan.priceINR}`;
  }
  return `$${plan.priceUSD.toFixed(2)}`;
}

/** Calculate per-day cost for comparison */
export function perDayCost(plan: SubscriptionPlan, currency: 'INR' | 'USD' = 'INR'): string {
  const days = plan.durationMs / (24 * 60 * 60 * 1000);
  const price = currency === 'INR' ? plan.priceINR : plan.priceUSD;
  const perDay = price / Math.max(days, 1);
  if (currency === 'INR') return `₹${perDay.toFixed(0)}/day`;
  return `$${perDay.toFixed(2)}/day`;
}
