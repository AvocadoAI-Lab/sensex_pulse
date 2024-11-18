/** @type {import('next').NextConfig} */
const config = {
  output: 'standalone',
  experimental: {
    turbo: {
      rules: {}
    }
  }
};

export default config;
