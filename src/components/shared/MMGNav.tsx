'use client';
import Link from 'next/link';

interface MMGNavProps {
  rightSlot?: React.ReactNode;
  subtitle?: string;
}

export function MMGNav({ rightSlot, subtitle }: MMGNavProps) {
  return (
    <header style={{
      background: '#000000',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div className="site-width" style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo + wordmark */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          {/* Try to load real logo, fallback to lettermark */}
          <img
            src="https://www.mountmoveglobal.com/logo1.png"
            alt="MountMove Global"
            style={{ height: '28px', width: 'auto', display: 'block', objectFit: 'contain' }}
            onError={(e) => {
              // Fallback lettermark if logo doesn't load
              const img = e.currentTarget;
              img.style.display = 'none';
              const fallback = img.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          {/* Lettermark fallback (hidden by default) */}
          <div style={{
            display: 'none',
            width: '32px', height: '32px',
            background: 'var(--gold)',
            borderRadius: '7px',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ color: '#000000', fontWeight: 900, fontSize: '11px', letterSpacing: '-0.03em' }}>MM</span>
          </div>
          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.875rem', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
              MountMove Global
            </div>
            {subtitle && (
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6875rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '1px' }}>
                {subtitle}
              </div>
            )}
          </div>
        </Link>

        {/* Right slot */}
        {rightSlot}
      </div>
    </header>
  );
}