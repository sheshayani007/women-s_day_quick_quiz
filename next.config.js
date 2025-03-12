/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone', // This allows Next.js to generate a standalone server
    images: {
      unoptimized: true, // Fix for static site deployments
    },
  };
  
  module.exports = nextConfig;