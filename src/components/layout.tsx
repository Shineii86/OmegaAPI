'use client';

const BASE = typeof window !== 'undefined' ? window.location.origin : 'https://omegaapi.vercel.app';

export function Navbar({ active }: { active?: 'home' | 'docs' | 'browse' | 'support' }) {
  return (
    <nav className="glass sticky top-0 z-50 border-b border-[#1e1e3a]/40">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center text-white font-black text-sm shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">Ω</div>
          <span className="font-bold text-lg tracking-tight">OmegaAPI</span>
          {active === 'docs' && <span className="tag tag-purple ml-1 hidden sm:inline-flex">Docs</span>}
          {active === 'browse' && <span className="tag tag-cyan ml-1 hidden sm:inline-flex">Browse</span>}
          {active === 'support' && <span className="tag tag-amber ml-1 hidden sm:inline-flex">Support</span>}
        </a>
        <div className="hidden md:flex items-center gap-6">
          {active !== 'home' && <a href="/" className="text-sm text-[#8b89a0] hover:text-[#e8e6f0] transition-colors">Home</a>}
          {active !== 'docs' && <a href="/docs" className="text-sm text-[#8b89a0] hover:text-[#e8e6f0] transition-colors">Docs</a>}
          {active !== 'browse' && <a href="/browse" className="text-sm text-[#8b89a0] hover:text-[#e8e6f0] transition-colors">Browse</a>}
          {active !== 'support' && <a href="/support" className="text-sm text-[#8b89a0] hover:text-[#e8e6f0] transition-colors">Support</a>}
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[#1e1e3a]/40 py-10">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center text-white font-black text-xs">Ω</div>
            <span className="text-sm text-[#5c5a70]">OmegaAPI v1.0 — Free Manga and Manhwa REST API</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="/docs" className="text-[#5c5a70] hover:text-[#e8e6f0] transition-colors">Docs</a>
            <a href="/browse" className="text-[#5c5a70] hover:text-[#e8e6f0] transition-colors">Browse</a>
            <a href="/support" className="text-[#5c5a70] hover:text-[#e8e6f0] transition-colors">Support</a>
            <a href="/terms" className="text-[#5c5a70] hover:text-[#e8e6f0] transition-colors">Terms</a>
            <a href="/privacy" className="text-[#5c5a70] hover:text-[#e8e6f0] transition-colors">Privacy</a>
            <span className="text-[#5c5a70]">Data from <a href="https://omegascans.org" target="_blank" rel="noopener noreferrer" className="text-[#a78bfa] hover:underline">OmegaScans</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
