/** @type {import('next').NextConfig} */

// const dotenv = require("dotenv");
// const path = require("path");

// if (process.env.NODE_ENV !== "production") {
//   const configFile = path.resolve(
//     __dirname,

//     `./.env.${process.env.NODE_ENV.trim()}`
//   );

//   console.log(process.env.NODE_ENV.trim(), configFile);

//   // dotenv.config({ path: configFile });
//   dotenv.config({ path: `./.env.${process.env.NODE_ENV.trim()}`});
// } else {
//   dotenv.config();
// }

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
  env: {
    HOST_CUSTOMER: process.env.HOST_CUSTOMER,
    HOST_MERCHANT: process.env.HOST_MERCHANT,
    HOST_API: process.env.HOST_API,
  },
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
