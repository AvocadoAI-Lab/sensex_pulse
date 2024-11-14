'use client';
import {useEffect, useMemo, useState} from 'react';
import {useTranslations} from 'next-intl';
import DashboardLayout from '../../components/layout/DashboardLayout';
import GroupSummary from '../../components/group/GroupSummary';
import AgentDetail from '../../components/agent/AgentDetail';
import type {Hit, Root} from '../../types/alerts';

export default function Home() {
  const t = useTranslations();
  const [data, setData] = useState<Root | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/group-alerts?group=redteam2')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((jsonData: Root) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // 按agent分組警報數據
  const agentAlerts = useMemo(() => {
    if (!data) return {};
    
    return data.hits.hits.reduce((acc: { [key: string]: Hit[] }, hit) => {
      const agentName = hit._source.agent.name;
      if (!acc[agentName]) {
        acc[agentName] = [];
      }
      acc[agentName].push(hit);
      return acc;
    }, {});
  }, [data]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-red-600">
            <h2 className="text-xl font-semibold mb-2">{t('common.error.title')}</h2>
            <p>{error || t('common.error.default')}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Combined Group Overview and Agent Details Section */}
        <section>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.title')}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {t('dashboard.subtitle')}
            </p>
          </div>
          <div className="space-y-6">
            <GroupSummary data={data} />
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t('dashboard.agentDetails.title')}</h2>
              <p className="text-sm text-gray-500 mb-4">
                {t('dashboard.agentDetails.subtitle')}
              </p>
              {Object.entries(agentAlerts)
                .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
                .map(([agentName, alerts]) => (
                  <AgentDetail
                    key={agentName}
                    agentName={agentName}
                    alerts={alerts}
                  />
                ))}
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
