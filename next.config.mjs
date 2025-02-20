/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Helps with Vercel deployment
  experimental: {
    // Any experimental features
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  }
};

export default nextConfig;