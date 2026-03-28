module.exports = {
  apps: [
    {
      name: "geofiber-api",
      cwd: "/root/projetos/geofiber/apps/api",
      script: "/root/.nvm/versions/node/v20.20.0/bin/pnpm",
      args: "run start",
      interpreter: "/root/.nvm/versions/node/v20.20.0/bin/node",
      env: {
        NODE_ENV: "production",
        PORT: "3000"
      }
    }
  ]
}
