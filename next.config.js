/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable body parsing for Stripe webhook (raw body needed for signature verification)
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  async headers() {
    return [
      {
        source: '/api/webhooks/:path*',
        headers: [{ key: 'Content-Type', value: 'application/json' }],
      },
    ];
  },
};

module.exports = nextConfig;
