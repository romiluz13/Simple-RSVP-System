/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  experimental: {
    optimizePackageImports: ['@auth0/nextjs-auth0']
  }
};

module.exports = nextConfig; 