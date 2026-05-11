'use client';

import { Navbar, Footer } from '@/components/layout';
import { IconSearch, IconBook, IconArrowRight, IconHome } from '@/components/icons';

export default function NotFound() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      <div className="max-w-container mx-auto px-5 md:px-8 py-20 flex items-center justify-center" style={{ minHeight: '70vh' }}>
        <div className="text-center max-w-lg">
          {/* Big 404 */}
          <div className="font-display text-[8rem] md:text-[10rem] font-bold leading-none tracking-tighter" style={{ color: 'var(--bg-dim)' }}>404</div>

          {/* Overlay content */}
          <div className="-mt-16 md:-mt-20 relative">
            <div className="inline-flex items-center gap-2 pill-tag mb-6" style={{ color: '#ef4444', borderColor: '#ef4444' }}>
              <IconSearch size={13} /> NOT FOUND
            </div>

            <h1 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight mb-4">Page Not Found</h1>

            <p className="text-base mb-8 leading-relaxed" style={{ color: '#64748b' }}>
              The page you&apos;re looking for doesn&apos;t exist or has been moved. Try browsing series or searching for what you need.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/" className="btn-brutal inline-flex items-center gap-2 justify-center">
                <IconHome size={16} /> GO HOME
              </a>
              <a href="/browse" className="btn-brutal-outline inline-flex items-center gap-2 justify-center" style={{ borderColor: '#0f172a', boxShadow: '3px 3px 0 0 #0f172a' }}>
                <IconBook size={16} /> BROWSE SERIES
              </a>
              <a href="/docs" className="btn-brutal-outline inline-flex items-center gap-2 justify-center" style={{ borderColor: '#0f172a', boxShadow: '3px 3px 0 0 #0f172a' }}>
                API DOCS <IconArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
