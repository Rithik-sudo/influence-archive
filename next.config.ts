import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Local media is served through our own route handler (src/app/media/...).
    dangerouslyAllowSVG: false,
  },
  experimental: {
    // Keep server actions small; they are used for every admin mutation.
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // The local database is a single writer, so the build's static-generation
    // workers must not all reach it at once. Production runs against a normal
    // PostgreSQL, where this does not apply.
    cpus: 1,
  },
  async headers() {
    return [
      {
        source: '/media/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
