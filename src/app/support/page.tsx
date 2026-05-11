import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support — OmegaAPI',
  description: 'Get help with OmegaAPI, report issues, or request features.',
};

/* Inline SVG icons as components */
function IconBook({ size = 24 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
}
function IconBug({ size = 24 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="6" width="8" height="14" rx="4" /><path d="M19 12h2M3 12h2M19 6l1.5-3M5 6L3.5 3M19 18l1.5 3M5 18l-1.5 3M12 6V2M12 22v-4" /></svg>;
}
function IconLightbulb({ size = 24 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" /></svg>;
}
function IconExternalLink({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>;
}
function IconChevronDown({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>;
}
function IconHeartPulse({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19.5 12.572l-7.5 7.428-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572" /><path d="M6 12h2l2-4 3 8 2-4h3" /></svg>;
}

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

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#06060e]">
      <nav className="glass sticky top-0 z-50 border-b border-[#1e1e3a]/40">
        <div className="max-w-5xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center text-white font-black text-sm">Ω</div>
            <span className="font-bold text-lg tracking-tight">OmegaAPI</span>
            <span className="tag tag-amber ml-1 hidden sm:inline-flex">Support</span>
          </a>
          <div className="hidden md:flex items-center gap-6">
            <a href="/" className="text-sm text-[#8b89a0] hover:text-[#e8e6f0] transition-colors">Home</a>
            <a href="/docs" className="text-sm text-[#8b89a0] hover:text-[#e8e6f0] transition-colors">Docs</a>
            <a href="/browse" className="text-sm text-[#8b89a0] hover:text-[#e8e6f0] transition-colors">Browse</a>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-5 md:px-8 py-16">
        <div className="text-center mb-16">
          <p className="section-label">Support</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">How Can We Help?</h1>
          <p className="text-[#8b89a0] max-w-lg mx-auto">Find answers to common questions, report issues, or get in touch.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-16">
          {[
            { icon: <IconBook />, title: 'Documentation', desc: 'Full API reference with examples', href: '/docs', link: 'Read the docs' },
            { icon: <IconBug />, title: 'Report a Bug', desc: 'Found something broken? Let us know', href: 'https://github.com', link: 'Open an issue', external: true },
            { icon: <IconLightbulb />, title: 'Request a Feature', desc: 'Have an idea? We\'d love to hear it', href: 'https://github.com', link: 'Submit request', external: true },
          ].map((card) => (
            <a key={card.title} href={card.href} target={card.external ? '_blank' : undefined} rel={card.external ? 'noopener noreferrer' : undefined} className="glass-card rounded-2xl p-6 group text-center">
              <div className="w-12 h-12 rounded-xl bg-[#7c3aed]/10 text-[#a78bfa] flex items-center justify-center mx-auto mb-3">{card.icon}</div>
              <h3 className="font-semibold mb-1">{card.title}</h3>
              <p className="text-xs text-[#5c5a70] mb-3">{card.desc}</p>
              <span className="text-xs text-[#a78bfa] group-hover:underline flex items-center gap-1 justify-center">
                {card.link} <IconExternalLink size={10} />
              </span>
            </a>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-6 mb-16">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#10b981]/10 flex items-center justify-center text-[#10b981]">
              <IconHeartPulse />
            </div>
            <div>
              <h3 className="font-semibold">API Status: Operational</h3>
              <p className="text-sm text-[#8b89a0]">
                All systems normal. Check <a href="/api/v1/health" target="_blank" className="text-[#a78bfa] hover:underline">/api/v1/health</a> for real-time status.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="text-center mb-10">
            <p className="section-label">FAQ</p>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, i) => (
              <details key={i} className="glass-card rounded-xl group">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none">
                  <span className="font-medium text-sm pr-4">{faq.q}</span>
                  <span className="shrink-0 text-[#5c5a70] group-open:rotate-180 transition-transform"><IconChevronDown /></span>
                </summary>
                <div className="px-6 pb-4 text-sm text-[#8b89a0] leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 md:p-8 mb-16">
          <h3 className="text-xl font-bold mb-4">Rate Limit Troubleshooting</h3>
          <p className="text-sm text-[#8b89a0] mb-6">Getting 429 errors? Here&apos;s how to handle rate limits gracefully.</p>
          <div className="code-block">
            <div className="code-header">
              <div className="dots"><span /><span /><span /></div>
              <span>javascript</span>
            </div>
            <pre><code>{`async function fetchWithRetry(url, maxRetries = 3) {
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
}`}</code></pre>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/5 to-[#06b6d4]/5" />
          <div className="relative">
            <h3 className="text-2xl font-bold mb-3">Still Need Help?</h3>
            <p className="text-sm text-[#8b89a0] max-w-md mx-auto mb-6">
              Open an issue on GitHub and we&apos;ll get back to you as soon as possible.
              For urgent matters, check if the API is <a href="/api/v1/health" target="_blank" className="text-[#a78bfa] hover:underline">healthy</a>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn-primary text-sm inline-flex items-center gap-1.5">
                Open GitHub Issue <IconExternalLink size={14} />
              </a>
              <a href="/docs" className="btn-ghost text-sm">Read the Docs</a>
            </div>
          </div>
        </div>

        <div className="h-16" />
      </div>
    </main>
  );
}
