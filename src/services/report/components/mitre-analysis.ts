import {GroupSummary} from '../summary';

function generateMetricsGrid(coverage: number, tacticsCount: number, techniquesCount: number): string {
    const metricBoxStyle = `
        background: white;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        width: 180px;
    `;

    const titleStyle = `
        color: #4B5563;
        font-size: 12px;
        font-weight: normal;
        margin-bottom: 8px;
    `;

    const valueStyle = `
        font-size: 32px;
        font-weight: 500;
        margin: 8px 0;
        line-height: 1;
        color: #6d28d9;
    `;

    const subtextStyle = `
        color: #4B5563;
        font-size: 12px;
        font-weight: normal;
    `;

    return `
    <div style="display: flex; gap: 16px; margin-bottom: 32px;">
        <div style="${metricBoxStyle}">
            <div style="${titleStyle}">Framework Coverage</div>
            <div style="${valueStyle}">${coverage}%</div>
            <div style="${subtextStyle}">Framework Coverage</div>
        </div>

        <div style="${metricBoxStyle}">
            <div style="${titleStyle}">Tactics Monitored</div>
            <div style="${valueStyle}">${tacticsCount}</div>
            <div style="${subtextStyle}">of 12 Total Tactics</div>
        </div>

        <div style="${metricBoxStyle}">
            <div style="${titleStyle}">Techniques Detected</div>
            <div style="${valueStyle}">${techniquesCount}</div>
            <div style="${subtextStyle}">Unique Techniques</div>
        </div>
    </div>`;
}

function generateTacticsTable(tactics: { [key: string]: number }): string {
    const maxCount = Math.max(...Object.values(tactics));
    const entries = Object.entries(tactics)
        .sort((a, b) => b[1] - a[1])
        .map(([tactic, count]) => {
            const percentage = Math.round((count / maxCount) * 100);
            return `
            <div style="padding: 12px 0; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center; justify-content: space-between;">
                <div style="flex: 1;">${tactic}</div>
                <div style="margin: 0 16px;">${count} alerts</div>
                <div style="width: 120px; height: 8px; background: #f3f4f6; border-radius: 4px; overflow: hidden;">
                    <div style="width: ${percentage}%; height: 100%; background: #6d28d9; border-radius: 4px;"></div>
                </div>
            </div>`;
        });

    return `
    <h3 style="margin: 30px 0 20px; color: #1F2937;">Tactics Coverage</h3>
    ${entries.join('')}`;
}

function generateTechniquesTable(techniques: { [key: string]: number }): string {
    const maxCount = Math.max(...Object.values(techniques));
    const entries = Object.entries(techniques)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([technique, count]) => {
            const percentage = Math.round((count / maxCount) * 100);
            return `
            <div style="padding: 12px 0; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center; justify-content: space-between;">
                <div style="flex: 1;">${technique}</div>
                <div style="margin: 0 16px;">${count} detections</div>
                <div style="width: 120px; height: 8px; background: #f3f4f6; border-radius: 4px; overflow: hidden;">
                    <div style="width: ${percentage}%; height: 100%; background: #6d28d9; border-radius: 4px;"></div>
                </div>
            </div>`;
        });

    return `
    <h3 style="margin: 30px 0 20px; color: #1F2937;">Most Detected Techniques</h3>
    ${entries.join('')}`;
}

export function generateMitreAnalysis(summary: GroupSummary): string {
    const coverage = Math.round((Object.keys(summary.mitreCoverage.tactics).length / 12) * 100);
    const tacticsCount = Object.keys(summary.mitreCoverage.tactics).length;
    const techniquesCount = Object.keys(summary.mitreCoverage.techniques).length;
    
    return `
    <div style="display: flex; align-items: center; margin-bottom: 24px;">
        <div style="
            width: 40px;
            height: 40px;
            border-radius: 8px;
            background: #6d28d9;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
        ">
            <svg style="width: 24px; height: 24px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
        </div>
        <h2 style="color: #1F2937; margin: 0;">MITRE ATT&CK Analysis</h2>
    </div>

    ${generateMetricsGrid(coverage, tacticsCount, techniquesCount)}
    ${generateTacticsTable(summary.mitreCoverage.tactics)}
    ${generateTechniquesTable(summary.mitreCoverage.techniques)}`;
}
