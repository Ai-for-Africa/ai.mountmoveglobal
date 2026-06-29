'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CreditCard, Banknote, Lock, AlertCircle, Loader2, ShieldCheck, Building2 } from 'lucide-react';

function MMGNavBar() {
  return (
    <header style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border-dark)' }}>
      <div className="site-width" style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <img src="https://www.mountmoveglobal.com/logo1.png" alt="MountMove Global" style={{ height: '24px', objectFit: 'contain' }}
            onError={(e) => { const img = e.currentTarget as HTMLImageElement; img.style.display = 'none'; const fb = img.nextElementSibling as HTMLElement; if (fb) fb.style.display = 'flex'; }} />
          <div style={{ display: 'none', width: '28px', height: '28px', background: 'var(--purple)', borderRadius: '6px', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: '10px' }}>M</span>
          </div>
          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.875rem', lineHeight: 1.1 }}>MountMove Global</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>AI Digital Wealth Masterclass</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
          <Lock size={13} /><span>Secure checkout</span>
        </div>
      </div>
    </header>
  );
}

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const registrationId = searchParams.get('id');
  const cancelled = searchParams.get('cancelled');
  const [loading, setLoading] = useState<'stripe' | 'paystack' | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (!registrationId) router.push('/register'); }, [registrationId, router]);

  const handlePayment = async (provider: 'stripe' | 'paystack') => {
    if (!registrationId) return;
    setLoading(provider); setError(null);
    try {
      const res = await fetch(`/api/payments/${provider}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to initialise payment.'); return; }
      window.location.href = data.url;
    } catch { setError('Network error. Please check your connection and try again.'); }
    finally { setLoading(null); }
  };

  const cardStyle = (disabled: boolean): React.CSSProperties => ({
    width: '100%', textAlign: 'left', padding: '1.25rem 1.375rem',
    background: 'var(--bg-card)', border: '1.5px solid var(--border-card)',
    borderRadius: '0.75rem', cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '1rem',
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-mid)', display: 'flex', flexDirection: 'column' }}>
      <MMGNavBar />

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '3rem 1.5rem 5rem' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>

          {/* Heading */}
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <span className="eyebrow" style={{ marginBottom: '0.625rem', display: 'block' }}>Final Step</span>
            <h1 style={{ fontSize: 'clamp(1.625rem, 3vw, 2.125rem)', fontWeight: 800, letterSpacing: '-0.025em', color: '#ffffff', marginBottom: '0.5rem' }}>
              Choose Payment Method
            </h1>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Your registration is saved — complete payment to confirm your spot.
            </p>
          </div>

          {/* Cancelled notice */}
          {cancelled && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem 1.125rem', marginBottom: '1.5rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '0.625rem' }}>
              <AlertCircle size={17} color="#f59e0b" style={{ flexShrink: 0, marginTop: '1px' }} />
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fbbf24', margin: '0 0 0.125rem' }}>Payment cancelled</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>No charges were made. Please try again to complete your registration.</p>
              </div>
            </div>
          )}

          {/* Order summary */}
          <div style={{ padding: '1.25rem 1.375rem', marginBottom: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '0.75rem' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.875rem' }}>Order Summary</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#ffffff', margin: '0 0 0.25rem' }}>AI Digital Wealth Masterclass</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>12-Week Cohort · MountMove Global</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--purple-bright)', margin: '0 0 0.125rem' }}>₦30,000</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>or $49 USD</p>
              </div>
            </div>
          </div>

          {/* Nigeria label */}
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.625rem' }}>
            🇳🇬 Pay from Nigeria
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>

            {/* Paystack */}
            <button onClick={() => handlePayment('paystack')} disabled={!!loading}
              style={{ ...cardStyle(!!loading), opacity: loading === 'stripe' ? 0.5 : 1 }}
              onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--purple)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px var(--purple-glow)'; } }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-card)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
            >
              <div style={{ width: '44px', height: '44px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Banknote size={22} color="#34d399" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ffffff' }}>Pay with Paystack</span>
                  <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>Recommended</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>Card · Bank Transfer · USSD · Mobile Money</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--purple-bright)' }}>₦30,000</div>
                {loading === 'paystack' && <Loader2 size={16} color="var(--purple-bright)" style={{ animation: 'spin 1s linear infinite', marginTop: '4px' }} />}
              </div>
            </button>

            {/* Bank Transfer */}
            <button onClick={() => router.push(`/payment/bank-transfer?id=${registrationId}`)} disabled={!!loading}
              style={cardStyle(!!loading)}
              onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--purple)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px var(--purple-glow)'; } }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-card)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
            >
              <div style={{ width: '44px', height: '44px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Building2 size={22} color="#fbbf24" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ffffff' }}>Direct Bank Transfer</span>
                  <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>Manual</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>Transfer ₦30,000 directly to our account</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#ffffff' }}>₦30,000</div>
              </div>
            </button>
          </div>

          {/* International label */}
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.625rem', marginTop: '0.5rem' }}>
            🌍 Pay Internationally
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <button onClick={() => handlePayment('stripe')} disabled={!!loading}
              style={{ ...cardStyle(!!loading), opacity: loading === 'paystack' ? 0.5 : 1 }}
              onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--purple)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px var(--purple-glow)'; } }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-card)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
            >
              <div style={{ width: '44px', height: '44px', background: 'var(--purple-pale)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CreditCard size={22} color="var(--purple-bright)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ffffff' }}>Pay with Stripe</span>
                  <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>International</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>Credit / Debit Card · Apple Pay · Google Pay</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--purple-bright)' }}>$49</div>
                {loading === 'stripe' && <Loader2 size={16} color="var(--purple-bright)" style={{ animation: 'spin 1s linear infinite', marginTop: '4px' }} />}
              </div>
            </button>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.875rem 1rem', marginBottom: '1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '0.5rem' }}>
              <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0, marginTop: '1px' }} />
              <p style={{ fontSize: '0.875rem', color: '#fca5a5', margin: 0 }}>{error}</p>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              <ShieldCheck size={14} color="var(--purple)" /><span>SSL encrypted</span>
            </div>
            <div style={{ width: '3px', height: '3px', background: 'var(--border-dark)', borderRadius: '50%' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>PCI DSS compliant</span>
            <div style={{ width: '3px', height: '3px', background: 'var(--border-dark)', borderRadius: '50%' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Powered by MountMove Global</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 size={28} color="var(--purple)" style={{ animation: 'spin 1s linear infinite' }} /></div>}>
      <PaymentPageContent />
    </Suspense>
  );
}