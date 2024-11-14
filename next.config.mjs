import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const config = {
  // Enable static rendering
  output: 'standalone',
  experimental: {
    turbo: {
      rules: {
        // Turbopack 配置（如果需要）
      }
    }
  }
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(config);