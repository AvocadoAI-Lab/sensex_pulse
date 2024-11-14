'use client';
import {useTranslations} from 'next-intl';
import DownloadButton from '../common/DownloadButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('layout');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                {t('title')}
              </h1>
              <p className="mt-2 text-base text-gray-600">
                {t('subtitle')}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <DownloadButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-sm text-gray-600 text-center">
            {t('footer')}
          </p>
        </div>
      </footer>
    </div>
  );
}
