/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images:{
    domains:["localhost","cdn.shopify.com","api.example.com"]
  },
}

module.exports = nextConfig
