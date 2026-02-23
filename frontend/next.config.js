/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow the frontend to proxy API requests in development if needed.
  // Production: set NEXT_PUBLIC_API_URL to your deployed API (e.g. Vercel serverless).
  reactStrictMode: true,
};

module.exports = nextConfig;
