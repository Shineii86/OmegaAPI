'use client';

import { useState } from 'react';
import { IconMenu, IconX, IconGithub, IconHeart } from '@/components/icons';

export function Navbar({ active, children, theme = 'light' }: { active?: 'home' | 'docs' | 'browse' | 'support'; children?: React.ReactNode; theme?: 'light' | 'dark' }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDark = theme === 'dark';

  return (
    <nav className={isDark ? 'nav-frosted sticky top-0 z-50' : 'nav-frosted sticky top-0 z-50'}>
      <div className="max-w-container mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 group">
          <div className={`w-8 h-8 flex items-center justify-center font-black text-sm border-2 ${isDark ? 'bg-[#fbbf24] text-[#0f172a] border-[#e4e4e7]' : 'bg-[#f59e0b] text-[#0f172a] border-[#0f172a]'} shadow-brutal-sm`}>Ω</div>
          <span className="font-display text-lg tracking-tight" style={{ color: isDark ? '#e4e4e7' : '#0f172a' }}>OMEGAAPI</span>
          {active === 'docs' && <span className="pill-tag ml-1 hidden sm:inline-flex" style={{ color: '#8b5cf6', borderColor: '#8b5cf6' }}>DOCS</span>}
          {active === 'browse' && <span className="pill-tag ml-1 hidden sm:inline-flex" style={{ color: isDark ? '#ef4444' : '#06b6d4', borderColor: isDark ? '#ef4444' : '#06b6d4' }}>BROWSE</span>}
          {active === 'support' && <span className="pill-tag ml-1 hidden sm:inline-flex" style={{ color: '#f59e0b', borderColor: '#f59e0b' }}>SUPPORT</span>}
        </a>

        <div className="hidden md:flex items-center gap-6">
          {active !== 'home' && <a href="/" className={`text-sm font-semibold uppercase tracking-wider transition-colors ${isDark ? 'text-[#a1a1aa] hover:text-[#e4e4e7]' : 'text-[#64748b] hover:text-[#0f172a]'}`} style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>Home</a>}
          {active !== 'docs' && <a href="/docs" className={`text-sm font-semibold uppercase tracking-wider transition-colors ${isDark ? 'text-[#a1a1aa] hover:text-[#e4e4e7]' : 'text-[#64748b] hover:text-[#0f172a]'}`} style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>Docs</a>}
          {active !== 'browse' && <a href="/browse" className={`text-sm font-semibold uppercase tracking-wider transition-colors ${isDark ? 'text-[#a1a1aa] hover:text-[#e4e4e7]' : 'text-[#64748b] hover:text-[#0f172a]'}`} style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>Browse</a>}
          {active !== 'support' && <a href="/support" className={`text-sm font-semibold uppercase tracking-wider transition-colors ${isDark ? 'text-[#a1a1aa] hover:text-[#e4e4e7]' : 'text-[#64748b] hover:text-[#0f172a]'}`} style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>Support</a>}
          {children}
        </div>

        <button className={`md:hidden ${isDark ? 'text-[#a1a1aa]' : 'text-[#64748b]'}`} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <IconX size={22} /> : <IconMenu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className={`md:hidden border-t px-5 py-4 space-y-3 animate-fade-in ${isDark ? 'bg-[#121218] border-[#2a2a36]' : 'bg-[#f0f2f8] border-[#d0d4e4]'}`}>
          {active !== 'home' && <a href="/" className={`block text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-[#a1a1aa]' : 'text-[#64748b]'}`} onClick={() => setMobileOpen(false)}>Home</a>}
          {active !== 'docs' && <a href="/docs" className={`block text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-[#a1a1aa]' : 'text-[#64748b]'}`} onClick={() => setMobileOpen(false)}>Docs</a>}
          {active !== 'browse' && <a href="/browse" className={`block text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-[#a1a1aa]' : 'text-[#64748b]'}`} onClick={() => setMobileOpen(false)}>Browse</a>}
          {active !== 'support' && <a href="/support" className={`block text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-[#a1a1aa]' : 'text-[#64748b]'}`} onClick={() => setMobileOpen(false)}>Support</a>}
        </div>
      )}
    </nav>
  );
}

export function Footer({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const isDark = theme === 'dark';
  const bg = isDark ? '#0c0c12' : '#0f172a';
  const text = '#94a3b8';
  const accent = isDark ? '#fbbf24' : '#f59e0b';

  return (
    <footer style={{ background: bg, borderTop: `3px solid ${isDark ? '#2a2a36' : '#334155'}` }}>
      <div className="max-w-container mx-auto px-5 md:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center font-black text-sm border-2" style={{ background: accent, color: '#0f172a', borderColor: '#e4e4e7' }}>Ω</div>
            <div>
              <span className="font-display text-sm tracking-wider" style={{ color: '#e4e4e7' }}>OMEGAAPI</span>
              <p className="text-xs" style={{ color: text }}>Free Manga & Manhwa REST API</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <a href="/docs" className="font-semibold uppercase tracking-wider transition-colors hover:text-white" style={{ color: text, fontSize: '0.65rem', letterSpacing: '0.1em' }}>Docs</a>
            <a href="/browse" className="font-semibold uppercase tracking-wider transition-colors hover:text-white" style={{ color: text, fontSize: '0.65rem', letterSpacing: '0.1em' }}>Browse</a>
            <a href="/support" className="font-semibold uppercase tracking-wider transition-colors hover:text-white" style={{ color: text, fontSize: '0.65rem', letterSpacing: '0.1em' }}>Support</a>
            <a href="/terms" className="font-semibold uppercase tracking-wider transition-colors hover:text-white" style={{ color: text, fontSize: '0.65rem', letterSpacing: '0.1em' }}>Terms</a>
            <a href="/privacy" className="font-semibold uppercase tracking-wider transition-colors hover:text-white" style={{ color: text, fontSize: '0.65rem', letterSpacing: '0.1em' }}>Privacy</a>
          </div>
        </div>
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: `1px solid ${isDark ? '#222230' : '#334155'}` }}>
          <p className="text-xs" style={{ color: text }}>
            Data from <a href="https://omegascans.org" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline" style={{ color: accent }}>OmegaScans</a> · Not affiliated
          </p>
          <div className="flex items-center gap-2 text-xs" style={{ color: text }}>
            <span>Built with</span>
            <span className="animate-heartbeat" style={{ color: '#ef4444' }}>♥</span>
            <span>by</span>
            <a href="https://github.com/Shineii86" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline" style={{ color: accent }}>Shineii86</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
