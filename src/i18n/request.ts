import {getRequestConfig} from 'next-intl/server';
import {type Locale, locales} from './routing';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    return {
      messages: (await import(`../messages/en.json`)).default
    };
  }

  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
