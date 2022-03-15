const path = require("path")

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ipfs.infura.io"],
  },
  webpack: (config) => {
    config.resolve.alias["@components"] = path.resolve(__dirname, "./components")
    config.resolve.alias["@typechain"] = path.resolve(__dirname, "./typechain")
    return config
  },
}

module.exports = nextConfig
