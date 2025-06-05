const path = require('path');

module.exports = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      '@/utils': path.resolve(__dirname, 'utils'),
      '@/server': path.resolve(__dirname, 'server')
    }
    return config
  }
}
