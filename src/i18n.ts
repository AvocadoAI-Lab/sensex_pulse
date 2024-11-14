import {getRequestConfig} from 'next-intl/server';
import {type Locale, locales} from './i18n/routing';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    return {
      messages: (await import(`src/messages/en.json`)).default
    };
  }

  return {
    messages: (await import(`src/messages/${locale}.json`)).default
  };
});
