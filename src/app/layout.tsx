import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'AI Digital Wealth Masterclass — MountMove Global',
  description:
    'Register for the 12-week AI Digital Wealth Masterclass. Earn, create, and lead with AI tools. Physical and virtual cohorts available.',
  keywords: ['AI training', 'digital skills', 'MountMove Global', 'Nigeria', 'AI masterclass'],
  openGraph: {
    title: 'AI Digital Wealth Masterclass — Register Now',
    description: 'Surviving, Earning & Leading in the Age of AI. 12 weeks. Every Saturday.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
