'use client';
import {Bar} from 'react-chartjs-2';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  TooltipItem,
} from 'chart.js';
import type {Root} from '@/types/alerts';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AlertSummaryProps {
  data: Root;
}

export default function AlertSummary({ data }: AlertSummaryProps) {
  // Calculate alert levels distribution
  const alertLevels = data.hits.hits.reduce((acc: { [key: number]: number }, hit) => {
    const level = hit._source.rule.level;
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {});

  // Get unique rule descriptions for critical alerts (level >= 12)
  const criticalAlertTypes = new Set(
    data.hits.hits
      .filter(hit => hit._source.rule.level >= 12)
      .map(hit => hit._source.rule.description)
  );

  // Prepare chart data with color coding based on severity
  const chartData = {
    labels: Object.keys(alertLevels),
    datasets: [
      {
        label: 'Alert Distribution by Severity Level',
        data: Object.values(alertLevels),
        backgroundColor: Object.keys(alertLevels).map(level => {
          const lvl = parseInt(level);
          if (lvl >= 13) return 'rgba(220, 38, 38, 0.8)';  // Critical (red)
          if (lvl >= 12) return 'rgba(249, 115, 22, 0.8)'; // High (orange)
          if (lvl >= 10) return 'rgba(234, 179, 8, 0.8)';  // Medium (yellow)
          return 'rgba(34, 197, 94, 0.8)';                  // Low (green)
        }),
        borderColor: Object.keys(alertLevels).map(level => {
          const lvl = parseInt(level);
          if (lvl >= 13) return 'rgb(220, 38, 38)';
          if (lvl >= 12) return 'rgb(249, 115, 22)';
          if (lvl >= 10) return 'rgb(234, 179, 8)';
          return 'rgb(34, 197, 94)';
        }),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'High Severity Alert Distribution',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label(context: TooltipItem<'bar'>) {
            return `Count: ${context.raw}`;
          },
          title(tooltipItems: TooltipItem<'bar'>[]) {
            return `Level ${tooltipItems[0].label}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Alerts'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Alert Level'
        }
      }
    },
  };

  // Calculate summary statistics
  const totalAlerts = data.hits.total.value;
  const criticalAlerts = data.hits.hits.filter(hit => hit._source.rule.level >= 12).length;
  const uniqueAgents = new Set(data.hits.hits.map(hit => hit._source.agent.name)).size;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total High Severity Alerts</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{totalAlerts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Critical Alerts (Level ≥12)</h3>
          <p className="mt-2 text-3xl font-semibold text-red-600">{criticalAlerts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Affected Agents</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{uniqueAgents}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <Bar options={chartOptions} data={chartData} />
      </div>

      {/* Critical Alert Types */}
      {criticalAlertTypes.size > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Critical Alert Types</h3>
          <div className="space-y-2">
            {Array.from(criticalAlertTypes).map((description, index) => (
              <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
