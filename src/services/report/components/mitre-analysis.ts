import {GroupSummary} from '../summary';

function generateCoverageDisplay(coverage: number): string {
    const color = '#6d28d9';
    
    return `
    <div style="text-align: center; padding: 20px;">
        <div style="
            font-size: 48px;
            font-weight: 700;
            color: ${color};
            margin-bottom: 8px;
        ">${coverage}%</div>
        <div style="
            font-size: 18px;
            color: ${color};
            font-weight: 500;
        ">Framework Coverage</div>
        <div style="
            width: 100%;
            height: 8px;
            background: #f3f4f6;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 16px;
        ">
            <div style="
                width: ${coverage}%;
                height: 100%;
                background: linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%);
                border-radius: 4px;
            "></div>
        </div>
    </div>`;
}

function generateMetricDisplay(value: number, label: string): string {
    return `
    <div style="text-align: center; padding: 20px;">
        <div style="
            font-size: 48px;
            font-weight: 700;
            color: #6d28d9;
            margin-bottom: 8px;
        ">${value}</div>
        <div style="
            font-size: 18px;
            color: #6d28d9;
            font-weight: 500;
        ">${label}</div>
    </div>`;
}

function generateTacticsTable(tactics: { [key: string]: number }): string {
    const maxCount = Math.max(...Object.values(tactics));
    const entries = Object.entries(tactics)
        .sort((a, b) => b[1] - a[1])
        .map(([tactic, count]) => {
            const percentage = Math.round((count / maxCount) * 100);
            return `
            <tr>
                <td style="font-weight: 500; padding: 12px 0;">${tactic}</td>
                <td style="width: 100px; text-align: right; padding: 12px 0;">${count} alerts</td>
                <td style="width: 200px; padding: 12px 0 12px 24px;">
                    <div style="
                        width: 100%;
                        height: 8px;
                        background: #f3f4f6;
                        border-radius: 4px;
                        overflow: hidden;
                    ">
                        <div style="
                            width: ${percentage}%;
                            height: 100%;
                            background: linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%);
                            border-radius: 4px;
                        "></div>
                    </div>
                </td>
            </tr>`;
        });

    return `
    <div style="margin-top: 16px;">
        <table style="width: 100%; border-collapse: collapse;">
            <tbody>
                ${entries.join('')}
            </tbody>
        </table>
    </div>`;
}

function generateTechniquesTable(techniques: { [key: string]: number }): string {
    const maxCount = Math.max(...Object.values(techniques));
    const entries = Object.entries(techniques)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([technique, count]) => {
            const percentage = Math.round((count / maxCount) * 100);
            return `
            <tr>
                <td style="font-weight: 500; padding: 12px 0;">${technique}</td>
                <td style="width: 100px; text-align: right; padding: 12px 0;">${count} detections</td>
                <td style="width: 200px; padding: 12px 0 12px 24px;">
                    <div style="
                        width: 100%;
                        height: 8px;
                        background: #f3f4f6;
                        border-radius: 4px;
                        overflow: hidden;
                    ">
                        <div style="
                            width: ${percentage}%;
                            height: 100%;
                            background: linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%);
                            border-radius: 4px;
                        "></div>
                    </div>
                </td>
            </tr>`;
        });

    return `
    <div style="margin-top: 16px;">
        <table style="width: 100%; border-collapse: collapse;">
            <tbody>
                ${entries.join('')}
            </tbody>
        </table>
    </div>`;
}

export function generateMitreAnalysis(summary: GroupSummary): string {
    const coverage = Math.round((Object.keys(summary.mitreCoverage.tactics).length / 12) * 100);
    const tacticsCount = Object.keys(summary.mitreCoverage.tactics).length;
    const techniquesCount = Object.keys(summary.mitreCoverage.techniques).length;
    
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
                <!-- Framework Coverage -->
                <div style="
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    border: 1px solid #e5e7eb;
                ">
                    <h3 style="font-size: 16px; font-weight: 500; color: #6b7280; margin-bottom: 16px;">
                        Framework Coverage
                    </h3>
                    ${generateCoverageDisplay(coverage)}
                </div>

                <!-- Tactics Monitored -->
                <div style="
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    border: 1px solid #e5e7eb;
                ">
                    <h3 style="font-size: 16px; font-weight: 500; color: #6b7280; margin-bottom: 16px;">
                        Tactics Monitored
                    </h3>
                    ${generateMetricDisplay(tacticsCount, 'of 12 Total Tactics')}
                </div>

                <!-- Techniques Detected -->
                <div style="
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    border: 1px solid #e5e7eb;
                ">
                    <h3 style="font-size: 16px; font-weight: 500; color: #6b7280; margin-bottom: 16px;">
                        Techniques Detected
                    </h3>
                    ${generateMetricDisplay(techniquesCount, 'Unique Techniques')}
                </div>
            </div>

            <!-- Detailed Analysis -->
            <div style="
                display: grid;
                gap: 24px;
            ">
                <!-- Tactics Coverage -->
                <div style="
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    border: 1px solid #e5e7eb;
                ">
                    <h4 style="font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 24px;">
                        Tactics Coverage
                    </h4>
                    ${generateTacticsTable(summary.mitreCoverage.tactics)}
                </div>

                <!-- Most Detected Techniques -->
                <div style="
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    border: 1px solid #e5e7eb;
                ">
                    <h4 style="font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 24px;">
                        Most Detected Techniques
                    </h4>
                    ${generateTechniquesTable(summary.mitreCoverage.techniques)}
                </div>
            </div>
        </div>
    </div>`;
}
