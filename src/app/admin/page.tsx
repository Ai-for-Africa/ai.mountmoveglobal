'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Users, CheckCircle, Clock, DollarSign, Search, Download,
  RefreshCw, ChevronLeft, ChevronRight, Eye, LogOut, X,
  TrendingUp, Filter
} from 'lucide-react';

interface Registration {
  id: string;
  referenceId: string;
  fullName: string;
  email: string;
  phoneWhatsapp: string;
  cityState: string;
  attendanceMode: string;
  profileType: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
  payment: {
    provider: string;
    status: string;
    amount: number;
    currency: string;
    providerReference: string | null;
    verifiedAt: string | null;
  } | null;
}

interface Stats {
  total: number;
  completed: number;
  paymentPending: number;
  draft: number;
  revenue: { ngn: number; usd: number };
}

const REG_STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  COMPLETED:       { bg: '#d1fae5', color: '#065f46', label: 'Completed' },
  PAYMENT_PENDING: { bg: '#fef3c7', color: '#92400e', label: 'Pending payment' },
  DRAFT:           { bg: '#f1f5f9', color: '#475569', label: 'Draft' },
  CANCELLED:       { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
};

const PAY_STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  COMPLETED:  { bg: '#d1fae5', color: '#065f46' },
  PENDING:    { bg: '#fef3c7', color: '#92400e' },
  FAILED:     { bg: '#fee2e2', color: '#991b1b' },
  PROCESSING: { bg: '#dbeafe', color: '#1e40af' },
  CANCELLED:  { bg: '#f1f5f9', color: '#475569' },
};

