/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["localhost", "cdn.shopify.com", "api.example.com"],
  },
  output: "standalone",
  // env: {
  //   HOST_CUSTOMER: process.env.HOST_CUSTOMER,
  // }
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
};

module.exports = nextConfig;
