/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Helps with Vercel deployment
  experimental: {
    appDir: true
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/debug',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;