function fmt(amount: number, currency: string) {
  return currency === 'NGN'
    ? `₦${(amount / 100).toLocaleString('en-NG')}`
    : `$${(amount / 100).toFixed(2)}`;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtDateTime(d: string) {
  return new Date(d).toLocaleString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const PROFILE_LABELS: Record<string, string> = {
  STUDENT_GRADUATE: 'Student / Graduate',
  EMPLOYED_PROFESSIONAL: 'Employed Professional',
  FREELANCER_CREATIVE: 'Freelancer / Creative',
  ENTREPRENEUR: 'Entrepreneur',
  JOB_SEEKER: 'Job Seeker',
  TEACHER_TRAINER: 'Teacher / Trainer',
  CONTENT_CREATOR: 'Content Creator',
  NGO_GOVERNMENT: 'NGO / Government',
  OTHER: 'Other',
};

export default function AdminDashboard() {
  const [adminToken, setAdminToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [stats, setStats] = useState<Stats | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

  const fetchStats = useCallback(async (token: string) => {
    const res = await fetch('/api/admin/stats', { headers: { 'x-admin-token': token } });
    if (res.ok) setStats(await res.json());
  }, []);

  const fetchRegistrations = useCallback(async (token: string, pg: number, q: string, status: string) => {
    setTableLoading(true);
    const params = new URLSearchParams({ page: String(pg), limit: '20' });
    if (q) params.set('search', q);
    if (status) params.set('status', status);
    const res = await fetch(`/api/registrations?${params}`, { headers: { 'x-admin-token': token } });
    if (res.ok) {
      const data = await res.json();
      setRegistrations(data.registrations);
      setTotal(data.total);
    }
    setTableLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    const res = await fetch('/api/admin/stats', { headers: { 'x-admin-token': adminToken } });
    if (res.ok) {
      const data = await res.json();
      setStats(data);
      setIsAuthenticated(true);
      fetchRegistrations(adminToken, 1, '', '');
    } else {
      setLoginError('Invalid admin token. Please try again.');
    }
    setLoggingIn(false);
  };

  useEffect(() => {
    if (isAuthenticated) fetchRegistrations(adminToken, page, search, statusFilter);
  }, [page, search, statusFilter, isAuthenticated, adminToken, fetchRegistrations]);

  const handleExport = () => {
    fetch('/api/admin/export', { headers: { 'x-admin-token': adminToken } })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mmg-registrations-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      });
  };

  /* ── LOGIN ──────────────────────────────────────────── */
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f1e3c', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{
              width: '48px', height: '48px', background: '#d4a843', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
            }}>
              <span style={{ color: '#0f1e3c', fontWeight: 800, fontSize: '14px' }}>MM</span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.375rem' }}>
              Admin Dashboard
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)' }}>MountMove Global · AI Masterclass</p>
          </div>

          <form onSubmit={handleLogin} style={{
            background: '#ffffff', borderRadius: '0.875rem', padding: '2rem',
          }}>
            <label className="field-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Admin Token</label>
            <input
              type="password"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              placeholder="Enter your admin token"
              className="field-input"
              required
              style={{ marginBottom: loginError ? '0.5rem' : '1.25rem' }}
            />
            {loginError && (
              <p style={{ fontSize: '0.8125rem', color: '#ef4444', marginBottom: '1rem' }}>{loginError}</p>
            )}
            <button type="submit" disabled={loggingIn} className="btn btn-navy" style={{ width: '100%', justifyContent: 'center' }}>
              {loggingIn ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(total / 20);

  /* ── DASHBOARD ──────────────────────────────────────── */
  return (
    <div style={{ minHeight: '100vh', background: '#f7f9fc' }}>

      {/* ── HEADER ──────────────────────────────────────── */}
      <header style={{
        background: '#0f1e3c', borderBottom: '1px solid rgba(255,255,255,0.07)',
        position: 'sticky', top: 0, zIndex: 40,
      }}>
        <div className="site-width" style={{
          height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          maxWidth: '1400px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: '32px', height: '32px', background: '#d4a843', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#0f1e3c', fontWeight: 800, fontSize: '11px' }}>MM</span>
            </div>
            <div>
              <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.9375rem' }}>Admin Dashboard</span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8125rem', marginLeft: '0.625rem' }}>AI Digital Wealth Masterclass</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => { fetchStats(adminToken); fetchRegistrations(adminToken, page, search, statusFilter); }}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '0.5rem', borderRadius: '6px', color: 'rgba(255,255,255,0.4)',
                display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
              title="Refresh data"
            >
              <RefreshCw size={15} />
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '0.5rem 0.75rem', borderRadius: '6px', color: 'rgba(255,255,255,0.4)',
                display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 2rem 4rem' }}>

        {/* ── STAT CARDS ──────────────────────────────────── */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem', marginBottom: '2rem',
          }}>
            {[
              {
                icon: Users, label: 'Total Registrations',
                value: stats.total, sub: 'All time',
                iconBg: '#e0e7ff', iconColor: '#4f46e5',
              },
              {
                icon: CheckCircle, label: 'Confirmed',
                value: stats.completed, sub: 'Payment verified',
                iconBg: '#d1fae5', iconColor: '#059669',
              },
              {
                icon: Clock, label: 'Pending Payment',
                value: stats.paymentPending, sub: 'Awaiting completion',
                iconBg: '#fef3c7', iconColor: '#d97706',
              },
              {
                icon: TrendingUp, label: 'Conversion Rate',
                value: stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}%` : '—',
                sub: 'Completed vs total',
                iconBg: '#f0fdf4', iconColor: '#16a34a',
              },
            ].map(({ icon: Icon, label, value, sub, iconBg, iconColor }) => (
              <div key={label} style={{
                background: '#ffffff', border: '1px solid #e8edf5',
                borderRadius: '0.875rem', padding: '1.5rem',
                display: 'flex', flexDirection: 'column', gap: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6b7280' }}>{label}</span>
                  <div style={{ width: '34px', height: '34px', background: iconBg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={17} color={iconColor} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f1e3c', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    {value}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#9ca3af', marginTop: '0.25rem' }}>{sub}</div>
                </div>
              </div>
            ))}

            {/* Revenue card — spans wider */}
            <div style={{
              background: '#0f1e3c', border: '1px solid transparent',
              borderRadius: '0.875rem', padding: '1.5rem',
              display: 'flex', flexDirection: 'column', gap: '1rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>Total Revenue</span>
                <div style={{ width: '34px', height: '34px', background: 'rgba(212,168,67,0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={17} color="#d4a843" />
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d4a843', letterSpacing: '-0.025em', lineHeight: 1 }}>
                  ₦{stats.revenue.ngn.toLocaleString('en-NG')}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.25rem' }}>
                  + ${stats.revenue.usd.toFixed(2)} USD
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TOOLBAR ─────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: '0.875rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
            <Search size={15} color="#9ca3af" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search name, email, or reference…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="field-input"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={14} color="#9ca3af" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="field-input"
              style={{ width: '185px' }}
            >
              <option value="">All statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="PAYMENT_PENDING">Payment Pending</option>
              <option value="DRAFT">Draft</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <button onClick={handleExport} className="btn btn-navy btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <Download size={15} /> Export CSV
          </button>
        </div>

        {/* ── TABLE ───────────────────────────────────────── */}
        <div style={{
          background: '#ffffff', border: '1px solid #e8edf5',
          borderRadius: '0.875rem', overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e8edf5' }}>
                  {['Reference', 'Name', 'Email', 'Location', 'Mode', 'Status', 'Payment', 'Amount', 'Date', ''].map((h) => (
                    <th key={h} style={{
                      padding: '0.875rem 1rem', textAlign: 'left',
                      fontSize: '0.75rem', fontWeight: 700, color: '#6b7280',
                      letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableLoading ? (
                  <tr>
                    <td colSpan={10} style={{ padding: '3.5rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem' }}>
                      <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 0.5rem', display: 'block' }} color="#d4a843" />
                      Loading registrations…
                    </td>
                  </tr>
                ) : registrations.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ padding: '3.5rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem' }}>
                      No registrations found
                    </td>
                  </tr>
                ) : (
                  registrations.map((reg, i) => {
                    const regStyle = REG_STATUS_STYLE[reg.status] || REG_STATUS_STYLE.DRAFT;
                    const payStyle = reg.payment ? PAY_STATUS_STYLE[reg.payment.status] : null;
                    return (
                      <tr key={reg.id} style={{
                        borderBottom: i < registrations.length - 1 ? '1px solid #f1f5f9' : 'none',
                        transition: 'background 0.12s',
                        cursor: 'default',
                      }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#fafbfd')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.8125rem', fontWeight: 700, color: '#0f1e3c' }}>
                            {reg.referenceId}
                          </span>
                        </td>
                        <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>
                          {reg.fullName}
                        </td>
                        <td style={{ padding: '0.875rem 1rem', color: '#6b7280', fontSize: '0.8125rem' }}>
                          {reg.email}
                        </td>
                        <td style={{ padding: '0.875rem 1rem', color: '#6b7280', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                          {reg.cityState}
                        </td>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <span style={{
                            padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
                            background: reg.attendanceMode === 'PHYSICAL' ? '#dbeafe' : '#f3e8ff',
                            color: reg.attendanceMode === 'PHYSICAL' ? '#1e40af' : '#6b21a8',
                          }}>
                            {reg.attendanceMode === 'PHYSICAL' ? 'In-person' : reg.attendanceMode === 'VIRTUAL' ? 'Virtual' : 'TBD'}
                          </span>
                        </td>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: regStyle.bg, color: regStyle.color }}>
                            {regStyle.label}
                          </span>
                        </td>
                        <td style={{ padding: '0.875rem 1rem' }}>
                          {payStyle ? (
                            <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: payStyle.bg, color: payStyle.color }}>
                              {reg.payment!.provider} · {reg.payment!.status}
                            </span>
                          ) : (
                            <span style={{ color: '#d1d5db', fontSize: '0.8125rem' }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap', fontWeight: 700, color: '#111827' }}>
                          {reg.payment ? fmt(reg.payment.amount, reg.payment.currency) : '—'}
                        </td>
                        <td style={{ padding: '0.875rem 1rem', color: '#9ca3af', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                          {fmtDate(reg.createdAt)}
                        </td>
                        <td style={{ padding: '0.875rem 0.75rem' }}>
                          <button
                            onClick={() => setSelectedReg(reg)}
                            style={{
                              background: 'transparent', border: 'none', cursor: 'pointer',
                              padding: '0.375rem', borderRadius: '6px', color: '#9ca3af',
                              display: 'flex', alignItems: 'center', transition: 'all 0.12s',
                            }}
                            onMouseEnter={e => { (e.currentTarget.style.background = '#f1f5f9'); (e.currentTarget.style.color = '#374151'); }}
                            onMouseLeave={e => { (e.currentTarget.style.background = 'transparent'); (e.currentTarget.style.color = '#9ca3af'); }}
                            title="View details"
                          >
                            <Eye size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > 20 && (
            <div style={{
              padding: '0.875rem 1.25rem', borderTop: '1px solid #f1f5f9',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>
                {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total} registrations
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  style={{
                    background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '6px',
                    padding: '0.375rem 0.5rem', cursor: page === 1 ? 'not-allowed' : 'pointer',
                    opacity: page === 1 ? 0.4 : 1, display: 'flex', alignItems: 'center',
                  }}
                >
                  <ChevronLeft size={15} color="#374151" />
                </button>
                <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: 600, minWidth: '60px', textAlign: 'center' }}>
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages}
                  style={{
                    background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '6px',
                    padding: '0.375rem 0.5rem', cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                    opacity: page >= totalPages ? 0.4 : 1, display: 'flex', alignItems: 'center',
                  }}
                >
                  <ChevronRight size={15} color="#374151" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── DETAIL MODAL ────────────────────────────────── */}
      {selectedReg && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15,30,60,0.55)',
            backdropFilter: 'blur(4px)', zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
          }}
          onClick={() => setSelectedReg(null)}
        >
          <div
            style={{
              background: '#ffffff', borderRadius: '1rem', width: '100%', maxWidth: '520px',
              maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{
              padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem',
            }}>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f1e3c', marginBottom: '0.25rem' }}>
                  {selectedReg.fullName}
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.8125rem', fontWeight: 600, color: '#d4a843' }}>
                  {selectedReg.referenceId}
                </div>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                style={{
                  background: '#f1f5f9', border: 'none', borderRadius: '6px',
                  padding: '0.375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0,
                }}
              >
                <X size={16} color="#6b7280" />
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: '1.5rem' }}>
              {/* Status badges */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {(() => {
                  const s = REG_STATUS_STYLE[selectedReg.status] || REG_STATUS_STYLE.DRAFT;
                  return (
                    <span style={{ padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.8125rem', fontWeight: 600, background: s.bg, color: s.color }}>
                      {s.label}
                    </span>
                  );
                })()}
                {selectedReg.payment && (() => {
                  const p = PAY_STATUS_STYLE[selectedReg.payment!.status] || PAY_STATUS_STYLE.PENDING;
                  return (
                    <span style={{ padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.8125rem', fontWeight: 600, background: p.bg, color: p.color }}>
                      {selectedReg.payment!.provider} · {selectedReg.payment!.status}
                    </span>
                  );
                })()}
              </div>

              {/* Detail rows */}
              {[
                { section: 'Contact', rows: [
                  ['Email', selectedReg.email],
                  ['WhatsApp', selectedReg.phoneWhatsapp],
                  ['Location', selectedReg.cityState],
                ]},
                { section: 'Registration', rows: [
                  ['Attendance', selectedReg.attendanceMode],
                  ['Profile', PROFILE_LABELS[selectedReg.profileType] || selectedReg.profileType],
                  ['Registered', fmtDateTime(selectedReg.createdAt)],
                  ['Completed', selectedReg.completedAt ? fmtDateTime(selectedReg.completedAt) : '—'],
                ]},
                ...(selectedReg.payment ? [{ section: 'Payment', rows: [
                  ['Provider', selectedReg.payment.provider],
                  ['Amount', fmt(selectedReg.payment.amount, selectedReg.payment.currency)],
                  ['Transaction Ref', selectedReg.payment.providerReference || '—'],
                  ['Verified At', selectedReg.payment.verifiedAt ? fmtDateTime(selectedReg.payment.verifiedAt) : '—'],
                ]}] : []),
              ].map(({ section, rows }) => (
                <div key={section} style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '0.75rem' }}>
                    {section}
                  </div>
                  <div style={{ background: '#f8fafc', borderRadius: '0.625rem', overflow: 'hidden' }}>
                    {rows.map(([label, value], i) => (
                      <div key={label} style={{
                        display: 'flex', gap: '1rem', padding: '0.75rem 1rem',
                        borderBottom: i < rows.length - 1 ? '1px solid #f1f5f9' : 'none',
                      }}>
                        <span style={{ width: '130px', flexShrink: 0, fontSize: '0.8125rem', color: '#9ca3af' }}>{label}</span>
                        <span style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 500, wordBreak: 'break-all' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Spin keyframe for inline loader */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
