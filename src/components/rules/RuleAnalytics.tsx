'use client';
import {useTranslations} from 'next-intl';
import {Bar, Pie} from 'react-chartjs-2';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import type {Types} from '../../types/alerts';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface RuleAnalyticsProps {
  data: Types;
}

export default function RuleAnalytics({ data }: RuleAnalyticsProps) {
  const t = useTranslations('rules');

  // Analyze rule groups for high severity alerts
  const groupDistribution = data.hits.hits.reduce((acc: { [key: string]: number }, hit) => {
    if (hit._source.rule.level >= 10) {
      hit._source.rule.groups.forEach(group => {
        acc[group] = (acc[group] || 0) + 1;
      });
    }
    return acc;
  }, {});

  // Sort groups by frequency
  const sortedGroups = Object.entries(groupDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8); // Take top 8 groups

  // Prepare pie chart data for rule groups
  const pieData = {
    labels: sortedGroups.map(([group]) => group),
    datasets: [
      {
        data: sortedGroups.map(([, count]) => count),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',   // red
          'rgba(249, 115, 22, 0.8)',  // orange
          'rgba(234, 179, 8, 0.8)',   // yellow
          'rgba(59, 130, 246, 0.8)',  // blue
          'rgba(147, 51, 234, 0.8)',  // purple
          'rgba(236, 72, 153, 0.8)',  // pink
          'rgba(16, 185, 129, 0.8)',  // green
          'rgba(75, 85, 99, 0.8)',    // gray
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: t('title'),
        font: {
          size: 16,
        },
      },
    },
  };

  // Analyze alert patterns over time
  const timeSeriesData: { [key: string]: { [key: string]: number } } = {};
  data.hits.hits.forEach(hit => {
    if (hit._source.rule.level >= 10) {
      const date = new Date(hit._source.timestamp).toLocaleDateString();
      if (!timeSeriesData[date]) {
        timeSeriesData[date] = {
          'Critical (≥13)': 0,
          'High (12)': 0,
          'Medium (10-11)': 0,
        };
      }
      
      const level = hit._source.rule.level;
      if (level >= 13) timeSeriesData[date]['Critical (≥13)']++;
      else if (level >= 12) timeSeriesData[date]['High (12)']++;
      else timeSeriesData[date]['Medium (10-11)']++;
    }
  });

  const barData = {
    labels: Object.keys(timeSeriesData),
    datasets: [
      {
        label: 'Critical (≥13)',
        data: Object.values(timeSeriesData).map(day => day['Critical (≥13)']),
        backgroundColor: 'rgba(239, 68, 68, 0.8)', // red
      },
      {
        label: 'High (12)',
        data: Object.values(timeSeriesData).map(day => day['High (12)']),
        backgroundColor: 'rgba(249, 115, 22, 0.8)', // orange
      },
      {
        label: 'Medium (10-11)',
        data: Object.values(timeSeriesData).map(day => day['Medium (10-11)']),
        backgroundColor: 'rgba(234, 179, 8, 0.8)', // yellow
      },
    ],
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: t('severityTimeline'),
        font: {
          size: 16,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: t('date')
        }
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: t('alertCount')
        }
      },
    },
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rule Groups Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <Pie data={pieData} options={pieOptions} />
        </div>

        {/* Alert Categories Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('title')}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('columns.category')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('columns.alertCount')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('columns.percentage')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedGroups.map(([group, count], index) => (
                  <tr key={group} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {group}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.round((count / data.hits.hits.length) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Severity Timeline */}
      <div className="bg-white p-6 rounded-lg shadow">
        <Bar options={barOptions} data={barData} />
      </div>
    </div>
  );
}
