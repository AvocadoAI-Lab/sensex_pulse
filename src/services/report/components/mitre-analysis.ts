import {GroupSummary} from '../summary';

interface MitreMetrics {
    totalTactics: number;
    totalTechniques: number;
    topTactics: Array<{ name: string; count: number }>;
    topTechniques: Array<{ name: string; count: number }>;
    coverage: number;
}

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

function getColorIntensity(count: number, maxCount: number): string {
    if (count === 0) return '#f3f4f6';
    const intensity = Math.max(20, Math.round((count / maxCount) * 100));
    if (intensity > 80) return '#4c1d95';
    if (intensity > 60) return '#5b21b6';
    if (intensity > 40) return '#6d28d9';
    if (intensity > 20) return '#7c3aed';
    return '#8b5cf6';
}

function getTextColor(bgColor: string): string {
    return bgColor === '#f3f4f6' ? '#6b7280' : '#ffffff';
}

function analyzeMitreCoverage(summary: GroupSummary): MitreMetrics {
    const { tactics, techniques } = summary.mitreCoverage;
    
    const topTactics = Object.entries(tactics)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    const topTechniques = Object.entries(techniques)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

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

function generateCoverageGauge(coverage: number): string {
    const rotation = (coverage / 100) * 180;
    const color = coverage >= 80 ? '#4c1d95' :
                 coverage >= 60 ? '#6d28d9' :
                 coverage >= 40 ? '#7c3aed' :
                 '#8b5cf6';

    return `
    <div style="position: relative; width: 200px; height: 100px; margin: 0 auto;">
        <!-- Gauge Background -->
        <div style="
            position: absolute;
            width: 200px;
            height: 200px;
            top: -100px;
            border-radius: 100px;
            background: linear-gradient(135deg, ${color} 0%, ${color}66 100%);
            opacity: 0.1;
        "></div>
        <!-- Score Display -->
        <div style="
            position: absolute;
            bottom: 0;
            width: 100%;
            text-align: center;
        ">
            <div style="font-size: 36px; font-weight: 700; color: ${color};">${coverage}%</div>
            <div style="font-size: 14px; color: #4b5563;">Framework Coverage</div>
        </div>
        <!-- Gauge Needle -->
        <div style="
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 2px;
            height: 60px;
            background-color: ${color};
            transform-origin: bottom;
            transform: translateX(-50%) rotate(${rotation - 90}deg);
            border-radius: 1px;
        "></div>
    </div>`;
}

function generateTacticsHeatmap(tactics: { [key: string]: number }): string {
    const maxCount = Math.max(...Object.values(tactics));
    
    return `
    <div style="
        background: white;
        border-radius: 12px;
        padding: 24px;
        border: 1px solid #e5e7eb;
    ">
        <h4 style="font-size: 18px; font-weight: 500; color: #111827; margin-bottom: 24px;">
            Tactics Coverage Heatmap
        </h4>
        <div style="
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
        ">
            ${ENTERPRISE_TACTICS.map(tactic => {
                const count = tactics[tactic] || 0;
                const bgColor = getColorIntensity(count, maxCount);
                const textColor = getTextColor(bgColor);
                return `
                <div style="
                    background: ${bgColor};
                    border-radius: 12px;
                    padding: 16px;
                    transition: all 0.2s;
                ">
                    <div style="font-size: 14px; font-weight: 500; color: ${textColor};">${tactic}</div>
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: 8px;
                    ">
                        <span style="font-size: 12px; color: ${textColor}; opacity: 0.8;">
                            ${count} alerts
                        </span>
                        ${count > 0 ? `
                        <div style="
                            width: 8px;
                            height: 8px;
                            border-radius: 4px;
                            background: currentColor;
                            opacity: 0.6;
                        "></div>` : ''}
                    </div>
                </div>`;
            }).join('')}
        </div>
    </div>`;
}

function generateTechniquesChart(techniques: Array<{ name: string; count: number }>): string {
    const maxCount = Math.max(...techniques.map(t => t.count));
    
    return `
    <div style="
        background: white;
        border-radius: 12px;
        padding: 24px;
        border: 1px solid #e5e7eb;
    ">
        <h4 style="font-size: 18px; font-weight: 500; color: #111827; margin-bottom: 24px;">
            Most Detected Techniques
        </h4>
        <div style="display: flex; flex-direction: column; gap: 24px;">
            ${techniques.map(technique => `
            <div>
                <div style="
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px;
                ">
                    <div style="
                        width: 32px;
                        height: 32px;
                        background: #f5f3ff;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 12px;
                    ">
                        <svg style="width: 16px; height: 16px; color: #6d28d9;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                    </div>
                    <div style="flex-grow: 1;">
                        <div style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        ">
                            <span style="font-size: 14px; font-weight: 500; color: #111827;">
                                ${technique.name}
                            </span>
                            <span style="font-size: 14px; color: #6b7280;">
                                ${technique.count} detections
                            </span>
                        </div>
                        <div style="
                            height: 6px;
                            background: #f3f4f6;
                            border-radius: 3px;
                            margin-top: 8px;
                            overflow: hidden;
                        ">
                            <div style="
                                height: 100%;
                                width: ${(technique.count / maxCount) * 100}%;
                                background: linear-gradient(90deg, #6d28d9, #4c1d95);
                                border-radius: 3px;
                                transition: width 0.3s ease;
                            "></div>
                        </div>
                    </div>
                </div>
            </div>
            `).join('')}
        </div>
    </div>`;
}

export function generateMitreAnalysis(summary: GroupSummary): string {
    const metrics = analyzeMitreCoverage(summary);
    
    return `
    <div style="padding: 48px; height: 100%; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);">
        <div style="max-width: 800px; margin: 0 auto;">
            <!-- Header -->
            <div style="display: flex; align-items: center; margin-bottom: 48px;">
                <div style="
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 16px;
                ">
                    <svg style="width: 24px; height: 24px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                </div>
                <h2 style="font-size: 32px; font-weight: 700; color: #1f2937;">MITRE ATT&CK Analysis</h2>
            </div>

            <!-- Metrics Grid -->
            <div style="
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 24px;
                margin-bottom: 48px;
            ">
                <div style="
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    border: 1px solid #e5e7eb;
                ">
                    <h3 style="font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 16px;">
                        Framework Coverage
                    </h3>
                    ${generateCoverageGauge(metrics.coverage)}
                </div>

                <div style="
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    border: 1px solid #e5e7eb;
                ">
                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    ">
                        <h3 style="font-size: 14px; font-weight: 500; color: #6b7280;">Tactics Monitored</h3>
                        <div style="
                            width: 48px;
                            height: 48px;
                            background: #f5f3ff;
                            border-radius: 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">
                            <span style="font-size: 24px; font-weight: 700; color: #6d28d9;">
                                ${metrics.totalTactics}
                            </span>
                        </div>
                    </div>
                    <p style="font-size: 14px; color: #6b7280; margin-top: 8px;">
                        of ${ENTERPRISE_TACTICS.length} total tactics covered
                    </p>
                </div>

                <div style="
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    border: 1px solid #e5e7eb;
                ">
                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    ">
                        <h3 style="font-size: 14px; font-weight: 500; color: #6b7280;">Techniques Detected</h3>
                        <div style="
                            width: 48px;
                            height: 48px;
                            background: #f5f3ff;
                            border-radius: 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">
                            <span style="font-size: 24px; font-weight: 700; color: #6d28d9;">
                                ${metrics.totalTechniques}
                            </span>
                        </div>
                    </div>
                    <p style="font-size: 14px; color: #6b7280; margin-top: 8px;">
                        unique techniques identified
                    </p>
                </div>
            </div>

            ${generateTacticsHeatmap(summary.mitreCoverage.tactics)}

            <div style="margin-top: 48px;">
                ${generateTechniquesChart(metrics.topTechniques)}
            </div>
        </div>
    </div>`;
}
