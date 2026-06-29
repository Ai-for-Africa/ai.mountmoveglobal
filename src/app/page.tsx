'use client';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Clock, MapPin, Wifi, Users, Zap, BookOpen, DollarSign, Star } from 'lucide-react';

const outcomes = [
  { icon: DollarSign, label: 'Earn with AI',    desc: 'Build real income streams using the most powerful AI tools available today.' },
  { icon: Zap,        label: 'Build faster',    desc: 'Create websites, content, music, and products in hours, not weeks.' },
  { icon: BookOpen,   label: 'Teach & consult', desc: 'Become the go-to AI expert in your organisation or community.' },
  { icon: Users,      label: 'Join a cohort',   desc: 'Learn alongside driven peers across Nigeria — online and in person.' },
];

const topics = [
  'AI-powered writing & content creation',
  'AI image and graphic design',
  'AI video creation and editing',
  'AI music and audio production',
  'Building websites & apps with AI',
  'Selling digital products using AI',
  'Automating your business workflows',
  'Freelancing & consulting with AI',
  'Starting an AI-powered startup',
  'Teaching others about AI',
  'Earning on platforms: Upwork, Fiverr, Gumroad',
  'Prompting masterclass — elite results',
];

const tickerItems = [
  'Flutter Apps', 'AI Writing', 'Image Generation', 'Video Editing',
  'Web Development', 'Digital Products', 'AI Automation', 'Freelancing',
  'Content Creation', 'Music Production', 'Startup Strategy', 'AI Consulting',
];

function MMGLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
      <img
        src="https://www.mountmoveglobal.com/logo1.png"
        alt="MountMove Global"
        style={{ height: '26px', width: 'auto', objectFit: 'contain' }}
        onError={(e) => {
          const img = e.currentTarget as HTMLImageElement;
          img.style.display = 'none';
          const fb = img.nextElementSibling as HTMLElement;
          if (fb) fb.style.display = 'flex';
        }}
      />
      <div style={{
        display: 'none', width: '30px', height: '30px',
        background: 'var(--purple)', borderRadius: '7px',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <span style={{ color: '#fff', fontWeight: 900, fontSize: '11px' }}>M</span>
      </div>
      <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '-0.01em' }}>
        MountMove Global
      </span>
    </div>
  );
}

