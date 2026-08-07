module.exports = {
  apps: [
    {
      name: "backend",
      script: "dist/index.js",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
