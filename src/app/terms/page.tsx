import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — OmegaAPI',
  description: 'Terms of Service for OmegaAPI, a free manga and manhwa REST API.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <nav className="glass sticky top-0 z-50 border-b border-[var(--border)]/40">
        <div className="max-w-4xl mx-auto px-5 md:px-8 h-16 flex items-center">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center text-white font-black text-sm">
              Ω
            </div>
            <span className="font-bold text-lg tracking-tight">OmegaAPI</span>
          </a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-5 md:px-8 py-16">
        <h1 className="text-4xl font-black tracking-tight mb-2">Terms of Service</h1>
        <p className="text-sm text-[var(--text-muted)] mb-12">Last updated: May 11, 2026</p>

        <div className="space-y-8 text-[var(--text-dim)] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using OmegaAPI (&quot;the API&quot;, &quot;the Service&quot;), you agree to be bound by these
              Terms of Service. If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">2. Description of Service</h2>
            <p>
              OmegaAPI is a free, public REST API that provides manga and manhwa metadata sourced from{' '}
              <a href="https://omegascans.org" className="text-[#a78bfa] hover:underline" target="_blank" rel="noopener noreferrer">
                OmegaScans
              </a>. The API acts as a middleware layer, normalizing and caching publicly available data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">3. No Affiliation</h2>
            <p>
              OmegaAPI is not affiliated with, endorsed by, or connected to OmegaScans in any way.
              All content rights belong to their respective owners. OmegaAPI does not host, store,
              or distribute any manga or manhwa content — it only proxies metadata and image URLs
              from the upstream source.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">4. Acceptable Use</h2>
            <p className="mb-3">You agree NOT to use the Service to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Attempt to overwhelm, disrupt, or abuse the API (DDoS, scraping at excessive rates)</li>
              <li>Resell or redistribute the API as a paid service without permission</li>
              <li>Remove or obscure any attribution or copyright notices</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">5. Rate Limiting</h2>
            <p>
              The API enforces a rate limit of 60 requests per minute per IP address. Exceeding this
              limit will result in HTTP 429 responses. Automated abuse may result in permanent IP bans.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">6. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
              EITHER EXPRESS OR IMPLIED. We do not guarantee uptime, accuracy, or availability.
              The API may be modified, suspended, or discontinued at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">7. Limitation of Liability</h2>
            <p>
              In no event shall OmegaAPI, its operators, or contributors be liable for any indirect,
              incidental, special, consequential, or punitive damages arising out of your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the Service
              after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">9. Contact</h2>
            <p>
              For questions about these Terms, please open an issue on{' '}
              <a href="https://github.com" className="text-[#a78bfa] hover:underline" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
