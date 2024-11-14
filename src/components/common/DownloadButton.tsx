'use client';
import {useState} from 'react';
import {useTranslations} from 'next-intl';

export default function DownloadButton() {
  const [isGenerating, setIsGenerating] = useState(false);
  const t = useTranslations('common.download');

  const handleDownload = async () => {
    try {
      setIsGenerating(true);

      // Get the current URL
      const currentUrl = window.location.href;

      // Call our API endpoint to generate static HTML
      const response = await fetch('/api/generate-static', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: currentUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate static report');
      }

      // Get the static HTML content
      const htmlContent = await response.text();

      // Create a blob from the HTML content
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().split('T')[0];
      link.download = `ransomware-attack-report-${date}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generating report:', error);
      alert(t('error'));
    } finally {
      setIsGenerating(false);
    }
  };

  const buttonClasses = `
    inline-flex items-center px-4 py-2 rounded-md
    ${isGenerating ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}
    text-white font-medium text-sm
    transition-colors duration-150 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
  `;

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      data-download-button
      className={buttonClasses}
    >
      {isGenerating ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {t('generating')}
        </>
      ) : (
        <>
          <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {t('button')}
        </>
      )}
    </button>
  );
}
