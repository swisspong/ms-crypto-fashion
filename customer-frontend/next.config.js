/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images:{
    domains:["encrypted-tbn0.gstatic.com","localhost","cdn.shopify.com","api.example.com"]
  }
}

module.exports = nextConfig
