/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://url-shortner-zeta-eight.vercel.app/api/:path*',
          // destination: 'http://localhost:9000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
