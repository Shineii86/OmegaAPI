/**
 * ┌─────────────────────────────────────────────────────────────┐
 * │  OmegaAPI — Dynamic OG Image Generator                     │
 * │  Author : Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ                                   │
 * │  License: MIT                                              │
 * │  Route  : GET /api/og?title=...&rating=...&views=...       │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Generate dynamic Open Graph images for social media sharing.
 * Returns an SVG image with series metadata rendered as a card.
 *
 * Query Parameters:
 *   title  - Series title (required)
 *   rating - Series rating (optional, e.g. "4.5")
 *   views  - View count (optional, e.g. "1.2M")
 *   status - Series status (optional, e.g. "Ongoing")
 *   cover  - Cover image URL (optional, shown as background)
 *
 * Response: image/svg+xml
 */

import { NextRequest } from 'next/server';

export const runtime = 'edge';

// ==================== HANDLER ====================
// ---- FEATURE: OG IMAGE ----

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'OmegaAPI';
  const rating = searchParams.get('rating') || '';
  const views = searchParams.get('views') || '';
  const status = searchParams.get('status') || '';

  // Truncate long titles
  const displayTitle = title.length > 50 ? title.slice(0, 47) + '...' : title;

  // Build status/rating badge text
  const badges = [status, rating ? `⭐ ${rating}` : '', views ? `👁 ${views}` : '']
    .filter(Boolean)
    .join(' · ');

  const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a10"/>
      <stop offset="100%" style="stop-color:#12121a"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#ef4444"/>
      <stop offset="100%" style="stop-color:#fbbf24"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Grid pattern -->
  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
    <circle cx="1" cy="1" r="1" fill="#ffffff" opacity="0.03"/>
  </pattern>
  <rect width="1200" height="630" fill="url(#grid)"/>

  <!-- Accent bar -->
  <rect x="0" y="0" width="1200" height="4" fill="url(#accent)"/>

  <!-- Left accent block -->
  <rect x="60" y="80" width="6" height="200" rx="3" fill="#ef4444"/>

  <!-- Title -->
  <text x="90" y="160" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="800" fill="#e4e4e7" letter-spacing="-0.02em">
    ${escapeXml(displayTitle)}
  </text>

  <!-- Badges -->
  ${badges ? `<text x="90" y="220" font-family="system-ui, -apple-system, sans-serif" font-size="22" fill="#71717a" letter-spacing="0.05em">
    ${escapeXml(badges)}
  </text>` : ''}

  <!-- Divider -->
  <rect x="60" y="280" width="1080" height="1" fill="#2a2a36"/>

  <!-- API info -->
  <text x="90" y="340" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="700" fill="#fbbf24" letter-spacing="0.1em">
    OMEGAAPI
  </text>
  <text x="310" y="340" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="#52525b">
    Free Manga &amp; Manhwa REST API
  </text>

  <!-- Features -->
  <text x="90" y="400" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#71717a">
    🔍 Search  ·  📖 Read  ·  📊 Stats  ·  🏷️ Genres  ·  ⚡ No Auth
  </text>

  <!-- Bottom bar -->
  <rect x="0" y="580" width="1200" height="50" fill="#0f0f17"/>
  <text x="60" y="610" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#52525b">
    omegaapi.vercel.app
  </text>
  <text x="1140" y="610" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#52525b" text-anchor="end">
    Built with ❤️ by Shinei Nouzen
  </text>
</svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}

/**
 * Escape special XML characters in text content.
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ==================== EOF ====================
