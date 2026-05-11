'use client';

import { useState, useEffect } from 'react';
import { hasPremiumAccess, verifyAccessCode, getRemainingTime, getCurrentPlan } from '@/lib/payment';
import { SUBSCRIPTION_PLANS, formatPrice, perDayCost, type SubscriptionPlan } from '@/lib/pricing';
import { IconLock, IconShieldCheck, IconWallet, IconCreditCard, IconCrown, IconX, IconCheck, IconCopy, IconStar, IconClock, IconArrowRight } from '@/components/icons';

const UPI_ID = 'shinigami86@ybl';
const BTC_ADDRESS = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
const ETH_ADDRESS = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
const USDT_TRC20 = 'TN2YbEJgnMSVh7VUD8AdKoMaA7s2poFNpb';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="shrink-0 p-2 rounded-lg transition-all hover:bg-[#2a2a36]"
      title="Copy"
    >
      {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
    </button>
  );
}

/* ── Plan Selector ── */
function PlanSelector({ selected, onSelect, currency }: {
  selected: string;
  onSelect: (id: string) => void;
  currency: 'INR' | 'USD';
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {SUBSCRIPTION_PLANS.map((plan) => {
        const isActive = selected === plan.id;
        return (
          <button
            key={plan.id}
            onClick={() => onSelect(plan.id)}
            className={`relative text-left rounded-xl border-2 p-4 transition-all ${
              isActive
                ? 'bg-[#ef4444]/10 border-[#ef4444] shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                : 'bg-[#0f0f17] border-[#2a2a36] hover:border-[#3a3a46]'
            }`}
          >
            {plan.badge && (
              <span className={`absolute -top-2.5 right-3 px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider rounded ${
                plan.popular
                  ? 'bg-[#fbbf24] text-[#0f172a]'
                  : 'bg-[#ef4444] text-white'
              }`}>
                {plan.badge}
              </span>
            )}
            <div className={`text-[0.6rem] font-semibold uppercase tracking-widest mb-1 ${isActive ? 'text-[#ef4444]' : 'text-[#52525b]'}`}>
              {plan.durationLabel}
            </div>
            <div className={`font-display text-xl mb-0.5 ${isActive ? 'text-[#e4e4e7]' : 'text-[#a1a1aa]'}`} style={{ textTransform: 'none' }}>
              {formatPrice(plan, currency)}
            </div>
            <div className="text-[0.6rem] text-[#52525b]">{perDayCost(plan, currency)}</div>
            <div className={`text-xs mt-2 ${isActive ? 'text-[#a1a1aa]' : 'text-[#71717a]'}`}>
              {plan.name}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ── Access Code Input ── */
function AccessCodeInput({ planId, onSuccess }: { planId: string; onSuccess: () => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 3) return;
    setLoading(true);
    setError('');

    const result = await verifyAccessCode(code, planId);
    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || 'Invalid access code.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        value={code}
        onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
        placeholder="Enter your access code"
        className="w-full bg-[#0f0f17] border-2 border-[#2a2a36] rounded-lg px-4 py-3.5 text-sm text-[#e4e4e7] placeholder:text-[#52525b] focus:outline-none focus:border-[#ef4444] transition-colors font-mono tracking-wider uppercase"
        autoComplete="off"
      />
      {error && (
        <p className="text-xs text-[#ef4444] flex items-center gap-1.5">
          <IconX size={12} /> {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading || code.length < 3}
        className="w-full py-3.5 bg-[#ef4444] border-2 border-[#e4e4e7] text-white font-display font-bold text-sm uppercase tracking-widest shadow-[4px_4px_0_0_#e4e4e7] hover:bg-[#dc2626] hover:shadow-[2px_2px_0_0_#e4e4e7] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            VERIFYING...
          </span>
        ) : (
          'UNLOCK ACCESS'
        )}
      </button>
    </form>
  );
}

/* ── Main Payment Gate ── */
export default function PaymentGate({ children }: { children: React.ReactNode }) {
  const [hasAccess, setHasAccess] = useState(false);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<'upi' | 'crypto' | 'code'>('code');
  const [selectedPlan, setSelectedPlan] = useState('weekly');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [remainingTime, setRemainingTime] = useState('');

  useEffect(() => {
    const access = hasPremiumAccess();
    setHasAccess(access);
    if (access) setRemainingTime(getRemainingTime());
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a10' }}>
        <div className="w-7 h-7 border-2 border-[#2a2a36] border-t-[#ef4444] rounded-full animate-spin" />
      </main>
    );
  }

  if (hasAccess) {
    return (
      <div className="relative">
        {/* Access info bar */}
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-[#12121a] border border-[#2a2a36] rounded-lg text-xs text-[#71717a] shadow-lg">
          <IconCrown size={12} />
          <span className="font-semibold text-[#fbbf24] uppercase tracking-wider" style={{ fontSize: '0.6rem' }}>
            {getCurrentPlan() ? `${getCurrentPlan()} plan` : 'Premium'}
          </span>
          {remainingTime && (
            <>
              <span className="text-[#3f3f46]">·</span>
              <span className="flex items-center gap-1"><IconClock size={10} /> {remainingTime}</span>
            </>
          )}
        </div>
        {children}
      </div>
    );
  }

  const selectedPlanData = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan)!;

  return (
    <main className="min-h-screen" style={{ background: '#0a0a10' }}>
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* Nav */}
      <nav className="sticky top-0 z-50" style={{ background: 'rgba(10,10,16,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #2a2a36' }}>
        <div className="max-w-container mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center font-black text-sm bg-[#fbbf24] text-[#0f172a] border-2 border-[#e4e4e7] shadow-brutal-sm">Ω</div>
            <span className="font-display text-lg text-[#e4e4e7]" style={{ textTransform: 'none' }}>OMEGAAPI</span>
          </a>
          <div className="flex items-center gap-3">
            {/* Currency Toggle */}
            <div className="flex items-center border border-[#2a2a36] rounded-lg overflow-hidden">
              {(['INR', 'USD'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-wider transition-colors ${
                    currency === c ? 'bg-[#ef4444] text-white' : 'bg-[#12121a] text-[#71717a] hover:text-[#a1a1aa]'
                  }`}
                >
                  {c === 'INR' ? '₹ INR' : '$ USD'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="relative max-w-5xl mx-auto px-5 md:px-8 py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-5 w-16 h-16 flex items-center justify-center border-2 border-[#fbbf24] rounded-full" style={{ background: 'rgba(251,191,36,0.08)' }}>
            <IconCrown size={32} />
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-[#e4e4e7] mb-2" style={{ textTransform: 'none' }}>Unlock Premium Browse</h1>
          <p className="text-sm text-[#71717a] max-w-md mx-auto">
            Choose a plan, pay via UPI or Crypto, and get instant access to browse manga &amp; manhwa.
          </p>
        </div>

        {/* Plan Selector */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[#71717a]">Choose Your Plan</h2>
          </div>
          <PlanSelector selected={selectedPlan} onSelect={setSelectedPlan} currency={currency} />
        </div>

        {/* Selected Plan Summary */}
        <div className="card-brutal mb-6" style={{ background: '#12121a', borderColor: '#ef4444', borderWidth: '2px' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-[#ef4444]/10 text-[#ef4444] border-2 border-[#ef4444] rounded-xl">
                <IconCrown size={22} />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#e4e4e7]">{selectedPlanData.name} — {selectedPlanData.durationLabel}</div>
                <div className="text-xs text-[#71717a]">{selectedPlanData.description}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-2xl text-[#ef4444]">{formatPrice(selectedPlanData, currency)}</div>
              <div className="text-[0.6rem] text-[#52525b]">{perDayCost(selectedPlanData, currency)}</div>
            </div>
          </div>
        </div>

        {/* What's Included */}
        <div className="card-brutal mb-6" style={{ background: '#12121a', borderColor: '#2a2a36' }}>
          <h3 className="text-[0.65rem] font-semibold uppercase tracking-widest text-[#52525b] mb-3 flex items-center gap-2">
            <IconStar size={12} /> Included in all plans
          </h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              'Browse all manga & manhwa series',
              'Read chapters with image viewer',
              'Search across 263+ series',
              'Genre-based filtering',
              'Reading history & bookmarks',
              'Series detail with full metadata',
              'Continue reading across sessions',
              'Ad-free experience',
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-xs text-[#a1a1aa]">
                <IconShieldCheck size={12} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method Tabs */}
        <div className="flex gap-2 mb-5">
          {([
            { key: 'code', label: 'Enter Code', icon: <IconLock size={14} /> },
            { key: 'upi', label: 'Pay via UPI', icon: <IconCreditCard size={14} /> },
            { key: 'crypto', label: 'Pay via Crypto', icon: <IconWallet size={14} /> },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg border-2 transition-all ${
                activeTab === tab.key
                  ? 'bg-[#ef4444] text-white border-[#e4e4e7] shadow-[3px_3px_0_0_#e4e4e7]'
                  : 'bg-[#12121a] text-[#71717a] border-[#2a2a36] hover:text-[#a1a1aa] hover:border-[#3a3a46]'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Access Code Tab */}
        {activeTab === 'code' && (
          <div className="card-brutal" style={{ background: '#12121a', borderColor: '#2a2a36' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 flex items-center justify-center bg-[#22c55e]/10 text-[#22c55e] border-2 border-[#22c55e] rounded-lg">
                <IconLock size={18} />
              </div>
              <div>
                <h3 className="font-display text-base text-[#e4e4e7]" style={{ textTransform: 'none' }}>Enter Access Code</h3>
                <p className="text-xs text-[#71717a]">Already purchased? Enter your code below</p>
              </div>
            </div>
            <AccessCodeInput planId={selectedPlan} onSuccess={() => {
              setHasAccess(true);
              setRemainingTime(getRemainingTime());
            }} />
            <div className="mt-4 bg-[#0f0f17] border border-[#2a2a36] rounded-lg p-4">
              <p className="text-xs text-[#71717a] leading-relaxed">
                Don&apos;t have a code? Pay via{' '}
                <button onClick={() => setActiveTab('upi')} className="text-[#8b5cf6] hover:underline font-semibold">UPI</button>{' '}
                or{' '}
                <button onClick={() => setActiveTab('crypto')} className="text-[#f59e0b] hover:underline font-semibold">Crypto</button>{' '}
                and share the payment proof on{' '}
                <a href="https://t.me/Shineii86" target="_blank" rel="noopener noreferrer" className="text-[#ef4444] hover:underline font-semibold">Telegram</a>{' '}
                to receive your code.
              </p>
            </div>
          </div>
        )}

        {/* UPI Tab */}
        {activeTab === 'upi' && (
          <div className="card-brutal" style={{ background: '#12121a', borderColor: '#2a2a36' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 flex items-center justify-center bg-[#8b5cf6]/10 text-[#8b5cf6] border-2 border-[#8b5cf6] rounded-lg">
                <IconCreditCard size={18} />
              </div>
              <div>
                <h3 className="font-display text-base text-[#e4e4e7]" style={{ textTransform: 'none' }}>UPI Payment</h3>
                <p className="text-xs text-[#71717a]">Pay {formatPrice(selectedPlanData, 'INR')} for {selectedPlanData.durationLabel} access</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#0f0f17] border border-[#2a2a36] rounded-lg p-4">
                <div className="text-[0.6rem] text-[#52525b] uppercase tracking-wider mb-1.5">UPI ID</div>
                <div className="flex items-center justify-between">
                  <code className="text-lg font-mono text-[#fbbf24] font-bold tracking-wider">{UPI_ID}</code>
                  <CopyButton text={UPI_ID} />
                </div>
              </div>

              <div className="bg-[#0f0f17] border border-[#2a2a36] rounded-lg p-4">
                <div className="text-[0.6rem] text-[#52525b] uppercase tracking-wider mb-2">Steps</div>
                <ol className="space-y-2.5 text-sm text-[#a1a1aa]">
                  {[
                    `Send ${formatPrice(selectedPlanData, 'INR')} to UPI ID above`,
                    'Take a screenshot of payment confirmation',
                    <>Send screenshot + plan name (<strong className="text-[#e4e4e7]">{selectedPlanData.name}</strong>) on <a href="https://t.me/Shineii86" target="_blank" rel="noopener noreferrer" className="text-[#ef4444] hover:underline font-semibold">Telegram</a></>,
                    'Receive your access code within minutes',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-[#8b5cf6]/10 text-[#8b5cf6] text-[0.6rem] font-bold">{i + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-[#fbbf24]/5 border border-[#fbbf24]/20 rounded-lg p-4 flex items-start gap-3">
                <IconShieldCheck size={16} />
                <div>
                  <div className="text-xs font-semibold text-[#fbbf24] uppercase tracking-wider mb-0.5">Instant Delivery</div>
                  <p className="text-xs text-[#a1a1aa]">Codes are usually sent within 5–15 minutes of payment confirmation.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Crypto Tab */}
        {activeTab === 'crypto' && (
          <div className="card-brutal" style={{ background: '#12121a', borderColor: '#2a2a36' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 flex items-center justify-center bg-[#f59e0b]/10 text-[#f59e0b] border-2 border-[#f59e0b] rounded-lg">
                <IconWallet size={18} />
              </div>
              <div>
                <h3 className="font-display text-base text-[#e4e4e7]" style={{ textTransform: 'none' }}>Cryptocurrency</h3>
                <p className="text-xs text-[#71717a]">Pay {formatPrice(selectedPlanData, 'USD')} equivalent for {selectedPlanData.durationLabel}</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { symbol: '₿', name: 'Bitcoin (BTC)', address: BTC_ADDRESS, color: '#f7931a' },
                { symbol: 'Ξ', name: 'Ethereum (ETH)', address: ETH_ADDRESS, color: '#627eea' },
                { symbol: '₮', name: 'USDT (TRC-20)', address: USDT_TRC20, color: '#26a17b' },
              ].map((wallet) => (
                <div key={wallet.name} className="bg-[#0f0f17] border border-[#2a2a36] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-sm" style={{ color: wallet.color }}>{wallet.symbol}</span>
                    <span className="text-[0.6rem] text-[#52525b] uppercase tracking-wider">{wallet.name}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-xs font-mono text-[#a1a1aa] break-all leading-relaxed">{wallet.address}</code>
                    <CopyButton text={wallet.address} />
                  </div>
                </div>
              ))}

              <div className="bg-[#0f0f17] border border-[#2a2a36] rounded-lg p-4">
                <div className="text-[0.6rem] text-[#52525b] uppercase tracking-wider mb-2">After Payment</div>
                <ol className="space-y-2.5 text-sm text-[#a1a1aa]">
                  {[
                    'Copy the transaction hash (TXID)',
                    <>Send TXID + plan name (<strong className="text-[#e4e4e7]">{selectedPlanData.name}</strong>) on <a href="https://t.me/Shineii86" target="_blank" rel="noopener noreferrer" className="text-[#ef4444] hover:underline font-semibold">Telegram</a></>,
                    'Receive your code after on-chain confirmation',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-[#f59e0b]/10 text-[#f59e0b] text-[0.6rem] font-bold">{i + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-[#f59e0b]/5 border border-[#f59e0b]/20 rounded-lg p-4 flex items-start gap-3">
                <IconShieldCheck size={16} />
                <div>
                  <div className="text-xs font-semibold text-[#f59e0b] uppercase tracking-wider mb-0.5">Confirmation Times</div>
                  <p className="text-xs text-[#a1a1aa]">USDT (TRC-20) is near-instant. BTC/ETH may take 10–30 min for confirmations.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer note */}
        <div className="text-center mt-8 space-y-1">
          <p className="text-[0.6rem] text-[#3f3f46] uppercase tracking-widest">
            One code per device · Instant activation · Secure payment
          </p>
          <p className="text-[0.55rem] text-[#2a2a36]">
            Codes are bound to your device for security. Contact support if you switch devices.
          </p>
        </div>
      </div>
    </main>
  );
}
