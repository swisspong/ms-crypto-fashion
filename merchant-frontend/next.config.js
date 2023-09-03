/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images:{
    domains:["localhost","cdn.shopify.com","api.example.com"]
  },
  // assetPrefix: "http://localhost:5000",
}

module.exports = nextConfig
