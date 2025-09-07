module.exports = {
  apps: [
    {
      name: "infoaidtech-ssr",
      script: "dist/infoAidTech/server/server.mjs",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 4000,
      },
    },
  ],
};
