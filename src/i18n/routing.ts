export const locales = ['en', 'zh-TW'] as const;
export type Locale = typeof locales[number];
export type PathnameLocale = typeof locales[number];
export const defaultLocale: PathnameLocale = 'en';
