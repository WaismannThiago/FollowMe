module.exports = {
  apps: [
    {
      name: 'followme-app',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/var/www/FollowMe-app',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
}
