/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  OmegaAPI — Dynamic Sitemap Generator                      │
 * │  Author : Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ                                   │
 * │  License: MIT                                              │
 * │  Route  : /sitemap.xml                                     │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Generates a dynamic sitemap.xml for SEO.
 * Includes static pages + all series browse pages.
 *
 * NOTE: Series slugs are fetched from our own API and cached
 * for 1 hour via Next.js ISR (revalidate: 3600).
 * Falls back to a hardcoded list of popular slugs on failure.
 */

import type { MetadataRoute } from 'next';

// ==================== CONSTANTS ====================

const BASE_URL = 'https://omegaapi.vercel.app';

/**
 * Hardcoded popular series slugs — used as fallback if the
 * API call fails (e.g. during build time or upstream downtime).
 */
const POPULAR_SLUGS = [
  'sex-stopwatch',
  'glory-hole-shop',
  'the-father-in-law-fucks-them-all',
];

// ==================== HELPERS ====================

/**
 * Fetch all series slugs from the API for sitemap inclusion.
 *
 * NOTE: Uses Next.js ISR revalidation (1 hour) to avoid
 * hammering the API on every build. Falls back to POPULAR_SLUGS
 * if the request fails.
 *
 * @returns - Array of series slug strings
 */
async function fetchSeriesSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/series?perPage=100`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (!res.ok) return POPULAR_SLUGS;
    const data = await res.json();
    if (!data.success || !data.data) return POPULAR_SLUGS;
    return data.data.map((s: { slug: string }) => s.slug);
  } catch {
    return POPULAR_SLUGS;
  }
}

// ==================== SITEMAP GENERATOR ====================
// ---- FEATURE: SITEMAP ----

/**
 * Generate the complete sitemap.xml.
 *
 * Combines:
 *   1. Static pages (home, browse, docs, support, terms, privacy)
 *   2. Dynamic series pages (/browse/:slug)
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seriesSlugs = await fetchSeriesSlugs();

  // Static pages with priority and change frequency
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/browse`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/docs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/support`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Dynamic series pages
  const seriesPages: MetadataRoute.Sitemap = seriesSlugs.map((slug) => ({
    url: `${BASE_URL}/browse/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...seriesPages];
}

// ==================== EOF ====================
