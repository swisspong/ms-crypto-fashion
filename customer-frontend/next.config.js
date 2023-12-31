/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "encrypted-tbn0.gstatic.com",
      "localhost",
      "cdn.shopify.com",
      "api.example.com",
    ],
  },
  // env: {
  //   HOST_CUSTOMER: 'http://example.com'
  // },

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
