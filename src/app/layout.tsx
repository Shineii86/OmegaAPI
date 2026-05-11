import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OmegaAPI — Free Manga & Manhwa REST API',
  description:
    'Free, public REST API for manga and manhwa data from OmegaScans. No authentication required. Browse series, read chapters, search titles — all with a clean JSON interface.',
  keywords: [
    'manga API',
    'manhwa API',
    'webtoon API',
    'REST API',
    'OmegaScans',
    'free API',
    'manga data',
    'manhwa data',
    'chapter images',
    'manga reader API',
  ],
  openGraph: {
    title: 'OmegaAPI — Free Manga & Manhwa REST API',
    description:
      'Free, public REST API for manga and manhwa data from OmegaScans. No auth required.',
    type: 'website',
    url: 'https://omegaapi.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OmegaAPI — Free Manga & Manhwa REST API',
    description:
      'Free, public REST API for manga and manhwa data from OmegaScans. No auth required.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
