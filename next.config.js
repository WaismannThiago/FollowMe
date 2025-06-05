const path = require('path')
const paths = require('./paths')

const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...paths
    }
    return config
  }
}

module.exports = nextConfig
