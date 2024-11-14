import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const config = {
  // Enable static rendering
  output: 'standalone',
  experimental: {
    turbo: {
      rules: {
        // Turbopack configuration (if needed)
      }
    }
  }
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(config);
