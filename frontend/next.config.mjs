/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://url-shortner-pink-one.vercel.app',
          // destination: 'http://localhost:9000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
