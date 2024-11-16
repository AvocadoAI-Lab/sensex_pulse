import {AgentSummary, GroupSummary} from './summary';

export class ReportTemplateService {
    private static generateHeader(groupName: string): string {
        return `
        <header class="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
            <h1 class="text-3xl font-bold">${groupName} Security Report</h1>
            <p class="text-sm mt-2">Generated on ${new Date().toLocaleString()}</p>
        </header>`;
    }

    private static generateOverview(summary: GroupSummary): string {
        return `
        <section class="p-8 bg-white shadow-lg rounded-lg m-8">
            <h2 class="text-2xl font-semibold mb-6">Overview</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-blue-50 p-6 rounded-lg">
                    <h3 class="text-lg font-medium text-blue-800">Total Agents</h3>
                    <p class="text-3xl font-bold text-blue-600">${summary.totalAgents}</p>
                </div>
                <div class="bg-blue-50 p-6 rounded-lg">
                    <h3 class="text-lg font-medium text-blue-800">Total Alerts</h3>
                    <p class="text-3xl font-bold text-blue-600">${summary.totalAlerts}</p>
                </div>
                <div class="bg-red-50 p-6 rounded-lg">
                    <h3 class="text-lg font-medium text-red-800">Critical Vulnerabilities</h3>
                    <p class="text-3xl font-bold text-red-600">${summary.criticalVulnerabilities.length}</p>
                </div>
            </div>
        </section>`;
    }

    private static generateSeverityDistribution(distribution: { [key: number]: number }): string {
        const severityLabels: { [key: number]: string } = {
            0: 'Info',
            1: 'Low',
            2: 'Medium',
            3: 'High',
            4: 'Critical'
        };

        const items = Object.entries(distribution).map(([level, count]) => {
            const numLevel = Number(level);
            return `
            <div class="flex items-center justify-between p-4 border-b">
                <span class="font-medium ${this.getSeverityClass(numLevel)}">
                    ${severityLabels[numLevel] || `Level ${numLevel}`}
                </span>
                <span class="text-gray-600">${count}</span>
            </div>`;
        }).join('');

        return `
        <section class="p-8 bg-white shadow-lg rounded-lg m-8">
            <h2 class="text-2xl font-semibold mb-6">Severity Distribution</h2>
            <div class="bg-white rounded-lg">
                ${items}
            </div>
        </section>`;
    }

    private static generateAgentSummaries(agents: AgentSummary[]): string {
        return `
        <section class="p-8 bg-white shadow-lg rounded-lg m-8">
            <h2 class="text-2xl font-semibold mb-6">Agent Summaries</h2>
            <div class="grid grid-cols-1 gap-6">
                ${agents.map(agent => this.generateAgentCard(agent)).join('')}
            </div>
        </section>`;
    }

    private static generateAgentCard(agent: AgentSummary): string {
        const recentAlerts = agent.recentAlerts.map(alert => `
            <div class="p-4 border-b last:border-b-0">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="font-medium">${alert._source.rule.description}</p>
                        <p class="text-sm text-gray-600 mt-1">${new Date(alert._source.timestamp).toLocaleString()}</p>
                    </div>
                    <span class="${this.getSeverityClass(alert._source.rule.level)} px-2 py-1 rounded text-sm">
                        Level ${alert._source.rule.level}
                    </span>
                </div>
            </div>
        `).join('');

        return `
        <div class="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
            <div class="bg-gray-100 p-6">
                <h3 class="text-xl font-semibold">${agent.name}</h3>
                <p class="text-gray-600">ID: ${agent.id}</p>
                <p class="text-gray-600 mt-2">Total Alerts: ${agent.totalAlerts}</p>
            </div>
            <div class="p-6">
                <h4 class="font-medium mb-4">Recent Alerts</h4>
                <div class="bg-white rounded-lg border border-gray-200">
                    ${recentAlerts}
                </div>
            </div>
        </div>`;
    }

    private static generateVulnerabilities(vulnerabilities: GroupSummary['criticalVulnerabilities']): string {
        if (vulnerabilities.length === 0) {
            return '';
        }

        const vulnItems = vulnerabilities.map(vuln => `
            <div class="bg-white p-6 rounded-lg border border-red-200 mb-4">
                <div class="flex justify-between items-start">
                    <h4 class="text-lg font-medium text-red-800">${vuln.cve}</h4>
                    <span class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                        ${vuln.severity}
                    </span>
                </div>
                <p class="mt-2">${vuln.title}</p>
                <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="font-medium">Package:</span> ${vuln.package.name}
                    </div>
                    <div>
                        <span class="font-medium">Version:</span> ${vuln.package.version}
                    </div>
                </div>
                <p class="mt-4 text-sm text-gray-600">${vuln.rationale}</p>
            </div>
        `).join('');

        return `
        <section class="p-8 bg-white shadow-lg rounded-lg m-8">
            <h2 class="text-2xl font-semibold mb-6">Critical Vulnerabilities</h2>
            ${vulnItems}
        </section>`;
    }

    private static generateMitreCoverage(mitreCoverage: GroupSummary['mitreCoverage']): string {
        const tactics = Object.entries(mitreCoverage.tactics)
            .map(([tactic, count]) => `
                <div class="flex justify-between items-center p-4 border-b last:border-b-0">
                    <span class="font-medium">${tactic}</span>
                    <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">${count}</span>
                </div>
            `).join('');

        return `
        <section class="p-8 bg-white shadow-lg rounded-lg m-8">
            <h2 class="text-2xl font-semibold mb-6">MITRE ATT&CK Coverage</h2>
            <div class="bg-white rounded-lg border border-gray-200">
                ${tactics}
            </div>
        </section>`;
    }

    private static getSeverityClass(level: number): string {
        switch (true) {
            case level >= 15:
                return 'text-red-800 bg-red-100';
            case level >= 12:
                return 'text-orange-800 bg-orange-100';
            case level >= 8:
                return 'text-yellow-800 bg-yellow-100';
            case level >= 4:
                return 'text-blue-800 bg-blue-100';
            default:
                return 'text-gray-800 bg-gray-100';
        }
    }

    public static generateTemplate(summary: GroupSummary): string {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${summary.groupName} Security Report</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                @page {
                    margin: 0;
                }
                body {
                    background-color: #f3f4f6;
                    font-family: system-ui, -apple-system, sans-serif;
                }
            </style>
        </head>
        <body>
            ${this.generateHeader(summary.groupName)}
            ${this.generateOverview(summary)}
            ${this.generateSeverityDistribution(summary.overallSeverityDistribution)}
            ${this.generateMitreCoverage(summary.mitreCoverage)}
            ${this.generateVulnerabilities(summary.criticalVulnerabilities)}
            ${this.generateAgentSummaries(summary.agentSummaries)}
        </body>
        </html>`;
    }
}
