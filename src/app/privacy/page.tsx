import type { Metadata } from 'next';
import { Navbar, Footer } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Privacy Policy — OmegaAPI',
  description: 'Privacy Policy for OmegaAPI, a free manga and manhwa REST API.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-5 md:px-8 py-16">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm mb-12" style={{ color: '#64748b' }}>Last updated: May 11, 2026</p>

        <div className="space-y-8 leading-relaxed" style={{ color: '#334155' }}>
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>1. Information We Collect</h2>
            <p className="mb-3">OmegaAPI is a stateless API. We do not require accounts, registration, or personal information. However, the following data is automatically collected for operational purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>IP Addresses:</strong> Used solely for rate limiting (60 req/min). Stored in-memory and not persisted.</li>
              <li><strong>Request Metadata:</strong> HTTP method, path, status code, and response time for health monitoring.</li>
              <li><strong>User-Agent:</strong> Not collected or stored.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>2. How We Use Information</h2>
            <p className="mb-3">Collected data is used exclusively for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Enforcing rate limits to ensure fair usage</li>
              <li>Monitoring API health and performance</li>
              <li>Debugging and resolving technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>3. Data Storage & Retention</h2>
            <p>All operational data (rate limit counters, cache entries) is stored in-memory and is automatically purged. No data is written to disk, databases, or third-party analytics services. Rate limit entries expire after 60 seconds. Cache entries expire after 5–15 minutes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>4. Cookies & Tracking</h2>
            <p>OmegaAPI does not use cookies, tracking pixels, fingerprinting, or any form of user tracking. The landing page does not include analytics scripts (Google Analytics, Facebook Pixel, etc.).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>5. Third-Party Services</h2>
            <p className="mb-3">The API is hosted on Vercel. Vercel&apos;s own privacy policy applies to infrastructure-level data collection (CDN logs, etc.).</p>
            <p>The API fetches data from <a href="https://omegascans.org" className="font-semibold hover:underline" style={{ color: '#f59e0b' }} target="_blank" rel="noopener noreferrer">OmegaScans</a>. No user data is transmitted to the upstream source.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>6. Children&apos;s Privacy</h2>
            <p>The Service is not directed at children under 13. We do not knowingly collect information from children.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>7. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be reflected on this page with an updated date.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>8. Contact</h2>
            <p>For privacy-related questions, please open an issue on <a href="https://github.com/Shineii86/OmegaAPI" className="font-semibold hover:underline" style={{ color: '#f59e0b' }} target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
