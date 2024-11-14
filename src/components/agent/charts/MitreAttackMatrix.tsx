'use client';
import {useTranslations} from 'next-intl';

interface MitreAttackMatrixProps {
  distribution: {
    [key: string]: number;
  };
}

export default function MitreAttackMatrix({ distribution }: MitreAttackMatrixProps) {
  const t = useTranslations('mitre');
  
  const sortedEntries = Object.entries(distribution)
    .sort(([, a], [, b]) => b - a);

  const maxCount = Math.max(...Object.values(distribution));
  const total = Object.values(distribution).reduce((sum, value) => sum + value, 0);

  // Color variations for different coverage levels
  const getCoverageColor = (percentage: number) => {
    if (percentage >= 75) {
      return {
        bg: 'bg-purple-600',
        bgLight: 'bg-purple-50',
        border: 'border-purple-100',
        text: 'text-purple-900',
        textLight: 'text-purple-600',
        badge: 'bg-purple-100 text-purple-800',
        progress: 'bg-purple-200',
      };
    } else if (percentage >= 50) {
      return {
        bg: 'bg-blue-600',
        bgLight: 'bg-blue-50',
        border: 'border-blue-100',
        text: 'text-blue-900',
        textLight: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-800',
        progress: 'bg-blue-200',
      };
    } else if (percentage >= 25) {
      return {
        bg: 'bg-indigo-600',
        bgLight: 'bg-indigo-50',
        border: 'border-indigo-100',
        text: 'text-indigo-900',
        textLight: 'text-indigo-600',
        badge: 'bg-indigo-100 text-indigo-800',
        progress: 'bg-indigo-200',
      };
    } else {
      return {
        bg: 'bg-violet-600',
        bgLight: 'bg-violet-50',
        border: 'border-violet-100',
        text: 'text-violet-900',
        textLight: 'text-violet-600',
        badge: 'bg-violet-100 text-violet-800',
        progress: 'bg-violet-200',
      };
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t('title')}</h3>
          <p className="text-sm text-gray-500 mt-1">{t('subtitle')}</p>
        </div>
        <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <span className="text-sm font-medium text-gray-700">{t('totalDetections')}: </span>
          <span className="text-sm font-bold text-gray-900">{total}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {sortedEntries.map(([tactic, count]) => {
          const percentage = (count / maxCount) * 100;
          const colors = getCoverageColor(percentage);
          
          return (
            <div 
              key={tactic}
              className={`${colors.bgLight} p-6 rounded-xl border ${colors.border} transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${colors.bg}`} />
                    <h4 className={`text-sm font-semibold ${colors.text}`}>
                      {tactic}
                    </h4>
                  </div>
                  <div className="flex items-center mt-2">
                    <div className={`text-xs font-medium ${colors.textLight}`}>
                      {((count / total) * 100).toFixed(1)}% of all detections
                    </div>
                  </div>
                </div>
                <div className={`ml-4 px-3 py-1.5 rounded-full text-xs font-semibold ${colors.badge}`}>
                  {count} hits
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className={`h-2.5 ${colors.progress} rounded-full overflow-hidden`}>
                  <div
                    className={`h-full ${colors.bg} transition-all duration-500 ease-out`}
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-xs text-gray-600">
                    {t('coverage')}: <span className="font-semibold">{percentage.toFixed(1)}%</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-xs text-gray-600">
                    {t('frequency')}: <span className="font-semibold">{((count / total) * 100).toFixed(1)}%</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sortedEntries.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 text-sm">{t('noData')}</p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
        <div className="text-xs space-y-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-600 rounded-full mr-2" />
            <span className="text-gray-600">{t('legend.high')}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full mr-2" />
            <span className="text-gray-600">{t('legend.medium')}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-indigo-600 rounded-full mr-2" />
            <span className="text-gray-600">{t('legend.low')}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-violet-600 rounded-full mr-2" />
            <span className="text-gray-600">{t('legend.minimal')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
