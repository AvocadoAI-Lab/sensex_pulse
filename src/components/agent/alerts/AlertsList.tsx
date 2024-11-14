'use client';
import {useTranslations} from 'next-intl';
import type {Hit} from '@/types/alerts';

interface AlertsListProps {
  alerts: Hit[];
  limit?: number;
}

export default function AlertsList({ alerts, limit = 10 }: AlertsListProps) {
  const t = useTranslations('agent.alerts');
  
  const sortedAlerts = [...alerts]
    .sort((a, b) => new Date(b._source.timestamp).getTime() - new Date(a._source.timestamp).getTime())
    .slice(0, limit);

  const getSeverityConfig = (level: number) => {
    if (level >= 13) {
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        dot: 'bg-red-500',
        badge: 'bg-red-100 text-red-800',
        icon: 'text-red-500',
      };
    } else if (level >= 12) {
      return {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        dot: 'bg-orange-500',
        badge: 'bg-orange-100 text-orange-800',
        icon: 'text-orange-500',
      };
    } else if (level >= 10) {
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        dot: 'bg-yellow-500',
        badge: 'bg-yellow-100 text-yellow-800',
        icon: 'text-yellow-500',
      };
    } else {
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        dot: 'bg-green-500',
        badge: 'bg-green-100 text-green-800',
        icon: 'text-green-500',
      };
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{t('title')}</h3>
        <span className="text-sm text-gray-500">
          {t('showing', { count: Math.min(limit, sortedAlerts.length) })}
        </span>
      </div>
      
      <div className="space-y-4">
        {sortedAlerts.map((alert, index) => {
          const severity = getSeverityConfig(alert._source.rule.level);
          
          return (
            <div
              key={`${alert._source.timestamp}-${index}`}
              className={`p-6 rounded-xl border transition-all duration-200 hover:shadow-md ${severity.bg} ${severity.border}`}
            >
              {/* Alert Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-2`}>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${severity.badge}`}>
                      {t('level', { level: alert._source.rule.level })}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {new Date(alert._source.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700`}>
                    {t('ruleId', { id: alert._source.rule.id })}
                  </span>
                </div>
              </div>

              {/* Alert Content */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className={`mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full ${severity.dot}`} />
                  <p className="text-sm font-medium text-gray-900">
                    {alert._source.rule.description}
                  </p>
                </div>

                {/* Location */}
                <div className="ml-4.5 pl-3 flex items-center text-xs text-gray-600">
                  <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {alert._source.location}
                </div>

                {/* Groups and Categories */}
                <div className="ml-4.5 pl-3 flex flex-wrap gap-1.5 mt-2">
                  {alert._source.rule.groups.map((group, groupIndex) => (
                    <span
                      key={groupIndex}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-700 shadow-sm"
                    >
                      {group}
                    </span>
                  ))}
                </div>

                {/* Additional Data */}
                {alert._source.data?.win && (
                  <div className="ml-4.5 pl-3 mt-3">
                    <div className="bg-white/50 rounded-lg border border-gray-200 p-3">
                      <div className="text-xs font-medium text-gray-700 mb-2">{t('windowsEvent.title')}</div>
                      <div className="space-y-1.5 text-xs text-gray-600">
                        {alert._source.data.win.system.message && (
                          <div className="flex items-start">
                            <span className="font-medium min-w-[70px]">{t('windowsEvent.message')}:</span>
                            <span className="ml-2">{alert._source.data.win.system.message}</span>
                          </div>
                        )}
                        {alert._source.data.win.system.eventID && (
                          <div className="flex items-center">
                            <span className="font-medium min-w-[70px]">{t('windowsEvent.eventId')}:</span>
                            <span className="ml-2">{alert._source.data.win.system.eventID}</span>
                          </div>
                        )}
                        {alert._source.data.win.system.channel && (
                          <div className="flex items-center">
                            <span className="font-medium min-w-[70px]">{t('windowsEvent.channel')}:</span>
                            <span className="ml-2">{alert._source.data.win.system.channel}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
