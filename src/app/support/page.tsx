'use client';

import type { Metadata } from 'next';
import { IconBook, IconBug, IconLightbulb, IconExternalLink, IconChevronDown, IconHeartPulse } from '@/components/icons';
import { CodeBlock } from '@/components/ui';

const faqs = [
  { q: 'Do I need an API key?', a: 'No. OmegaAPI is completely free and requires no authentication. Just make a GET request and receive JSON.' },
  { q: 'What are the rate limits?', a: '60 requests per minute per IP address. When exceeded, you\'ll receive a 429 response with a Retry-After header.' },
  { q: 'How fresh is the data?', a: 'Data is cached for 5-15 minutes depending on the endpoint. Series details cache for 5 min, search for 10 min, chapter content for 15 min.' },
  { q: 'Can I use this in my production app?', a: 'Yes, but with caution. This is a free, community API with no SLA. We recommend implementing caching on your side, graceful error handling, and respecting rate limits.' },
  { q: 'Does the API support CORS?', a: 'Yes. All origins are allowed. You can call the API directly from any browser, mobile app, or desktop application.' },
  { q: 'How do I get chapter images?', a: 'Use the /api/v1/chapter/{slug}/{chapter} endpoint. The response includes an images array with direct URLs to each page.' },
  { q: 'Is this affiliated with OmegaScans?', a: 'No. OmegaAPI is an independent project that proxies publicly available data from OmegaScans. We are not affiliated with or endorsed by OmegaScans.' },
  { q: 'Can I contribute to the project?', a: 'Yes! The project is open source. Check the GitHub repository for contribution guidelines.' },
];

const BASE = typeof window !== 'undefined' ? window.location.origin : 'https://omegaapi.vercel.app';

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <nav className="glass-nav sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6355e3] to-[#8b5cf6] flex items-center justify-center text-white font-black text-sm shadow-sm">Ω</div>
            <span className="font-bold text-lg tracking-tight text-[var(--text)]">OmegaAPI</span>
            <span className="tag tag-amber ml-1 hidden sm:inline-flex text-[0.6rem]">Support</span>
          </a>
          <div className="hidden md:flex items-center gap-6">
            <a href="/" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors font-medium">Home</a>
            <a href="/docs" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors font-medium">Docs</a>
            <a href="/browse" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors font-medium">Browse</a>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-5 md:px-8 py-16">
        <div className="text-center mb-16">
          <p className="section-label">Support</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-[var(--text)]">How Can We Help?</h1>
          <p className="text-[var(--text-secondary)] max-w-lg mx-auto">Find answers to common questions, report issues, or get in touch.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-16">
          {[
            { icon: <IconBook size={24} />, title: 'Documentation', desc: 'Full API reference with examples', href: '/docs', link: 'Read the docs' },
            { icon: <IconBug size={24} />, title: 'Report a Bug', desc: 'Found something broken? Let us know', href: 'https://github.com/Shineii86/OmegaAPI/issues', link: 'Open an issue', external: true },
            { icon: <IconLightbulb size={24} />, title: 'Request a Feature', desc: 'Have an idea? We\'d love to hear it', href: 'https://github.com/Shineii86/OmegaAPI/issues', link: 'Submit request', external: true },
          ].map((card) => (
            <a key={card.title} href={card.href} target={card.external ? '_blank' : undefined} rel={card.external ? 'noopener noreferrer' : undefined} className="glass-card rounded-2xl p-6 group text-center">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">{card.icon}</div>
              <h3 className="font-semibold mb-1 text-[var(--text)]">{card.title}</h3>
              <p className="text-xs text-[var(--text-muted)] mb-3">{card.desc}</p>
              <span className="text-xs text-[var(--accent)] group-hover:underline flex items-center gap-1 justify-center font-medium">{card.link} <IconExternalLink size={10} /></span>
            </a>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-6 mb-16">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--emerald-subtle)] flex items-center justify-center text-[var(--emerald)]">
              <IconHeartPulse size={22} />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text)]">API Status: Operational</h3>
              <p className="text-sm text-[var(--text-secondary)]">All systems normal. Check <a href="/api/v1/health" target="_blank" className="text-[var(--accent)] hover:underline font-medium">/api/v1/health</a> for real-time status.</p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="text-center mb-10">
            <p className="section-label">FAQ</p>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--text)]">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, i) => (
              <details key={i} className="glass-card rounded-xl group">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none">
                  <span className="font-medium text-sm pr-4 text-[var(--text)]">{faq.q}</span>
                  <span className="shrink-0 text-[var(--text-muted)] group-open:rotate-180 transition-transform"><IconChevronDown size={16} /></span>
                </summary>
                <div className="px-6 pb-4 text-sm text-[var(--text-secondary)] leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 md:p-8 mb-16">
          <h3 className="text-xl font-bold mb-4 text-[var(--text)]">Rate Limit Troubleshooting</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-6">Getting 429 errors? Here&apos;s how to handle rate limits gracefully.</p>
          <CodeBlock title="javascript" lang="javascript" code={`async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const res = await fetch(url);

    if (res.status === 429) {
      const retryAfter = parseInt(
        res.headers.get('Retry-After') || '5'
      );
      console.log(\`Rate limited. Waiting \${retryAfter}s...\`);
      await new Promise(r => setTimeout(r, retryAfter * 1000));
      continue;
    }

    return res.json();
  }
  throw new Error('Max retries exceeded');
}`} />
        </div>

        <div className="glass-card rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-[var(--cyan)]/5" />
          <div className="relative">
            <h3 className="text-2xl font-bold mb-3 text-[var(--text)]">Still Need Help?</h3>
            <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto mb-6">Open an issue on GitHub and we&apos;ll get back to you as soon as possible. For urgent matters, check if the API is <a href="/api/v1/health" target="_blank" className="text-[var(--accent)] hover:underline font-medium">healthy</a>.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://github.com/Shineii86/OmegaAPI/issues" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-1.5">Open GitHub Issue <IconExternalLink size={14} /></a>
              <a href="/docs" className="btn-ghost">Read the Docs</a>
            </div>
          </div>
        </div>

        <div className="h-16" />
      </div>
    </main>
  );
}
