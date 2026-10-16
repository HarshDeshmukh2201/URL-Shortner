/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Local dev: http://localhost:9000 — on Vercel set API_URL to the backend deployment URL
    const apiUrl = process.env.API_URL || 'http://localhost:9000';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
