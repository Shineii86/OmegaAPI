/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  OmegaAPI — Search Index Generator                         │
 * │  Author : Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ                                   │
 * │  License: MIT                                              │
 * │  Script : scripts/generate-search-index.ts                 │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Build-time script that fetches all series from the upstream API
 * and generates a static search-index.json file.
 *
 * Run: npx tsx scripts/generate-search-index.ts
 *
 * Output: public/search-index.json
 * Format: Array of { slug, title, alt, author, tags, status, type, rating, views }
 *
 * NOTE: This eliminates the need for the browse page to fetch all
 * 263 series on every first visit. The static index is served as
 * a regular asset and loaded instantly.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const OMEGA_BASE = 'https://api.omegascans.org';

interface SeriesEntry {
  slug: string;
  title: string;
  alt: string;
  author: string;
  tags: string[];
  status: string;
  type: string;
  rating: number;
  views: number;
}

async function fetchAllSeries(): Promise<SeriesEntry[]> {
  const allSeries: SeriesEntry[] = [];
  let page = 1;
  let hasMore = true;

  console.log('Fetching series from OmegaScans API...');

  while (hasMore) {
    try {
      const res = await fetch(`${OMEGA_BASE}/query?type=series&page=${page}&perPage=100`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const series = data.data || [];

      for (const s of series) {
        allSeries.push({
          slug: s.series_slug,
          title: s.title,
          alt: s.alternative_names || '',
          author: '',
          tags: [],
          status: s.status || '',
          type: s.series_type || '',
          rating: s.rating || 0,
          views: s.total_views || 0,
        });
      }

      console.log(`  Page ${page}: ${series.length} series (total: ${allSeries.length})`);

      hasMore = series.length > 0 && !!data.meta?.next_page_url;
      page++;

      // Rate limit: small delay between requests
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.error(`  Error fetching page ${page}:`, err);
      hasMore = false;
    }
  }

  // Enrich with detail data (tags, author) in batches
  console.log('\nEnriching series with detail data...');
  const batchSize = 10;
  for (let i = 0; i < allSeries.length; i += batchSize) {
    const batch = allSeries.slice(i, i + batchSize);
    const promises = batch.map(async (series) => {
      try {
        const res = await fetch(`${OMEGA_BASE}/series/${series.slug}`);
        if (!res.ok) return;
        const detail = await res.json();
        series.tags = (detail.tags || []).map((t: { name: string }) => t.name);
        series.author = detail.author || '';
      } catch {
        // Skip enrichment failures
      }
    });
    await Promise.all(promises);
    console.log(`  Enriched ${Math.min(i + batchSize, allSeries.length)}/${allSeries.length}`);
    await new Promise(r => setTimeout(r, 300));
  }

  return allSeries;
}

async function main() {
  const series = await fetchAllSeries();

  const outputDir = join(process.cwd(), 'public');
  const outputPath = join(outputDir, 'search-index.json');

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputPath, JSON.stringify(series, null, 2));

  console.log(`\n✅ Generated search-index.json with ${series.length} series`);
  console.log(`   Output: ${outputPath}`);
  console.log(`   Size: ${(Buffer.byteLength(JSON.stringify(series)) / 1024).toFixed(1)} KB`);
}

main().catch(console.error);
