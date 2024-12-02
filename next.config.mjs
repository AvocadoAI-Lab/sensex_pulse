/** @type {import('next').NextConfig} */
const config = {
  output: 'standalone',
  experimental: {
    serverOptions: {
      port: 29005
    }
  }
};

export default config;
