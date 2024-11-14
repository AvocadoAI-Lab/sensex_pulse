'use client';
import React from 'react';
import {useTranslations} from 'next-intl';
import {Bar} from 'react-chartjs-2';
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip, TooltipItem,} from 'chart.js';
import type {Types} from '../../types/alerts';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface GroupSummaryProps {
  data: Types;
}

const GroupSummary: React.FC<GroupSummaryProps> = ({ data }) => {
  const groupT = useTranslations('group');

  // Calculate overall statistics
  const totalAlerts = data.hits.total.value;
  const uniqueAgents = new Set(data.hits.hits.map(hit => hit._source.agent.name));
  const criticalAlerts = data.hits.hits.filter(hit => hit._source.rule.level >= 12).length;

  // Calculate alerts count and severity distribution for each agent
  const agentStats = data.hits.hits.reduce((acc: { 
    [key: string]: {
      total: number;
      critical: number;
      high: number;
      medium: number;
      low: number;
    }
  }, hit) => {
    const agentName = hit._source.agent.name;
    const level = hit._source.rule.level;

    if (!acc[agentName]) {
      acc[agentName] = {
        total: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      };
    }

    acc[agentName].total += 1;
    if (level >= 13) acc[agentName].critical += 1;
    else if (level >= 12) acc[agentName].high += 1;
    else if (level >= 10) acc[agentName].medium += 1;
    else acc[agentName].low += 1;

    return acc;
  }, {});

  // Prepare chart data
  const chartData = {
    labels: Object.keys(agentStats),
    datasets: [
      {
        label: 'Critical (≥13)',
        data: Object.values(agentStats).map(stats => stats.critical),
        backgroundColor: 'rgba(239, 68, 68, 0.85)',
        borderColor: 'rgb(220, 38, 38)',
        borderWidth: 1,
        stack: 'Stack 0',
      },
      {
        label: 'High (12)',
        data: Object.values(agentStats).map(stats => stats.high),
        backgroundColor: 'rgba(249, 115, 22, 0.85)',
        borderColor: 'rgb(234, 88, 12)',
        borderWidth: 1,
        stack: 'Stack 0',
      },
      {
        label: 'Medium (10-11)',
        data: Object.values(agentStats).map(stats => stats.medium),
        backgroundColor: 'rgba(234, 179, 8, 0.85)',
        borderColor: 'rgb(202, 138, 4)',
        borderWidth: 1,
        stack: 'Stack 0',
      },
      {
        label: 'Low (<10)',
        data: Object.values(agentStats).map(stats => stats.low),
        backgroundColor: 'rgba(34, 197, 94, 0.85)',
        borderColor: 'rgb(22, 163, 74)',
        borderWidth: 1,
        stack: 'Stack 0',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          font: {
            size: 12
          },
        },
      },
      title: {
        display: true,
        text: groupT('charts.distribution'),
        font: {
          size: 16
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<"bar">) {
            const label = context.dataset.label || '';
            const value = context.raw as number;
            return groupT('charts.tooltipLabel', { label, value });
          },
        },
        padding: 12,
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: groupT('charts.agentName'),
          font: {
            size: 13
          },
          padding: { top: 10 },
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        title: {
          display: true,
          text: groupT('charts.alertCount'),
          font: {
            size: 13
          },
          padding: { bottom: 10 },
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-100 transition-transform hover:scale-[1.02] duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
              {groupT('stats.totalAlerts.title')}
            </h3>
            <span className="p-2 bg-blue-50 rounded-lg">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <p className="mt-4 text-4xl font-bold text-gray-900">{totalAlerts}</p>
          <p className="mt-2 text-sm text-gray-600">{groupT('stats.totalAlerts.description')}</p>
        </div>

        <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-lg border border-gray-100 transition-transform hover:scale-[1.02] duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
              {groupT('stats.activeAgents.title')}
            </h3>
            <span className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
          </div>
          <p className="mt-4 text-4xl font-bold text-blue-600">{uniqueAgents.size}</p>
          <p className="mt-2 text-sm text-gray-600">{groupT('stats.activeAgents.description')}</p>
        </div>

        <div className="bg-gradient-to-br from-white to-red-50 p-6 rounded-xl shadow-lg border border-gray-100 transition-transform hover:scale-[1.02] duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
              {groupT('stats.criticalAlerts.title')}
            </h3>
            <span className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
          </div>
          <p className="mt-4 text-4xl font-bold text-red-600">{criticalAlerts}</p>
          <p className="mt-2 text-sm text-gray-600">{groupT('stats.criticalAlerts.description')}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="h-[400px]">
          <Bar options={chartOptions} data={chartData} />
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{groupT('table.title')}</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {groupT('table.columns.agent')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {groupT('table.columns.totalAlerts')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {groupT('table.columns.critical')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {groupT('table.columns.high')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {groupT('table.columns.medium')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {groupT('table.columns.low')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(agentStats).map(([agent, stats]) => (
                <tr key={agent} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{agent}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{stats.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">{stats.critical}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">{stats.high}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-600">{stats.medium}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{stats.low}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GroupSummary;
