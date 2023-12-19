/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://cs392-team-7-e01a3988ee9c.herokuapp.com/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig
