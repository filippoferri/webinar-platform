/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      turboMode: false, // Disable Turbopack (optional)
    },
  };
  
  export default nextConfig; // ✅ Fix: Use ES Module syntax
