import type { MetadataRoute } from 'next';

const BASE_URL = 'https://omegaapi.vercel.app';

// Popular slugs to always include (top series that are commonly linked)
const POPULAR_SLUGS = [
  'sex-stopwatch',
  'glory-hole-shop',
  'the-father-in-law-fucks-them-all',
];

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seriesSlugs = await fetchSeriesSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/browse`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/docs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/support`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const seriesPages: MetadataRoute.Sitemap = seriesSlugs.map((slug) => ({
    url: `${BASE_URL}/browse/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...seriesPages];
}
