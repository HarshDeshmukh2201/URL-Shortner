
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const apiUrl =
      process.env.API_URL || "http://localhost:9000";

    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl.replace(/\/+$/, "")}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