export default function HomePage() {
  return (
    <div style={{ background: 'var(--bg-mid)', color: 'var(--text-primary)' }}>

      {/* NAV */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(13,8,32,0.96)', backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div className="site-width" style={{ height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <MMGLogo />
          <Link href="/register" className="btn btn-purple btn-sm">
            Register Now <ArrowRight size={15} />
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(160deg, #0d0820 0%, #120b2e 40%, #1a1033 100%)',
        padding: '2rem 0 4rem', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-10px', right: '-100px',
          width: '560px', height: '560px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 65%)',
          pointerEvents: 'none', animation: 'float-glow 6s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '5%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px', pointerEvents: 'none',
        }} />

        <div className="site-width" style={{ position: 'relative', zIndex: 1 }}>
         
          <div style={{ maxWidth: '95%' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.375rem 0.875rem', borderRadius: '999px',
              border: '1px solid rgba(124,58,237,0.35)',
              background: 'rgba(124,58,237,0.1)', marginBottom: '2rem',
            }}>
              {/* <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', animation: 'pulse-dot 2s infinite' }} /> */}
              <span style={{ color: 'var(--purple-bright)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Now Accepting Applications
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.625rem, 5.5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.06, letterSpacing: '-0.035em', color: '#ffffff', marginBottom: '1.25rem' }}>
              AI Digital Wealth{' '}
              <span style={{ color: '#c4b5fd', background: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 40%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Masterclass
              </span>
            </h1>

            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--text-secondary)', fontWeight: 400, marginBottom: '0.875rem' }}>
              Surviving, Earning &amp; Leading in the Age of AI
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: '560px', marginBottom: '3rem' }}>
              A 12-week hands-on programme for Nigerian professionals, creatives, and entrepreneurs —
              turning AI from a curiosity into a genuine income engine.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem', alignItems: 'center' }}>
              <Link href="/register" className="btn btn-purple" style={{ fontSize: '1rem', padding: '1rem 2.25rem' }}>
                Secure Your Spot <ArrowRight size={18} />
              </Link>
              <Link href="#curriculum" className="btn btn-ghost-dark btn-sm">View Curriculum</Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border-dark)', borderBottom: '1px solid var(--border-dark)' }}>
        <div className="site-width" style={{ padding: '2.25rem 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '2rem' }}>
            {[
              { value: '12',   label: 'Weeks of training' },
              { value: 'Days',  label: '9 AM – 1 PM sessions' },
              { value: 'Mode', label: 'Physical & virtual' },
              { value: '40+',  label: 'AI tools covered' },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(1.625rem, 3vw, 2.25rem)', fontWeight: 800, color: 'var(--purple-bright)', lineHeight: 1, letterSpacing: '-0.025em' }}>{value}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div style={{ background: 'var(--bg-base)', overflow: 'hidden', padding: '0.875rem 0', borderBottom: '1px solid var(--border-dark)' }}>
        <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'ticker 30s linear infinite' }}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 500, marginRight: '2.5rem' }}>
              {item} <span style={{ color: 'var(--purple)', marginLeft: '2.5rem' }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* OUTCOMES */}
      <section className="section-py" style={{ background: 'var(--bg-mid)' }}>
        <div className="site-width">
          <div style={{ maxWidth: '560px', marginBottom: '3.5rem' }}>
            <span className="eyebrow" style={{ marginBottom: '0.875rem', display: 'block' }}>What You'll Achieve</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.625rem)', fontWeight: 800, letterSpacing: '-0.025em', color: '#ffffff', lineHeight: 1.15 }}>
              12 weeks to transform how you work and earn
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {outcomes.map(({ icon: Icon, label, desc }) => (
              <div key={label} style={{ padding: '2rem', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '0.875rem', transition: 'all 0.2s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--purple)'; el.style.background = 'var(--bg-card-alt)'; el.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border-card)'; el.style.background = 'var(--bg-card)'; el.style.transform = 'none'; }}
              >
                <div style={{ width: '46px', height: '46px', background: 'var(--purple-pale)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Icon size={20} color="var(--purple-bright)" />
                </div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>{label}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CURRICULUM */}
      <section id="curriculum" className="section-py" style={{ background: 'var(--bg-section)' }}>
        <div className="site-width">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '4rem', alignItems: 'start' }}>
            <div>
              <span className="eyebrow" style={{ marginBottom: '0.875rem', display: 'block' }}>Programme Content</span>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.025em', color: '#ffffff', marginBottom: '1.25rem', lineHeight: 1.15 }}>
                Inside the curriculum
              </h2>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '2rem' }}>
                Every module is built around practical tools you can use to earn money immediately — not theory, not slides. Hands-on, output-driven sessions every Saturday.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { icon: Clock,  text: 'Every Saturday · 9 AM – 1 PM WAT' },
                  { icon: MapPin, text: '(physical) + live stream' },
                  { icon: Wifi,   text: 'All session recordings included' },
                  { icon: Star,   text: 'Open to all levels — total beginner welcome' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Icon size={16} color="var(--purple-bright)" />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
              {topics.map((topic) => (
                <div key={topic} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', background: 'var(--bg-card)', borderRadius: '0.5rem', border: '1px solid var(--border-card)' }}>
                  <CheckCircle size={16} color="var(--green)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ background: 'var(--bg-base)', padding: '5.5rem 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '600px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="site-width" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
            <span className="eyebrow" style={{ marginBottom: '1rem', display: 'block' }}>Investment</span>
            <h2 style={{ fontSize: 'clamp(1.875rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff', marginBottom: '1rem', lineHeight: 1.1 }}>
              One payment.{' '}
              <span style={{ color: '#c4b5fd', background: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 40%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                access
              </span>{' '}
              to the cohort.
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.75, marginBottom: '3rem' }}>
              Your spot is secured only after payment is confirmed. No recurring fees, no hidden costs. Recordings, materials, and community access included.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.75rem' }}>
              {[
                { amount: '₦30,000', label: 'Nigeria',       sub: 'Paystack · Bank Transfer', accent: true },
                { amount: '$49',     label: 'International', sub: 'Pay via Stripe',            accent: false },
              ].map(({ amount, label, sub, accent }) => (
                <div key={label} style={{ padding: '1.875rem', background: accent ? 'rgba(124,58,237,0.12)' : 'var(--bg-card)', border: accent ? '1.5px solid rgba(124,58,237,0.45)' : '1px solid var(--border-card)', borderRadius: '1rem' }}>
                  <div style={{ fontSize: 'clamp(1.875rem, 3vw, 2.5rem)', fontWeight: 800, color: accent ? 'var(--purple-bright)' : '#ffffff', letterSpacing: '-0.03em', lineHeight: 1 }}>{amount}</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#ffffff', marginTop: '0.5rem' }}>{label}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{sub}</div>
                </div>
              ))}
            </div>
            <Link href="/register" className="btn btn-purple" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
              Apply for This Cohort <ArrowRight size={18} />
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '1rem' }}>One-time payment · No hidden fees · Recordings included</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--bg-base)', borderTop: '1px solid var(--border-dark)', padding: '2.5rem 0' }}>
        <div className="site-width" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem' }}>
          <MMGLogo />
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a href="https://www.mountmoveglobal.com" target="_blank" rel="noopener" style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', textDecoration: 'none' }}>mountmoveglobal.com</a>
            <a href="mailto:support@mountmove.org" style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', textDecoration: 'none' }}>support@mountmove.org</a>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>© {new Date().getFullYear()} MountMove Global Ltd. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}