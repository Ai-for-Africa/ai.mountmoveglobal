'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Mail, MessageCircle, Calendar, ArrowRight, Loader2 } from 'lucide-react';

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

function SuccessContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-mid)', display: 'flex', flexDirection: 'column' }}>
      <MMGNavBar />

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '4rem 1.5rem 5rem' }}>
        <div style={{ width: '100%', maxWidth: '560px' }}>

          {/* Success header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            {/* Glow behind check */}
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
              <div style={{ position: 'absolute', inset: '-12px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)' }} />
              <div style={{ width: '72px', height: '72px', background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <CheckCircle size={36} color="#34d399" />
              </div>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.875rem', borderRadius: '999px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', marginBottom: '1rem' }}>
              <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Registration Confirmed</span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff', marginBottom: '0.625rem', lineHeight: 1.1 }}>
              You're in the cohort!
            </h1>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Welcome to the AI Digital Wealth Masterclass. Your spot is secured and payment confirmed.
            </p>

            {ref && (
              <div style={{ display: 'inline-block', marginTop: '1.25rem', padding: '0.625rem 1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '0.5rem' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Reference: </span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--purple-bright)', fontFamily: 'monospace', letterSpacing: '0.05em' }}>{ref}</span>
              </div>
            )}
          </div>

          {/* What's next */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '0.875rem', padding: '1.75rem', marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>What happens next</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { icon: Mail,          title: 'Check your email',       desc: 'A confirmation with your reference and payment receipt has been sent.' },
                { icon: MessageCircle, title: 'WhatsApp group invite',  desc: "You'll be added to the cohort WhatsApp group within 24 hours." },
                { icon: Calendar,      title: 'Schedule & pre-work',    desc: 'Full schedule, materials, and pre-reading will be shared before session one.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--purple-pale)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} color="var(--purple-bright)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff', margin: '0 0 0.25rem', lineHeight: 1.3 }}>{title}</p>
                    <p style={{ fontSize: '0.8375rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save reminder */}
          {ref && (
            <div style={{ padding: '1rem 1.125rem', marginBottom: '1.5rem', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '0.5rem', fontSize: '0.8375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              💾 <strong style={{ color: '#ffffff' }}>Save this page or your email</strong> — your reference <strong style={{ color: 'var(--purple-bright)' }}>{ref}</strong> is your proof of registration.
            </div>
          )}

          <Link href="https://www.mountmoveglobal.com" target="_blank" rel="noopener" className="btn btn-ghost-dark" style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
            Visit MountMove Global <ArrowRight size={15} />
          </Link>
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

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 size={28} color="var(--purple)" style={{ animation: 'spin 1s linear infinite' }} /></div>}>
      <SuccessContent />
    </Suspense>
  );
}