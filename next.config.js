/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'export', // This makes Next.js generate static HTML for Vercel
    images: {
      unoptimized: true, // Fix for static site deployments
    },
  };
  
  module.exports = nextConfig;