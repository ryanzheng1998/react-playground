/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

module.exports = {
  reactStrictMode: true,
  i18n,
  async rewrites() {
    return [
      {
        source: '/proxy/:path*',
        destination: 'http://10.41.241.230/:path*',
      },
    ]
  },
}
