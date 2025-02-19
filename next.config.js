/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  images: {
    remotePatterns: [],
    unoptimized: true
  },
  experimental: {
    optimizeCss: true,
  },
  webpack: (config, { isServer }) => {
    // Add any custom webpack configurations here
    return config;
  },
};

module.exports = nextConfig; 