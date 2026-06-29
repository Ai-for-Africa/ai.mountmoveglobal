import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendRegistrationConfirmation(opts: {
  to: string;
  fullName: string;
  referenceId: string;
  paymentMethod: 'stripe' | 'paystack' | 'bank_transfer';
}) {
  const { to, fullName, referenceId, paymentMethod } = opts;

  const paymentNote =
    paymentMethod === 'bank_transfer'
      ? `<p style="color:#f59e0b;font-weight:600">Your bank transfer receipt has been received. We will verify your payment and confirm your spot within a few hours. If you have not yet sent your receipt, please WhatsApp us on <a href="https://wa.me/${process.env.ADMIN_WHATSAPP}">${process.env.ADMIN_WHATSAPP}</a>.</p>`
      : `<p style="color:#34d399;font-weight:600">Your payment has been confirmed. Your spot is secured!</p>`;

  await transporter.sendMail({
    from: `"MountMove Global" <${process.env.SMTP_FROM}>`,
    to,
    subject: `Registration Confirmed — AI Digital Wealth Masterclass [${referenceId}]`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0d0820;color:#e2e0ed;padding:2rem;border-radius:12px">
        <h1 style="color:#a855f7;font-size:1.5rem;margin-bottom:0.5rem">You're registered!</h1>
        <p style="color:#c4b5fd">Hi ${fullName},</p>
        <p>Thank you for registering for the <strong>AI Digital Wealth Masterclass</strong> by MountMove Global.</p>
        ${paymentNote}
        <div style="background:#1a0f3c;border:1px solid #3b2472;border-radius:8px;padding:1rem;margin:1.5rem 0">
          <p style="margin:0;font-size:0.85rem;color:#9ca3af">Your Reference ID</p>
          <p style="margin:0.25rem 0 0;font-size:1.125rem;font-weight:700;font-family:monospace;color:#ffffff">${referenceId}</p>
        </div>
        <p style="font-size:0.875rem;color:#6b7280">Keep this reference ID safe. You may need it for any queries.</p>
        <hr style="border-color:#2d1b6b;margin:1.5rem 0"/>
        <p style="font-size:0.8rem;color:#6b7280">Questions? Email <a href="mailto:support@mountmove.org" style="color:#a855f7">support@mountmove.org</a></p>
      </div>
    `,
  });
}

export async function sendAdminNotification(opts: {
  fullName: string;
  email: string;
  referenceId: string;
  paymentMethod: string;
  receiptUrl?: string;
}) {
  const { fullName, email, referenceId, paymentMethod, receiptUrl } = opts;

  const receiptLine = receiptUrl
    ? `<p><strong>Receipt:</strong> <a href="${receiptUrl}">${receiptUrl}</a></p>`
    : '';

  await transporter.sendMail({
    from: `"MMG Registration System" <${process.env.SMTP_FROM}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Registration — ${fullName} [${referenceId}]`,
    html: `
      <div style="font-family:sans-serif;max-width:480px">
        <h2>New Registration</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Reference:</strong> ${referenceId}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        ${receiptLine}
      </div>
    `,
  });
}