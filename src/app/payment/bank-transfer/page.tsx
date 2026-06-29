'use client';
import { useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Copy, Check, MessageCircle, ArrowLeft, Loader2, Lock,
  AlertCircle, Upload, X, FileText, CheckCircle2, ImageIcon,
} from 'lucide-react';

// ── CONFIG — pull from env at build time ─────────────────────────────────────
const BANK_ACCOUNT = {
  bankName:      process.env.NEXT_PUBLIC_BANK_NAME      ?? 'Zenith Bank',
  accountName:   process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME  ?? 'MountMove Global Ltd',
  accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER ?? '0000000000',
  amount:        '₦30,000',
};
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? '2348000000000';
// ─────────────────────────────────────────────────────────────────────────────

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

function AccountRow({ label, value, onCopy, copied }: { label: string; value: string; onCopy: () => void; copied: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.125rem' }}>{label}</div>
        <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#ffffff' }}>{value}</div>
      </div>
      <button onClick={onCopy} style={{
        display: 'flex', alignItems: 'center', gap: '0.3rem',
        padding: '0.375rem 0.625rem', borderRadius: '0.25rem',
        border: '1px solid var(--border-card)', background: 'var(--bg-card-alt)',
        cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-secondary)', flexShrink: 0,
      }}>
        {copied ? <><Check size={12} color="#34d399" /> Copied</> : <><Copy size={12} /> Copy</>}
      </button>
    </div>
  );
}

type SubmitState = 'idle' | 'uploading' | 'success' | 'error';

function BankTransferContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const registrationId = searchParams.get('id');

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [narration, setNarration] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [whatsappOpened, setWhatsappOpened] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const el = document.createElement('textarea');
      el.value = text; document.body.appendChild(el); el.select();
      document.execCommand('copy'); document.body.removeChild(el);
    }
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setSubmitError('File too large. Please upload a file under 5 MB.');
      return;
    }
    setSubmitError(null);
    setReceiptFile(f);
  };

  const handleRemoveFile = () => {
    setReceiptFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmitReceipt = async () => {
    if (!registrationId) return;
    setSubmitState('uploading');
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append('registrationId', registrationId);
      if (receiptFile) formData.append('receipt', receiptFile);
      if (narration) formData.append('transferNarration', narration);

      const res = await fetch('/api/bank-transfer', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || 'Upload failed. Please try again.');
        setSubmitState('error');
        return;
      }

      setSubmitState('success');
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
      setSubmitState('error');
    }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello MountMove Global,\n\nI have just made a bank transfer of ${BANK_ACCOUNT.amount} for the AI Digital Wealth Masterclass.\n\nRegistration ID: ${registrationId || 'N/A'}\n\nPlease find my payment receipt attached. Kindly confirm my registration. Thank you!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    setWhatsappOpened(true);
  };

  const isFileImage = receiptFile && receiptFile.type.startsWith('image/');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-mid)', display: 'flex', flexDirection: 'column' }}>
      <MMGNavBar />

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '3rem 1.5rem 5rem' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>

          {submitState !== 'success' && (
            <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.75rem', padding: 0 }}>
              <ArrowLeft size={15} /> Back to payment options
            </button>
          )}

          {/* Success state */}
          {submitState === 'success' ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ width: '64px', height: '64px', background: 'rgba(52,211,153,0.12)', border: '2px solid #34d399', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <CheckCircle2 size={32} color="#34d399" />
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.625rem' }}>Receipt submitted!</h1>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.75rem', maxWidth: '400px', margin: '0 auto 1.75rem' }}>
                We've received your payment notification and will verify your transfer within a few hours. You'll receive a confirmation email once your registration is confirmed.
              </p>

              {/* WhatsApp follow-up option */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '0.875rem', padding: '1.25rem', marginBottom: '1.25rem', textAlign: 'left' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 0.875rem', lineHeight: 1.55 }}>
                  Want faster confirmation? Also send your receipt directly on WhatsApp:
                </p>
                <button onClick={openWhatsApp} style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem',
                  padding: '0.875rem 1.25rem', borderRadius: '0.625rem', border: 'none',
                  background: whatsappOpened ? '#16a34a' : '#25d366',
                  color: '#ffffff', fontSize: '0.9375rem', fontWeight: 700, cursor: 'pointer',
                }}>
                  {whatsappOpened
                    ? <><Check size={17} /> Opened — attach your receipt</>
                    : <><MessageCircle size={17} /> Send receipt via WhatsApp</>
                  }
                </button>
                {!whatsappOpened && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.625rem 0 0', textAlign: 'center' }}>
                    WhatsApp: +{WHATSAPP_NUMBER}
                  </p>
                )}
              </div>

              {registrationId && (
                <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.125rem' }}>Your Registration ID</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff', fontFamily: 'monospace' }}>{registrationId}</div>
                  </div>
                  <button onClick={() => copyToClipboard(registrationId, 'regid')} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.375rem 0.625rem', borderRadius: '0.25rem', border: '1px solid var(--border-card)', background: 'var(--bg-card-alt)', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {copiedField === 'regid' ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '2rem' }}>
                <span className="eyebrow" style={{ marginBottom: '0.5rem', display: 'block' }}>Bank Transfer</span>
                <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.025em', color: '#ffffff', marginBottom: '0.5rem' }}>
                  Transfer {BANK_ACCOUNT.amount} to confirm your spot
                </h1>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Transfer to the account below, then upload your receipt here or send it via WhatsApp.
                </p>
              </div>

              {/* Account card */}
              <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-card)', borderRadius: '0.875rem', overflow: 'hidden', marginBottom: '1.25rem' }}>
                <div style={{ background: 'linear-gradient(135deg, var(--purple) 0%, #5b21b6 100%)', padding: '1rem 1.375rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '0.25rem' }}>Account Details</div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)' }}>Transfer exactly this amount</div>
                  </div>
                  <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    {BANK_ACCOUNT.amount}
                  </div>
                </div>

                <div style={{ padding: '1.375rem', display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                  <AccountRow label="Bank" value={BANK_ACCOUNT.bankName} onCopy={() => copyToClipboard(BANK_ACCOUNT.bankName, 'bank')} copied={copiedField === 'bank'} />
                  <div style={{ height: '1px', background: 'var(--border-dark)' }} />
                  <AccountRow label="Account Name" value={BANK_ACCOUNT.accountName} onCopy={() => copyToClipboard(BANK_ACCOUNT.accountName, 'name')} copied={copiedField === 'name'} />
                  <div style={{ height: '1px', background: 'var(--border-dark)' }} />
                  {/* Account number highlighted */}
                  <div style={{ padding: '0.875rem 1rem', background: 'var(--bg-card-alt)', border: '1.5px solid var(--purple)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.125rem' }}>Account Number</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.08em', fontFamily: 'monospace' }}>
                        {BANK_ACCOUNT.accountNumber}
                      </div>
                    </div>
                    <button onClick={() => copyToClipboard(BANK_ACCOUNT.accountNumber, 'accnum')} style={{
                      display: 'flex', alignItems: 'center', gap: '0.375rem',
                      padding: '0.5rem 0.875rem', borderRadius: '0.375rem', border: 'none',
                      background: copiedField === 'accnum' ? 'rgba(52,211,153,0.15)' : 'var(--purple)',
                      color: copiedField === 'accnum' ? '#34d399' : '#ffffff',
                      cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600,
                    }}>
                      {copiedField === 'accnum' ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
                    </button>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem 1.125rem', marginBottom: '1.25rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '0.625rem' }}>
                <AlertCircle size={16} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fbbf24', margin: '0 0 0.25rem' }}>Use your name as the transfer narration</p>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
                    Bank transfers are verified manually. Upload your receipt below or send it on WhatsApp to complete your registration.
                  </p>
                </div>
              </div>

              {/* Registration ID */}
              {registrationId && (
                <div style={{ padding: '0.75rem 1rem', marginBottom: '1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.125rem' }}>Your Registration ID</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff', fontFamily: 'monospace' }}>{registrationId}</div>
                  </div>
                  <button onClick={() => copyToClipboard(registrationId, 'regid')} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.375rem 0.625rem', borderRadius: '0.25rem', border: '1px solid var(--border-card)', background: 'var(--bg-card-alt)', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {copiedField === 'regid' ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                  </button>
                </div>
              )}

              {/* ── RECEIPT UPLOAD ─────────────────────────────────────────── */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '0.875rem', padding: '1.375rem', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Upload Payment Receipt
                </div>

                {/* Narration field */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
                    Transfer narration / reference (optional)
                  </label>
                  <input
                    type="text"
                    value={narration}
                    onChange={e => setNarration(e.target.value)}
                    placeholder="e.g. your name or reference number on the transfer"
                    style={{
                      width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.375rem',
                      border: '1px solid var(--border-card)', background: 'var(--bg-card-alt)',
                      color: '#ffffff', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* File drop area */}
                {!receiptFile ? (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: '100%', padding: '1.5rem 1rem', border: '1.5px dashed var(--border-card)',
                      borderRadius: '0.625rem', background: 'var(--bg-card-alt)',
                      cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                      transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--purple)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-card)')}
                  >
                    <Upload size={22} color="var(--purple-bright)" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>Tap to upload receipt</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>JPG, PNG, WEBP, or PDF · max 5 MB</span>
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1rem', background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '0.5rem' }}>
                    <div style={{ width: '36px', height: '36px', background: 'var(--purple-pale)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {isFileImage ? <ImageIcon size={18} color="var(--purple-bright)" /> : <FileText size={18} color="var(--purple-bright)" />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{receiptFile.name}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{(receiptFile.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button onClick={handleRemoveFile} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem', flexShrink: 0 }}>
                      <X size={16} />
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />

                {submitError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', padding: '0.625rem 0.875rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '0.375rem' }}>
                    <AlertCircle size={14} color="#f87171" />
                    <p style={{ fontSize: '0.8125rem', color: '#fca5a5', margin: 0 }}>{submitError}</p>
                  </div>
                )}

                {/* Submit receipt button */}
                <button
                  onClick={handleSubmitReceipt}
                  disabled={submitState === 'uploading'}
                  style={{
                    width: '100%', marginTop: '1rem', padding: '0.875rem 1.25rem',
                    borderRadius: '0.625rem', border: 'none',
                    background: submitState === 'uploading' ? 'var(--purple)' : 'var(--purple)',
                    color: '#ffffff', fontSize: '0.9375rem', fontWeight: 700, cursor: submitState === 'uploading' ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    opacity: submitState === 'uploading' ? 0.7 : 1,
                  }}
                >
                  {submitState === 'uploading'
                    ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Submitting…</>
                    : <><Upload size={16} /> Submit Receipt & Notify Us</>
                  }
                </button>
              </div>

              {/* WhatsApp divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-dark)' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>or send directly on WhatsApp</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-dark)' }} />
              </div>

              {/* WhatsApp CTA */}
              <button onClick={openWhatsApp} style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem',
                padding: '1rem 1.5rem', borderRadius: '0.75rem', border: 'none',
                background: whatsappOpened ? '#16a34a' : '#25d366',
                color: '#ffffff', fontSize: '0.9375rem', fontWeight: 700, cursor: 'pointer',
                marginBottom: '1.25rem',
              }}>
                {whatsappOpened
                  ? <><Check size={17} /> WhatsApp opened — attach your receipt</>
                  : <><MessageCircle size={17} /> Message us on WhatsApp (+{WHATSAPP_NUMBER})</>
                }
              </button>

              {whatsappOpened && (
                <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  WhatsApp has opened. Please attach your transfer receipt screenshot in the chat.
                </p>
              )}

              <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Questions? Email{' '}
                <a href="mailto:support@mountmove.org" style={{ color: 'var(--purple-bright)', textDecoration: 'none' }}>support@mountmove.org</a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BankTransferPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 size={28} color="var(--purple)" style={{ animation: 'spin 1s linear infinite' }} /></div>}>
      <BankTransferContent />
    </Suspense>
  );
}