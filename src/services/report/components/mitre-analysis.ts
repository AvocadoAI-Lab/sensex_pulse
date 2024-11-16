import {GroupSummary} from '../summary';

interface MitreMetrics {
    totalTactics: number;
    totalTechniques: number;
    topTactics: Array<{ name: string; count: number }>;
    topTechniques: Array<{ name: string; count: number }>;
    coverage: number;
}

// MITRE ATT&CK Enterprise Matrix tactics (simplified list)
const ENTERPRISE_TACTICS = [
    'Initial Access',
    'Execution',
    'Persistence',
    'Privilege Escalation',
    'Defense Evasion',
    'Credential Access',
    'Discovery',
    'Lateral Movement',
    'Collection',
    'Command and Control',
    'Exfiltration',
    'Impact'
];

function analyzeMitreCoverage(summary: GroupSummary): MitreMetrics {
    const { tactics, techniques } = summary.mitreCoverage;
    
    // Sort tactics and techniques by count
    const topTactics = Object.entries(tactics)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    const topTechniques = Object.entries(techniques)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // Calculate coverage percentage
    const coveredTactics = new Set(Object.keys(tactics));
    const coveragePercentage = (coveredTactics.size / ENTERPRISE_TACTICS.length) * 100;

    return {
        totalTactics: Object.keys(tactics).length,
        totalTechniques: Object.keys(techniques).length,
        topTactics,
        topTechniques,
        coverage: Math.round(coveragePercentage)
    };
}

function generateTacticsHeatmap(tactics: { [key: string]: number }): string {
    const maxCount = Math.max(...Object.values(tactics));
    
    return `
    <div class="bg-white p-6 rounded-lg shadow-lg">
        <h4 class="text-lg font-medium mb-4">Tactics Coverage Heatmap</h4>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            ${ENTERPRISE_TACTICS.map(tactic => {
                const count = tactics[tactic] || 0;
                const intensity = count > 0 ? Math.max(20, Math.round((count / maxCount) * 100)) : 0;
                return `
                <div class="p-4 rounded-lg ${count > 0 ? `bg-blue-${intensity}` : 'bg-gray-100'}">
                    <div class="text-sm font-medium ${count > 0 ? intensity > 50 ? 'text-white' : 'text-blue-900' : 'text-gray-500'}">
                        ${tactic}
                    </div>
                    <div class="text-xs mt-1 ${count > 0 ? intensity > 50 ? 'text-blue-100' : 'text-blue-700' : 'text-gray-400'}">
                        ${count} alerts
                    </div>
                </div>`;
            }).join('')}
        </div>
    </div>`;
}

function generateTopTechniquesChart(techniques: Array<{ name: string; count: number }>): string {
    const maxCount = Math.max(...techniques.map(t => t.count));
    
    return `
    <div class="bg-white p-6 rounded-lg shadow-lg">
        <h4 class="text-lg font-medium mb-4">Most Detected Techniques</h4>
        <div class="space-y-4">
            ${techniques.map(technique => `
            <div>
                <div class="flex items-center justify-between mb-1">
                    <span class="text-sm font-medium text-gray-600">${technique.name}</span>
                    <span class="text-sm text-gray-500">${technique.count} detections</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-purple-600 h-2 rounded-full" style="width: ${(technique.count / maxCount) * 100}%"></div>
                </div>
            </div>
            `).join('')}
        </div>
    </div>`;
}

export function generateMitreAnalysis(summary: GroupSummary): string {
    const metrics = analyzeMitreCoverage(summary);
    
    return `
    <div class="w-full min-h-[297mm] bg-white p-12">
        <div class="max-w-4xl mx-auto">
            <h2 class="text-3xl font-bold mb-8">MITRE ATT&CK Analysis</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div class="bg-white p-6 rounded-lg shadow-lg border border-purple-200">
                    <h3 class="text-sm font-medium text-purple-500 mb-1">Coverage Score</h3>
                    <div class="flex items-baseline">
                        <p class="text-2xl font-bold text-purple-600">${metrics.coverage}%</p>
                        <p class="ml-2 text-sm text-gray-500">of tactics covered</p>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg border border-blue-200">
                    <h3 class="text-sm font-medium text-blue-500 mb-1">Tactics Monitored</h3>
                    <div class="flex items-baseline">
                        <p class="text-2xl font-bold text-blue-600">${metrics.totalTactics}</p>
                        <p class="ml-2 text-sm text-gray-500">of ${ENTERPRISE_TACTICS.length} total</p>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-lg border border-indigo-200">
                    <h3 class="text-sm font-medium text-indigo-500 mb-1">Techniques Detected</h3>
                    <p class="text-2xl font-bold text-indigo-600">${metrics.totalTechniques}</p>
                </div>
            </div>

            ${generateTacticsHeatmap(summary.mitreCoverage.tactics)}

            <div class="mt-12">
                ${generateTopTechniquesChart(metrics.topTechniques)}
            </div>

            <div class="mt-12 bg-purple-50 p-8 rounded-lg">
                <h3 class="text-xl font-semibold mb-4">Coverage Analysis</h3>
                <ul class="space-y-4">
                    <li class="flex items-start">
                        <span class="text-purple-500 mr-2">•</span>
                        <div>
                            <p class="font-medium">Current Coverage</p>
                            <p class="text-sm text-gray-600">
                                Monitoring ${metrics.totalTactics} tactics and detecting ${metrics.totalTechniques} techniques,
                                providing ${metrics.coverage}% coverage of the MITRE ATT&CK framework.
                            </p>
                        </div>
                    </li>
                    ${metrics.coverage < 100 ? `
                    <li class="flex items-start">
                        <span class="text-orange-500 mr-2">•</span>
                        <div>
                            <p class="font-medium">Coverage Gaps</p>
                            <p class="text-sm text-gray-600">
                                Consider implementing detection rules for uncovered tactics to improve security monitoring capabilities.
                            </p>
                        </div>
                    </li>` : ''}
                    ${metrics.topTactics.length > 0 ? `
                    <li class="flex items-start">
                        <span class="text-blue-500 mr-2">•</span>
                        <div>
                            <p class="font-medium">Most Active Areas</p>
                            <p class="text-sm text-gray-600">
                                Highest activity detected in ${metrics.topTactics[0].name} (${metrics.topTactics[0].count} alerts),
                                suggesting focused attention on these tactics.
                            </p>
                        </div>
                    </li>` : ''}
                </ul>
            </div>
        </div>
    </div>
    <div class="page-break"></div>`;
}
