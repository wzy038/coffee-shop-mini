/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_BASE: 'http://localhost:5000/api'
  }
}

module.exports = nextConfig