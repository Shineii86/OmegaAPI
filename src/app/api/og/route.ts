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
 * Uses inline SVG icons instead of emojis for cross-platform rendering.
 *
 * Query Parameters:
 *   title  - Series title (required)
 *   rating - Series rating (optional, e.g. "4.5")
 *   views  - View count (optional, e.g. "1.2M")
 *   status - Series status (optional, e.g. "Ongoing")
 *
 * Response: image/svg+xml
 */

import { NextRequest } from 'next/server';

export const runtime = 'edge';

// ==================== SVG ICONS ====================
// Inline SVG paths for icons (no emojis — cross-platform safe)

const ICONS = {
  /** Star icon (rating) */
  star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" fill="#fbbf24" stroke="none"/>',

  /** Eye icon (views) */
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" fill="none" stroke="#71717a" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="none" stroke="#71717a" stroke-width="2"/>',

  /** Search icon */
  search: '<circle cx="11" cy="11" r="8" fill="none" stroke="#71717a" stroke-width="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#71717a" stroke-width="2"/>',

  /** Book icon (read) */
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" fill="none" stroke="#71717a" stroke-width="2"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="none" stroke="#71717a" stroke-width="2"/>',

  /** Chart icon (stats) */
  chart: '<line x1="12" y1="20" x2="12" y2="10" stroke="#71717a" stroke-width="2"/><line x1="18" y1="20" x2="18" y2="4" stroke="#71717a" stroke-width="2"/><line x1="6" y1="20" x2="6" y2="16" stroke="#71717a" stroke-width="2"/>',

  /** Tag icon (genres) */
  tag: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" fill="none" stroke="#71717a" stroke-width="2"/><circle cx="7" cy="7" r="1" fill="#71717a"/>',

  /** Bolt icon (no auth / fast) */
  bolt: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="none" stroke="#71717a" stroke-width="2"/>',

  /** Heart icon */
  heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#ef4444" stroke="none"/>',
} as const;

/**
 * Wrap an SVG path in a 24x24 viewBox icon container.
 */
function icon(iconPath: string, x: number, y: number, size = 20): string {
  const scale = size / 24;
  return '<g transform="translate(' + x + ', ' + y + ') scale(' + scale + ')">' + iconPath + '</g>';
}

// ==================== HANDLER ====================
// ---- FEATURE: OG IMAGE ----

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'OmegaAPI';
  const rating = searchParams.get('rating') || '';
  const views = searchParams.get('views') || '';
  const status = searchParams.get('status') || '';

  // Truncate long titles
  const displayTitle = title.length > 45 ? title.slice(0, 42) + '...' : title;

  // Calculate title font size (smaller for longer titles)
  const titleFontSize = displayTitle.length > 30 ? 42 : displayTitle.length > 20 ? 48 : 54;

  // ── Build badge row ──
  let badgeSvg = '';
  let badgeX = 90;

  if (rating) {
    badgeSvg += icon(ICONS.star, badgeX, 181, 18);
    badgeSvg += '<text x="' + (badgeX + 24) + '" y="195" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#fbbf24">' + escapeXml(rating) + '</text>';
    badgeX += 100;
  }

  if (views) {
    badgeSvg += icon(ICONS.eye, badgeX, 181, 18);
    badgeSvg += '<text x="' + (badgeX + 24) + '" y="195" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="#71717a">' + escapeXml(views) + '</text>';
    badgeX += 200;
  }

  if (status) {
    const pillW = status.length * 12 + 24;
    const pillX = badgeX + 20;
    badgeSvg += '<rect x="' + pillX + '" y="179" width="' + pillW + '" height="28" rx="14" fill="none" stroke="#3f3f46" stroke-width="1.5"/>';
    badgeSvg += '<text x="' + (pillX + 12) + '" y="199" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#a1a1aa" letter-spacing="0.05em">' + escapeXml(status.toUpperCase()) + '</text>';
  }

  // ── Build feature icons row ──
  const featureList = [
    { icon: ICONS.search, label: 'Search', x: 0 },
    { icon: ICONS.book, label: 'Read', x: 200 },
    { icon: ICONS.chart, label: 'Stats', x: 400 },
    { icon: ICONS.tag, label: 'Genres', x: 600 },
    { icon: ICONS.bolt, label: 'No Auth', x: 800 },
  ];

  let featuresSvg = '';
  for (const f of featureList) {
    featuresSvg += icon(f.icon, 90 + f.x, 348, 18);
    featuresSvg += '<text x="' + (116 + f.x) + '" y="362" font-family="system-ui, -apple-system, sans-serif" font-size="15" fill="#71717a">' + f.label + '</text>';
  }

  // ── Assemble SVG ──
  const svg = [
    '<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">',
    '<defs>',
    '  <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">',
    '    <stop offset="0%" style="stop-color:#0a0a10"/>',
    '    <stop offset="100%" style="stop-color:#12121a"/>',
    '  </linearGradient>',
    '  <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">',
    '    <stop offset="0%" style="stop-color:#ef4444"/>',
    '    <stop offset="100%" style="stop-color:#fbbf24"/>',
    '  </linearGradient>',
    '  <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">',
    '    <stop offset="0%" style="stop-color:#ef4444;stop-opacity:0.15"/>',
    '    <stop offset="100%" style="stop-color:#fbbf24;stop-opacity:0.05"/>',
    '  </linearGradient>',
    '</defs>',

    // Background
    '<rect width="1200" height="630" fill="url(#bg)"/>',

    // Grid dots
    '<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">',
    '  <circle cx="1" cy="1" r="1" fill="#ffffff" opacity="0.04"/>',
    '</pattern>',
    '<rect width="1200" height="630" fill="url(#grid)"/>',

    // Glow orb
    '<ellipse cx="900" cy="200" rx="300" ry="200" fill="url(#glow)"/>',

    // Top accent bar
    '<rect x="0" y="0" width="1200" height="4" fill="url(#accent)"/>',

    // Left accent bar
    '<rect x="60" y="80" width="5" height="180" rx="2.5" fill="#ef4444"/>',

    // Title
    '<text x="90" y="155" font-family="system-ui, -apple-system, sans-serif" font-size="' + titleFontSize + '" font-weight="800" fill="#e4e4e7" letter-spacing="-0.02em">' + escapeXml(displayTitle) + '</text>',

    // Badges
    badgeSvg,

    // Divider
    '<rect x="60" y="250" width="1080" height="1" fill="#2a2a36"/>',

    // API brand
    '<text x="90" y="310" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="800" fill="#fbbf24" letter-spacing="0.12em">OMEGAAPI</text>',
    '<text x="280" y="310" font-family="system-ui, -apple-system, sans-serif" font-size="17" fill="#52525b">Free Manga &amp; Manhwa REST API</text>',

    // Features
    featuresSvg,

    // Bottom bar
    '<rect x="0" y="580" width="1200" height="50" fill="#0f0f17"/>',
    '<rect x="0" y="580" width="1200" height="1" fill="#2a2a36"/>',

    // Bottom left: URL
    '<text x="60" y="611" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#52525b">omegaapi.vercel.app</text>',

    // Bottom right: credit with heart icon
    '<text x="1040" y="611" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#52525b">Built with</text>',
    icon(ICONS.heart, 1122, 597, 14),
    '<text x="1140" y="611" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#52525b">by Shinei Nouzen</text>',

    '</svg>',
  ].join('\n');

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
