'use client';
import {Pie} from 'react-chartjs-2';
import {useTranslations} from 'next-intl';
import {ArcElement, Chart as ChartJS, ChartData, ChartOptions, Legend, Title, Tooltip,} from 'chart.js';

ChartJS.register(ArcElement, Title, Legend, Tooltip);

interface AlertSeverityChartProps {
  distribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  title?: string;
}

export default function AlertSeverityChart({ distribution, title }: AlertSeverityChartProps) {
  const t = useTranslations('agent.charts');
  const total = Object.values(distribution).reduce((sum, value) => sum + value, 0);

  const data: ChartData<'pie'> = {
    labels: ['Critical (≥13)', 'High (12)', 'Medium (10-11)', 'Low (<10)'],
    datasets: [{
      data: [
        distribution.critical,
        distribution.high,
        distribution.medium,
        distribution.low,
      ],
      backgroundColor: [
        'rgba(239, 68, 68, 0.85)',  // Critical - Red
        'rgba(249, 115, 22, 0.85)', // High - Orange
        'rgba(234, 179, 8, 0.85)',  // Medium - Yellow
        'rgba(34, 197, 94, 0.85)',  // Low - Green
      ],
      borderColor: [
        'rgb(220, 38, 38)',  // Critical - Red border
        'rgb(234, 88, 12)',  // High - Orange border
        'rgb(202, 138, 4)',  // Medium - Yellow border
        'rgb(22, 163, 74)',  // Low - Green border
      ],
      borderWidth: 1,
      hoverBackgroundColor: [
        'rgba(239, 68, 68, 0.95)',
        'rgba(249, 115, 22, 0.95)',
        'rgba(234, 179, 8, 0.95)',
        'rgba(34, 197, 94, 0.95)',
      ],
      hoverBorderColor: [
        'rgb(220, 38, 38)',
        'rgb(234, 88, 12)',
        'rgb(202, 138, 4)',
        'rgb(22, 163, 74)',
      ],
      hoverBorderWidth: 2,
    }],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        padding: 12,
        titleFont: {
          size: 13,
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: function(context) {
            const value = context.raw as number;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${value} alerts (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  const severityConfig = {
    critical: {
      color: 'text-red-600',
      bg: 'bg-red-600',
      bgHover: 'hover:bg-red-700',
      border: 'border-red-200',
      shadow: 'shadow-red-100',
    },
    high: {
      color: 'text-orange-600',
      bg: 'bg-orange-500',
      bgHover: 'hover:bg-orange-600',
      border: 'border-orange-200',
      shadow: 'shadow-orange-100',
    },
    medium: {
      color: 'text-yellow-600',
      bg: 'bg-yellow-500',
      bgHover: 'hover:bg-yellow-600',
      border: 'border-yellow-200',
      shadow: 'shadow-yellow-100',
    },
    low: {
      color: 'text-green-600',
      bg: 'bg-green-500',
      bgHover: 'hover:bg-green-600',
      border: 'border-green-200',
      shadow: 'shadow-green-100',
    },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title || t('severity')}</h3>
        <span className="text-sm text-gray-500">Total: {total} alerts</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative h-[240px]">
          <Pie data={data} options={options} />
        </div>
        
        <div className="flex flex-col justify-center space-y-4">
          {Object.entries(distribution).map(([severity, count]) => (
            <div
              key={severity}
              className={`p-3 rounded-lg border bg-white transition-all duration-200 hover:shadow-md ${severityConfig[severity as keyof typeof severityConfig].border} ${severityConfig[severity as keyof typeof severityConfig].shadow}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${severityConfig[severity as keyof typeof severityConfig].bg}`} />
                  <span className={`text-sm font-medium ${severityConfig[severity as keyof typeof severityConfig].color}`}>
                    {severity.charAt(0).toUpperCase() + severity.slice(1)}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-700">{count}</span>
                  <span className="ml-1 text-gray-500">
                    ({((count / total) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
