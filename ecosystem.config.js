module.exports = {
  apps: [{
    name: 'gymswipe-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/gymswipe',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
