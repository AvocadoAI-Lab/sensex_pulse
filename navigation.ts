export const locales = ['en', 'zh-TW'] as const;
export type Locale = typeof locales[number];

// 創建類型安全的路由配置
export const pathnames = {
  '/': '/'
} as const;

export type Pathnames = typeof pathnames;
