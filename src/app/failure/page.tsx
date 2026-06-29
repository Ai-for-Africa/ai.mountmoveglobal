'use client';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { XCircle, RefreshCw, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';

const REASONS: Record<string, { title: string; desc: string }> = {
  payment_verification_failed: {
    title: 'Payment could not be verified',
    desc: 'Your payment could not be confirmed by our server. If funds were deducted from your account, please contact support with your reference before retrying.',
  },
  payment_not_found: {
    title: 'Payment record not found',
    desc: 'We could not locate a matching payment record. Please try registering again.',
  },
  missing_reference: {
    title: 'Missing payment reference',
    desc: 'No payment reference was provided. Please attempt payment again from the payment page.',
  },
  server_error: {
    title: 'Something went wrong on our end',
    desc: 'An unexpected server error occurred. Your payment may or may not have processed — please contact support before retrying.',
  },
};

function MMGNavBar() {
  return (
    <header style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border-dark)' }}>
      <div className="site-width" style={{ height: '64px', display: 'flex', alignItems: 'center' }}>
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
      </div>
    </header>
  );
}

function FailureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reason = searchParams.get('reason') || 'server_error';
  const ref = searchParams.get('ref');
  const info = REASONS[reason] || REASONS.server_error;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-mid)', display: 'flex', flexDirection: 'column' }}>
      <MMGNavBar />

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '4rem 1.5rem 5rem' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
              <div style={{ position: 'absolute', inset: '-12px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)' }} />
              <div style={{ width: '72px', height: '72px', background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.25)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <XCircle size={36} color="#f87171" />
              </div>
            </div>
            <h1 style={{ fontSize: 'clamp(1.625rem, 3vw, 2.125rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff', marginBottom: '0.375rem' }}>
              Payment Unsuccessful
            </h1>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
              Don't worry — your registration details are saved.
            </p>
          </div>

          {/* Error card */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '0.875rem', padding: '1.5rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: ref ? '1rem' : 0 }}>
              <AlertCircle size={17} color="#f87171" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff', margin: '0 0 0.25rem' }}>{info.title}</p>
                <p style={{ fontSize: '0.8375rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{info.desc}</p>
              </div>
            </div>
            {ref && (
              <>
                <div style={{ height: '1px', background: 'var(--border-dark)', margin: '1rem 0' }} />
                <div style={{ fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Reference: </span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--purple-bright)' }}>{ref}</span>
                </div>
              </>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button onClick={() => router.back()} className="btn btn-purple" style={{ width: '100%', justifyContent: 'center' }}>
              <RefreshCw size={15} /> Try Payment Again
            </button>
            <Link href="/register" className="btn btn-ghost-dark" style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
              <ArrowLeft size={15} /> Start a New Registration
            </Link>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Charged but landed here? Email{' '}
            <a href="mailto:support@mountmove.org" style={{ color: 'var(--purple-bright)', textDecoration: 'none' }}>support@mountmove.org</a>{' '}
            with your reference.
          </p>
        </div>
      </div>

      <footer style={{ background: 'var(--bg-base)', borderTop: '1px solid var(--border-dark)', padding: '1.5rem 0' }}>
        <div className="site-width" style={{ textAlign: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            © {new Date().getFullYear()} MountMove Global Ltd ·{' '}
            <a href="https://www.mountmoveglobal.com" target="_blank" rel="noopener" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>mountmoveglobal.com</a>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function FailurePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 size={28} color="var(--purple)" style={{ animation: 'spin 1s linear infinite' }} /></div>}>
      <FailureContent />
    </Suspense>
  );
}