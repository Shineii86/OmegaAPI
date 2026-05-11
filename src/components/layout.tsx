'use client';

import { useState } from 'react';

export function Navbar({ active, children }: { active?: 'home' | 'docs' | 'browse' | 'support'; children?: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6355e3] to-[#8b5cf6] flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:shadow-md transition-shadow">Ω</div>
          <span className="font-bold text-lg tracking-tight text-[var(--text)]">OmegaAPI</span>
          {active === 'docs' && <span className="tag tag-purple ml-1 hidden sm:inline-flex text-[0.6rem]">Docs</span>}
          {active === 'browse' && <span className="tag tag-cyan ml-1 hidden sm:inline-flex text-[0.6rem]">Browse</span>}
          {active === 'support' && <span className="tag tag-amber ml-1 hidden sm:inline-flex text-[0.6rem]">Support</span>}
        </a>

        <div className="hidden md:flex items-center gap-6">
          {active !== 'home' && <a href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors font-medium">Home</a>}
          {active !== 'docs' && <a href="/docs" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors font-medium">Docs</a>}
          {active !== 'browse' && <a href="/browse" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors font-medium">Browse</a>}
          {active !== 'support' && <a href="/support" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors font-medium">Support</a>}
          {children}
        </div>

        <button className="md:hidden text-[var(--text-secondary)]" onClick={() => setMobileOpen(!mobileOpen)}>
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border-subtle)] px-5 py-4 space-y-3 animate-fade-in bg-white">
          {active !== 'home' && <a href="/" className="block text-sm text-[var(--text-secondary)] font-medium" onClick={() => setMobileOpen(false)}>Home</a>}
          {active !== 'docs' && <a href="/docs" className="block text-sm text-[var(--text-secondary)] font-medium" onClick={() => setMobileOpen(false)}>Docs</a>}
          {active !== 'browse' && <a href="/browse" className="block text-sm text-[var(--text-secondary)] font-medium" onClick={() => setMobileOpen(false)}>Browse</a>}
          {active !== 'support' && <a href="/support" className="block text-sm text-[var(--text-secondary)] font-medium" onClick={() => setMobileOpen(false)}>Support</a>}
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] py-10 bg-[var(--bg-subtle)]">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6355e3] to-[#8b5cf6] flex items-center justify-center text-white font-black text-xs">Ω</div>
            <span className="text-sm text-[var(--text-muted)]">OmegaAPI v1.0 — Free Manga & Manhwa REST API</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="/docs" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Docs</a>
            <a href="/browse" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Browse</a>
            <a href="/support" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Support</a>
            <a href="/terms" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Terms</a>
            <a href="/privacy" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">Privacy</a>
            <span className="text-[var(--text-muted)]">Data from <a href="https://omegascans.org" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline font-medium">OmegaScans</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
