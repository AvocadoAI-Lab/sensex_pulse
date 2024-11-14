import createMiddleware from 'next-intl/middleware';
import {defaultLocale, locales} from './src/i18n/routing';

// This middleware intercepts requests to `/` and will redirect
// to one of the configured locales instead (e.g. `/en`)
// Also handles locale prefix on routes (e.g. `/en/about`, `/zh-TW/about`)
export default createMiddleware({
  defaultLocale,
  locales,
  // Use locale prefix everywhere
  localePrefix: 'always'
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Match all pathnames within `/users`, optionally with a locale prefix
    '/([\\w-]+)?/users/(.+)'
  ]
};
