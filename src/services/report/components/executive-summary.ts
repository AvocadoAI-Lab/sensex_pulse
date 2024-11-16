import {GroupSummary} from '../summary';

interface SecurityScore {
    score: number;
    label: string;
    color: string;
}

function calculateSecurityScore(summary: GroupSummary): SecurityScore {
    // Calculate a score based on various factors
    const criticalVulns = summary.criticalVulnerabilities.length;
    const severityDistribution = summary.overallSeverityDistribution;
    
    // Weight factors
    const highSeverityAlerts = severityDistribution[12] || 0 + (severityDistribution[15] || 0);
    const mediumSeverityAlerts = severityDistribution[8] || 0 + (severityDistribution[10] || 0);
    
    // Calculate base score (100 is best)
    let score = 100;
    
    // Deduct points for issues
    score -= (criticalVulns * 10); // -10 points per critical vulnerability
    score -= (highSeverityAlerts * 5); // -5 points per high severity alert
    score -= (mediumSeverityAlerts * 2); // -2 points per medium severity alert
    
    // Ensure score stays within 0-100
    score = Math.max(0, Math.min(100, score));
    
    // Determine label and color based on score
    if (score >= 90) {
        return { score, label: 'Excellent', color: 'text-green-600' };
    } else if (score >= 80) {
        return { score, label: 'Good', color: 'text-blue-600' };
    } else if (score >= 70) {
        return { score, label: 'Fair', color: 'text-yellow-600' };
    } else if (score >= 60) {
        return { score, label: 'Needs Improvement', color: 'text-orange-600' };
    } else {
        return { score, label: 'Critical', color: 'text-red-600' };
    }
}

function generateKeyFindings(summary: GroupSummary): string {
    const findings = [];

    // Add critical vulnerabilities finding if any exist
    if (summary.criticalVulnerabilities.length > 0) {
        findings.push(`
        <div class="mb-4">
            <h4 class="font-semibold text-red-600">Critical Vulnerabilities Detected</h4>
            <p class="text-gray-700">Found ${summary.criticalVulnerabilities.length} critical vulnerabilities that require immediate attention.</p>
        </div>`);
    }

    // Add high severity alerts finding if any exist
    const highSeverityCount = summary.overallSeverityDistribution[12] || 0 + (summary.overallSeverityDistribution[15] || 0);
    if (highSeverityCount > 0) {
        findings.push(`
        <div class="mb-4">
            <h4 class="font-semibold text-orange-600">High Severity Alerts</h4>
            <p class="text-gray-700">Detected ${highSeverityCount} high severity security alerts that should be investigated.</p>
        </div>`);
    }

    // Add MITRE ATT&CK coverage finding
    const tacticsCovered = Object.keys(summary.mitreCoverage.tactics).length;
    findings.push(`
    <div class="mb-4">
        <h4 class="font-semibold text-blue-600">MITRE ATT&CK Coverage</h4>
        <p class="text-gray-700">Security monitoring covers ${tacticsCovered} MITRE ATT&CK tactics.</p>
    </div>`);

    return findings.join('\n');
}

export function generateExecutiveSummary(summary: GroupSummary): string {
    const securityScore = calculateSecurityScore(summary);
    
    return `
    <div class="w-full min-h-[297mm] bg-white p-12">
        <div class="max-w-4xl mx-auto">
            <h2 class="text-3xl font-bold mb-8">Executive Summary</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div class="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                    <h3 class="text-lg font-medium text-gray-800 mb-2">Security Score</h3>
                    <div class="flex items-baseline">
                        <span class="text-4xl font-bold ${securityScore.color}">${securityScore.score}</span>
                        <span class="ml-2 text-gray-600">/100</span>
                    </div>
                    <p class="mt-2 text-sm ${securityScore.color} font-medium">${securityScore.label}</p>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                    <h3 class="text-lg font-medium text-gray-800 mb-2">Monitored Agents</h3>
                    <div class="text-4xl font-bold text-blue-600">${summary.totalAgents}</div>
                    <p class="mt-2 text-sm text-gray-600">Active security monitoring</p>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                    <h3 class="text-lg font-medium text-gray-800 mb-2">Total Alerts</h3>
                    <div class="text-4xl font-bold text-purple-600">${summary.totalAlerts}</div>
                    <p class="mt-2 text-sm text-gray-600">Security events detected</p>
                </div>
            </div>

            <div class="bg-gray-50 p-8 rounded-lg shadow-lg mb-12">
                <h3 class="text-xl font-semibold mb-6">Key Findings</h3>
                ${generateKeyFindings(summary)}
            </div>

            <div class="bg-blue-50 p-8 rounded-lg shadow-lg">
                <h3 class="text-xl font-semibold mb-6">Recommendations</h3>
                <ul class="space-y-4 text-gray-700">
                    ${summary.criticalVulnerabilities.length > 0 ? `
                    <li class="flex items-start">
                        <span class="text-red-500 mr-2">•</span>
                        Prioritize patching of ${summary.criticalVulnerabilities.length} critical vulnerabilities
                    </li>` : ''}
                    ${Object.entries(summary.overallSeverityDistribution)
                        .filter(([level, count]) => parseInt(level) >= 12 && count > 0)
                        .map(([level, count]) => `
                    <li class="flex items-start">
                        <span class="text-orange-500 mr-2">•</span>
                        Investigate ${count} high severity alerts (level ${level}) and implement necessary security controls
                    </li>`).join('')}
                    <li class="flex items-start">
                        <span class="text-blue-500 mr-2">•</span>
                        Regular security assessments and monitoring of all ${summary.totalAgents} agents
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="page-break"></div>`;
}
