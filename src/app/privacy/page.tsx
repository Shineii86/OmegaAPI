import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — OmegaAPI',
  description: 'Privacy Policy for OmegaAPI, a free manga and manhwa REST API.',
};

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-black tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-[var(--text-muted)] mb-12">Last updated: May 11, 2026</p>

        <div className="space-y-8 text-[var(--text-dim)] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">1. Information We Collect</h2>
            <p className="mb-3">
              OmegaAPI is a stateless API. We do not require accounts, registration, or personal information.
              However, the following data is automatically collected for operational purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>IP Addresses:</strong> Used solely for rate limiting (60 req/min). Stored in-memory and not persisted.</li>
              <li><strong>Request Metadata:</strong> HTTP method, path, status code, and response time for health monitoring.</li>
              <li><strong>User-Agent:</strong> Not collected or stored.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">2. How We Use Information</h2>
            <p className="mb-3">Collected data is used exclusively for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Enforcing rate limits to ensure fair usage</li>
              <li>Monitoring API health and performance</li>
              <li>Debugging and resolving technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">3. Data Storage & Retention</h2>
            <p>
              All operational data (rate limit counters, cache entries) is stored in-memory and
              is automatically purged. No data is written to disk, databases, or third-party analytics
              services. Rate limit entries expire after 60 seconds. Cache entries expire after 5–15 minutes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">4. Cookies & Tracking</h2>
            <p>
              OmegaAPI does not use cookies, tracking pixels, fingerprinting, or any form of
              user tracking. The landing page does not include analytics scripts (Google Analytics,
              Facebook Pixel, etc.).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">5. Third-Party Services</h2>
            <p className="mb-3">The API is hosted on Vercel. Vercel&apos;s own privacy policy applies to infrastructure-level data collection (CDN logs, etc.).</p>
            <p>
              The API fetches data from{' '}
              <a href="https://omegascans.org" className="text-[#a78bfa] hover:underline" target="_blank" rel="noopener noreferrer">
                OmegaScans
              </a>. No user data is transmitted to the upstream source.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">6. Children&apos;s Privacy</h2>
            <p>
              The Service is not directed at children under 13. We do not knowingly collect
              information from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">7. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be reflected on this
              page with an updated date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--text)] mb-3">8. Contact</h2>
            <p>
              For privacy-related questions, please open an issue on{' '}
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
