'use client';
import {useMemo} from 'react';
import {useTranslations} from 'next-intl';
import type {Hit} from '@/types/alerts';
import AlertSeverityChart from './charts/AlertSeverityChart';
import EventDistributionChart from './charts/EventDistributionChart';
import AlertsList from './alerts/AlertsList';

interface AgentDetailProps {
  agentName: string;
  alerts: Hit[];
}

export default function AgentDetail({ agentName, alerts }: AgentDetailProps) {
  const t = useTranslations('agent');

  // 計算警報等級分佈
  const severityDistribution = useMemo(() => {
    return {
      critical: alerts.filter(hit => hit._source.rule.level >= 13).length,
      high: alerts.filter(hit => hit._source.rule.level === 12).length,
      medium: alerts.filter(hit => hit._source.rule.level >= 10 && hit._source.rule.level < 12).length,
      low: alerts.filter(hit => hit._source.rule.level < 10).length,
    };
  }, [alerts]);

  // 計算Event分佈
  const eventDistribution = useMemo(() => {
    return alerts.reduce((acc: { [key: string]: number }, hit) => {
      const eventType = hit._source.data?.win?.system?.channel || 'Other';
      acc[eventType] = (acc[eventType] || 0) + 1;
      return acc;
    }, {});
  }, [alerts]);

  // 計算關鍵統計數據
  const totalAlerts = alerts.length;
  const criticalAlerts = severityDistribution.critical + severityDistribution.high;
  const uniqueRules = new Set(alerts.map(hit => hit._source.rule.id)).size;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
      {/* Agent Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('header.title', { name: agentName })}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {t('header.id', { id: alerts[0]._source.agent.id })}
                </p>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            {t('header.lastUpdated', { date: new Date(alerts[0]._source.timestamp).toLocaleString() })}
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-sm border border-gray-100 transition-transform hover:scale-[1.02] duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                {t('stats.totalAlerts.title')}
              </h3>
              <span className="p-2 bg-blue-50 rounded-lg">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </div>
            <p className="mt-4 text-4xl font-bold text-gray-900">{totalAlerts}</p>
            <p className="mt-2 text-sm text-gray-600">{t('stats.totalAlerts.description')}</p>
          </div>

          <div className="bg-gradient-to-br from-white to-red-50 p-6 rounded-xl shadow-sm border border-gray-100 transition-transform hover:scale-[1.02] duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                {t('stats.criticalAlerts.title')}
              </h3>
              <span className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </span>
            </div>
            <p className="mt-4 text-4xl font-bold text-red-600">{criticalAlerts}</p>
            <p className="mt-2 text-sm text-gray-600">{t('stats.criticalAlerts.description')}</p>
          </div>

          <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-sm border border-gray-100 transition-transform hover:scale-[1.02] duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                {t('stats.uniqueRules.title')}
              </h3>
              <span className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </span>
            </div>
            <p className="mt-4 text-4xl font-bold text-blue-600">{uniqueRules}</p>
            <p className="mt-2 text-sm text-gray-600">{t('stats.uniqueRules.description')}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <AlertSeverityChart distribution={severityDistribution} title={t('charts.severity')} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <EventDistributionChart distribution={eventDistribution} title={t('charts.events')} />
          </div>
        </div>

        {/* Alerts List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <AlertsList alerts={alerts} limit={10} />
        </div>
      </div>
    </div>
  );
}
