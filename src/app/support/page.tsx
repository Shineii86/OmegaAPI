'use client';

import { Navbar, Footer } from '@/components/layout';
import { IconBook, IconBug, IconLightbulb, IconExternalLink, IconChevronDown, IconHeartPulse, IconGithub } from '@/components/icons';
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
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar active="support" />

      <div className="max-w-5xl mx-auto px-5 md:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 pill-tag mb-6" style={{ color: '#f59e0b', borderColor: '#f59e0b' }}>
            <IconHeartPulse size={13} /> SUPPORT
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4" style={{ color: 'var(--text)' }}>How Can We Help?</h1>
          <p className="text-lg" style={{ color: '#64748b' }}>Find answers to common questions, report issues, or get in touch.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mb-16">
          {[
            { icon: <IconBook size={24} />, title: 'Documentation', desc: 'Full API reference with examples', href: '/docs', link: 'Read the docs' },
            { icon: <IconBug size={24} />, title: 'Report a Bug', desc: 'Found something broken? Let us know', href: 'https://github.com/Shineii86/OmegaAPI/issues', link: 'Open an issue', external: true },
            { icon: <IconLightbulb size={24} />, title: 'Request a Feature', desc: 'Have an idea? We\'d love to hear it', href: 'https://github.com/Shineii86/OmegaAPI/issues', link: 'Submit request', external: true },
          ].map((card) => (
            <a key={card.title} href={card.href} target={card.external ? '_blank' : undefined} rel={card.external ? 'noopener noreferrer' : undefined} className="card-brutal group text-center">
              <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 group-hover:-translate-y-1 transition-transform" style={{ borderRadius: 12, background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>{card.icon}</div>
              <h3 className="font-bold text-base uppercase font-display mb-1">{card.title}</h3>
              <p className="text-xs mb-3" style={{ color: '#64748b' }}>{card.desc}</p>
              <span className="text-xs font-semibold flex items-center gap-1 justify-center" style={{ color: '#f59e0b' }}>{card.link} <IconExternalLink size={10} /></span>
            </a>
          ))}
        </div>

        <div className="card-brutal p-6 mb-16">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center" style={{ borderRadius: 12, background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
              <IconHeartPulse size={22} />
            </div>
            <div>
              <h3 className="font-bold" style={{ color: 'var(--text)' }}>API Status: Operational</h3>
              <p className="text-sm" style={{ color: '#64748b' }}>All systems normal. Check <a href="/api/v1/health" target="_blank" className="font-semibold hover:underline" style={{ color: '#f59e0b' }}>/api/v1/health</a> for real-time status.</p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 pill-tag mb-4" style={{ color: '#8b5cf6', borderColor: '#8b5cf6' }}>
              <IconBook size={13} /> FAQ
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight" style={{ color: 'var(--text)' }}>Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, i) => (
              <details key={i} className="card-brutal group">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none">
                  <span className="font-semibold text-sm pr-4" style={{ color: 'var(--text)' }}>{faq.q}</span>
                  <span className="shrink-0 group-open:rotate-180 transition-transform" style={{ color: '#64748b' }}><IconChevronDown size={16} /></span>
                </summary>
                <div className="px-6 pb-4 text-sm leading-relaxed" style={{ color: '#64748b' }}>{faq.a}</div>
              </details>
            ))}
          </div>
        </div>

        <div className="card-brutal p-6 md:p-8 mb-16">
          <h3 className="text-xl font-bold font-display uppercase mb-4">Rate Limit Troubleshooting</h3>
          <p className="text-sm mb-6" style={{ color: '#64748b' }}>Getting 429 errors? Here&apos;s how to handle rate limits gracefully.</p>
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

        <div className="card-brutal p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.05), rgba(6,182,212,0.05))' }} />
          <div className="relative">
            <h3 className="font-display text-2xl font-bold uppercase mb-3">Still Need Help?</h3>
            <p className="text-sm max-w-md mx-auto mb-6" style={{ color: '#64748b' }}>Open an issue on GitHub and we&apos;ll get back to you as soon as possible. For urgent matters, check if the API is <a href="/api/v1/health" target="_blank" className="font-semibold hover:underline" style={{ color: '#f59e0b' }}>healthy</a>.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://github.com/Shineii86/OmegaAPI/issues" target="_blank" rel="noopener noreferrer" className="btn-brutal inline-flex items-center gap-1.5"><IconGithub size={14} /> Open GitHub Issue <IconExternalLink size={14} /></a>
              <a href="/docs" className="btn-brutal-outline">Read the Docs</a>
            </div>
          </div>
        </div>

        <div className="h-16" />
      </div>

      <Footer />
    </main>
  );
}
