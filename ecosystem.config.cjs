const fs = require('fs');
const path = require('path');

function loadEnvFiles(files) {
  const env = {};
  for (const f of files) {
    const p = path.resolve(__dirname, f);
    if (!fs.existsSync(p)) continue;

    const content = fs.readFileSync(p, 'utf8');
    for (const line of content.split('\n')) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      env[m[1]] = v;
    }
  }
  return env;
}

const apiEnv = loadEnvFiles(['apps/api/.env', 'apps/api/.env.local']);
const portalEnv = loadEnvFiles(['apps/portal/.env.local', 'apps/portal/.env']);

module.exports = {
  apps: [
    {
      name: 'geofiber-api',
      cwd: '/root/projetos/geofiber/apps/api',
      script: 'node',
      args: 'dist/src/main.js',
      env: {
        NODE_ENV: 'production',
        ...apiEnv,
      },
      watch: false,
      time: true,
      max_restarts: 10,
      restart_delay: 2000,
    },
    {
      name: 'geofiber-portal',
      cwd: '/root/projetos/geofiber/apps/portal',
      script: '/root/.nvm/versions/node/v20.20.0/bin/pnpm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: '3001',
        ...portalEnv,
      },
      watch: false,
      time: true,
      max_restarts: 10,
      restart_delay: 2000,
    },
  ],
};
