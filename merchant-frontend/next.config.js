/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "cdn.shopify.com", "api.example.com"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  // env: {
  //   HOST_CUSTOMER: process.env.HOST_CUSTOMER,
  //   HOST_MERCHANT: process.env.HOST_MERCHANT,
  //   HOST_API: process.env.HOST_API,
  // },
  // env: {
  //   HOST_CUSTOMER: 'http://example.com'
  // }
  // assetPrefix: "http://localhost:5000",
};

module.exports = nextConfig;
