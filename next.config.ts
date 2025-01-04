import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com',
        port: '',
        pathname: '/images/**',
        search: '',
      },
    ],
    domains: ['books.google.com'],
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/bookshelf',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
