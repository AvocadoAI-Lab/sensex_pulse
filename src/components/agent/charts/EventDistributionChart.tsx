'use client';
import {useTranslations} from 'next-intl';

interface EventDistributionChartProps {
  distribution: {
    [key: string]: number;
  };
  title?: string;
}

export default function EventDistributionChart({ distribution, title }: EventDistributionChartProps) {
  const t = useTranslations('agent.charts');
  const sortedEntries = Object.entries(distribution)
    .sort(([, a], [, b]) => b - a);

  const total = Object.values(distribution).reduce((sum, value) => sum + value, 0);
  const maxValue = Math.max(...Object.values(distribution));

  // Generate a unique color for each event type
  const getEventColor = (index: number) => {
    const colors = [
      { bg: 'bg-blue-500', text: 'text-blue-600', lighter: 'bg-blue-100' },
      { bg: 'bg-indigo-500', text: 'text-indigo-600', lighter: 'bg-indigo-100' },
      { bg: 'bg-purple-500', text: 'text-purple-600', lighter: 'bg-purple-100' },
      { bg: 'bg-pink-500', text: 'text-pink-600', lighter: 'bg-pink-100' },
      { bg: 'bg-cyan-500', text: 'text-cyan-600', lighter: 'bg-cyan-100' },
      { bg: 'bg-teal-500', text: 'text-teal-600', lighter: 'bg-teal-100' },
    ];
    return colors[index % colors.length];
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title || t('events')}</h3>
        <span className="text-sm text-gray-500">Total: {total} events</span>
      </div>

      <div className="space-y-5">
        {sortedEntries.map(([eventType, count], index) => {
          const percentage = (count / maxValue) * 100;
          const color = getEventColor(index);
          
          return (
            <div 
              key={eventType} 
              className="p-4 rounded-lg bg-white border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${color.bg}`} />
                  <span className="text-sm font-medium text-gray-700">
                    {eventType}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-semibold ${color.text}`}>
                    {count}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({((count / total) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <div className={`h-2 rounded-full ${color.lighter}`}>
                  <div
                    className={`absolute left-0 top-0 h-2 rounded-full ${color.bg} transition-all duration-500 ease-in-out`}
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>

              {/* Hover Info */}
              <div className="mt-2 flex justify-between items-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                <span className="text-xs text-gray-500">
                  {count} {t('eventsOfType')}
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">
                    {t('relativeFrequency')}:
                  </span>
                  <span className={`text-xs font-medium ${color.text}`}>
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sortedEntries.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">{t('noData')}</p>
        </div>
      )}
    </div>
  );
}
