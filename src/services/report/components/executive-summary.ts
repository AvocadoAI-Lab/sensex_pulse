import {GroupSummary} from '../summary';

interface SecurityScore {
    score: number;
    label: string;
    color: string;
    iconPath: string;
}

function calculateSecurityScore(summary: GroupSummary): SecurityScore {
    const criticalVulns = summary.criticalVulnerabilities.length;
    const severityDistribution = summary.overallSeverityDistribution;
    
    const highSeverityAlerts = severityDistribution[12] || (severityDistribution[15] || 0);
    const mediumSeverityAlerts = severityDistribution[8] || (severityDistribution[10] || 0);
    
    let score = 100;
    score -= (criticalVulns * 10);
    score -= (highSeverityAlerts * 5);
    score -= (mediumSeverityAlerts * 2);
    score = Math.max(0, Math.min(100, score));
    
    if (score >= 90) {
        return {
            score,
            label: 'Excellent',
            color: '#059669',
            iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        };
    } else if (score >= 80) {
        return {
            score,
            label: 'Good',
            color: '#2563eb',
            iconPath: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
        };
    } else if (score >= 70) {
        return {
            score,
            label: 'Fair',
            color: '#d97706',
            iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
        };
    } else if (score >= 60) {
        return {
            score,
            label: 'Needs Improvement',
            color: '#dc2626',
            iconPath: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        };
    } else {
        return {
            score,
            label: 'Critical',
            color: '#7f1d1d',
            iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
        };
    }
}

export function generateExecutiveSummary(summary: GroupSummary): string {
    const securityScore = calculateSecurityScore(summary);
    const highSeverityCount = summary.overallSeverityDistribution[12] || (summary.overallSeverityDistribution[15] || 0);
    const tacticsCovered = Object.keys(summary.mitreCoverage.tactics).length;
    
    return `
    <h2>Executive Summary</h2>

    <div class="metrics-grid">
        <!-- Security Score -->
        <div class="metric-box critical">
            <h3>Security Score</h3>
            <div class="metric-value">${securityScore.score}</div>
            <div class="metric-subtext">${securityScore.label}</div>
        </div>

        <!-- Agents Status -->
        <div class="metric-box active">
            <h3>Agents Status</h3>
            <div class="metric-value">${summary.totalAgents}</div>
            <div class="metric-subtext">Active Agents</div>
        </div>

        <!-- Total Alerts -->
        <div class="metric-box events">
            <h3>Total Alerts</h3>
            <div class="metric-value">${summary.totalAlerts}</div>
            <div class="metric-subtext">Security Events</div>
        </div>
    </div>

    <h3>Key Findings</h3>
    
    <div class="alert-list">
        ${summary.criticalVulnerabilities.length > 0 ? `
        <div class="alert-item">
            <div class="alert-header">
                <div class="alert-description">Critical Vulnerabilities Detected</div>
                <div class="alert-level" style="background: #fee2e2; color: #991b1b;">Critical</div>
            </div>
            <div class="alert-meta">
                Found ${summary.criticalVulnerabilities.length} critical vulnerabilities that require immediate attention
            </div>
        </div>
        ` : ''}

        ${highSeverityCount > 0 ? `
        <div class="alert-item">
            <div class="alert-header">
                <div class="alert-description">High Severity Alerts</div>
                <div class="alert-level" style="background: #ffedd5; color: #9a3412;">High</div>
            </div>
            <div class="alert-meta">
                Detected ${highSeverityCount} high severity security alerts that should be investigated
            </div>
        </div>
        ` : ''}

        <div class="alert-item">
            <div class="alert-header">
                <div class="alert-description">MITRE ATT&CK Coverage</div>
                <div class="alert-level" style="background: #dbeafe; color: #1e40af;">Info</div>
            </div>
            <div class="alert-meta">
                Security monitoring covers ${tacticsCovered} MITRE ATT&CK tactics
            </div>
        </div>
    </div>`;
}
