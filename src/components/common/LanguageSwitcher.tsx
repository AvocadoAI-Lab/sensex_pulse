'use client';
import {useLocale} from 'next-intl';
import {usePathname, useRouter} from 'next/navigation';
import type {Locale} from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    // Get the current path without the locale prefix
    const currentPath = pathname.replace(/^\/[^/]+/, '') || '/';
    router.push(`/${newLocale}${currentPath}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => switchLocale('en')}
        className={`px-3 py-1 rounded ${
          locale === 'en'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        English
      </button>
      <button
        onClick={() => switchLocale('zh-TW')}
        className={`px-3 py-1 rounded ${
          locale === 'zh-TW'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        繁體中文
      </button>
    </div>
  );
}
