const fs = require("fs");
const path = require("path");

const ROOT = __dirname;

const ENV_FILE =
  process.env.GEOFIBER_ENV_FILE ||
  "/etc/geofiber/geofiber.env";

function loadEnv(file) {
  const env = {};

  if (!fs.existsSync(file)) {
    return env;
  }

  const lines =
    fs.readFileSync(file, "utf8")
      .split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (
      !line ||
      line.startsWith("#") ||
      !line.includes("=")
    ) {
      continue;
    }

    const index = line.indexOf("=");

    const key =
      line.slice(0, index).trim();

    let value =
      line.slice(index + 1).trim();

    if (
      (
        value.startsWith('"') &&
        value.endsWith('"')
      ) ||
      (
        value.startsWith("'") &&
        value.endsWith("'")
      )
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

const env = loadEnv(ENV_FILE);

const pnpm =
  env.PNPM_BIN ||
  process.env.PNPM_BIN ||
  "pnpm";

const apiPort =
  env.API_PORT ||
  "3001";

const portalPort =
  env.PORTAL_PORT ||
  "3000";

module.exports = {
  apps: [
    {
      name: "geofiber-api",

      cwd: path.join(
        ROOT,
        "apps/api"
      ),

      script: pnpm,
      args: "run start",
      interpreter: "none",

      env: {
        ...env,
        NODE_ENV: "production",
        PORT: apiPort,
      },

      autorestart: true,
      restart_delay: 3000,
      max_restarts: 10,
    },

    {
      name: "geofiber-portal",

      cwd: path.join(
        ROOT,
        "apps/portal"
      ),

      script: pnpm,

      args:
        `run start -- -p ${portalPort}`,

      interpreter: "none",

      env: {
        ...env,
        NODE_ENV: "production",
      },

      autorestart: true,
      restart_delay: 3000,
      max_restarts: 10,
    },
  ],
};
