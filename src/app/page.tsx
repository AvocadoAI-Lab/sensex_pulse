import {redirect} from 'next/navigation';
import {defaultLocale} from '../i18n/routing';

// Redirect to the default locale
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}

// Enable dynamic rendering for proper redirect
export const dynamic = 'force-dynamic';
