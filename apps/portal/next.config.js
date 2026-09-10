/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {

  reactStrictMode: true,

  productionBrowserSourceMaps: false,

  outputFileTracingRoot:
    path.join(__dirname, "../../"),

  
};

module.exports = nextConfig;
