/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images:{
    domains:["localhost","cdn.shopify.com","api.example.com"]
  }, 
  env: {
    HOST_CUSTOMER: process.env.HOST_CUSTOMER,
  }
}

module.exports = nextConfig
