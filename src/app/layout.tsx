import type { Metadata, Viewport } from 'next';
import './globals.css';

const SITE_URL = 'https://omegaapi.vercel.app';
const SITE_NAME = 'OmegaAPI';
const DESCRIPTION = 'Free, public REST API for manga and manhwa data from OmegaScans. No authentication required. Browse series, read chapters, search titles — all with a clean JSON interface.';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#6355e3',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'OmegaAPI — Free Manga & Manhwa REST API',
    template: '%s — OmegaAPI',
  },
  description: DESCRIPTION,
  keywords: [
    'manga API', 'manhwa API', 'webtoon API', 'REST API', 'OmegaScans',
    'free API', 'manga data', 'manhwa data', 'chapter images', 'manga reader API',
    'manga json api', 'free manhwa api', 'no auth api',
  ],
  authors: [{ name: 'Shineii86', url: 'https://github.com/Shineii86' }],
  creator: 'Shineii86',
  publisher: 'OmegaAPI',
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },

  // ── Favicon ──
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon.svg', color: '#6355e3' },
    ],
  },

  // ── Open Graph ──
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'OmegaAPI — Free Manga & Manhwa REST API',
    description: DESCRIPTION,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OmegaAPI — Free Manga & Manhwa REST API. No auth required. Browse series, read chapters, search titles.',
        type: 'image/png',
      },
    ],
  },

  // ── Twitter ──
  twitter: {
    card: 'summary_large_image',
    title: 'OmegaAPI — Free Manga & Manhwa REST API',
    description: DESCRIPTION,
    images: ['/og-image.png'],
    creator: '@shineii86',
  },

  // ── Verification (add when available) ──
  // verification: {
  //   google: 'your-google-verification-code',
  // },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external origins for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'OmegaAPI',
              url: SITE_URL,
              description: DESCRIPTION,
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              author: {
                '@type': 'Person',
                name: 'Shineii86',
                url: 'https://github.com/Shineii86',
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: `${SITE_URL}/api/v1/search?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
