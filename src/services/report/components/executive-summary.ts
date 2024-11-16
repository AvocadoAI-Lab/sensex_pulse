import {GroupSummary} from '../summary';

interface SecurityScore {
    score: number;
    label: string;
    color: string;
    gradient: string;
    iconPath: string;
}

function calculateSecurityScore(summary: GroupSummary): SecurityScore {
    const criticalVulns = summary.criticalVulnerabilities.length;
    const severityDistribution = summary.overallSeverityDistribution;
    
    const highSeverityAlerts = severityDistribution[12] || 0 + (severityDistribution[15] || 0);
    const mediumSeverityAlerts = severityDistribution[8] || 0 + (severityDistribution[10] || 0);
    
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
            gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        };
    } else if (score >= 80) {
        return {
            score,
            label: 'Good',
            color: '#2563eb',
            gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            iconPath: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
        };
    } else if (score >= 70) {
        return {
            score,
            label: 'Fair',
            color: '#d97706',
            gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
            iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
        };
    } else if (score >= 60) {
        return {
            score,
            label: 'Needs Improvement',
            color: '#dc2626',
            gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            iconPath: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        };
    } else {
        return {
            score,
            label: 'Critical',
            color: '#7f1d1d',
            gradient: 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)',
            iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
        };
    }
}

function generateScoreGauge(score: SecurityScore): string {
    const rotation = (score.score / 100) * 180;
    return `
    <div style="position: relative; width: 200px; height: 100px; margin: 0 auto;">
        <!-- Score Display -->
        <div style="
            position: absolute;
            bottom: 0;
            width: 100%;
            text-align: center;
        ">
            <div style="font-size: 36px; font-weight: 700; color: ${score.color};">${score.score}</div>
            <div style="font-size: 14px; color: #4b5563;">${score.label}</div>
        </div>
        <!-- Gauge Needle -->
        <div style="
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 2px;
            height: 60px;
            background-color: #1f2937;
            transform-origin: bottom;
            transform: translateX(-50%) rotate(${rotation - 90}deg);
            border-radius: 1px;
        "></div>
    </div>`;
}

function generateKeyFindings(summary: GroupSummary): string {
    const findings = [];

    if (summary.criticalVulnerabilities.length > 0) {
        findings.push(`
        <div style="
            position: relative;
            background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 16px;
            border: 1px solid #fca5a5;
        ">
            <div style="display: flex; align-items: start;">
                <div style="
                    width: 40px;
                    height: 40px;
                    background: rgba(220, 38, 38, 0.1);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 16px;
                ">
                    <svg style="width: 24px; height: 24px; color: #dc2626;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                </div>
                <div>
                    <h4 style="font-size: 18px; font-weight: 600; color: #991b1b; margin-bottom: 8px;">
                        Critical Vulnerabilities Detected
                    </h4>
                    <p style="font-size: 14px; color: #b91c1c;">
                        Found ${summary.criticalVulnerabilities.length} critical vulnerabilities that require immediate attention.
                    </p>
                </div>
            </div>
        </div>`);
    }

    const highSeverityCount = summary.overallSeverityDistribution[12] || 0 + (summary.overallSeverityDistribution[15] || 0);
    if (highSeverityCount > 0) {
        findings.push(`
        <div style="
            position: relative;
            background: linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%);
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 16px;
            border: 1px solid #fdba74;
        ">
            <div style="display: flex; align-items: start;">
                <div style="
                    width: 40px;
                    height: 40px;
                    background: rgba(234, 88, 12, 0.1);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 16px;
                ">
                    <svg style="width: 24px; height: 24px; color: #ea580c;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <div>
                    <h4 style="font-size: 18px; font-weight: 600; color: #9a3412; margin-bottom: 8px;">
                        High Severity Alerts
                    </h4>
                    <p style="font-size: 14px; color: #c2410c;">
                        Detected ${highSeverityCount} high severity security alerts that should be investigated.
                    </p>
                </div>
            </div>
        </div>`);
    }

    const tacticsCovered = Object.keys(summary.mitreCoverage.tactics).length;
    findings.push(`
    <div style="
        position: relative;
        background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 16px;
        border: 1px solid #93c5fd;
    ">
        <div style="display: flex; align-items: start;">
            <div style="
                width: 40px;
                height: 40px;
                background: rgba(37, 99, 235, 0.1);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 16px;
            ">
                <svg style="width: 24px; height: 24px; color: #2563eb;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
            </div>
            <div>
                <h4 style="font-size: 18px; font-weight: 600; color: #1e40af; margin-bottom: 8px;">
                    MITRE ATT&CK Coverage
                </h4>
                <p style="font-size: 14px; color: #1d4ed8;">
                    Security monitoring covers ${tacticsCovered} MITRE ATT&CK tactics.
                </p>
            </div>
        </div>
    </div>`);

    return findings.join('\n');
}

export function generateExecutiveSummary(summary: GroupSummary): string {
    const securityScore = calculateSecurityScore(summary);
    
    return `
    <div style="padding: 48px; height: 100%; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);">
        <div style="max-width: 800px; margin: 0 auto;">
            <!-- Header -->
            <div style="display: flex; align-items: center; margin-bottom: 48px;">
                <div style="
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    background: ${securityScore.gradient};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 16px;
                ">
                    <svg style="width: 24px; height: 24px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${securityScore.iconPath}"/>
                    </svg>
                </div>
                <h2 style="font-size: 32px; font-weight: 700; color: #1f2937;">Executive Summary</h2>
            </div>

            <!-- Metrics Grid -->
            <div style="
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 24px;
                margin-bottom: 48px;
            ">
                <!-- Security Score -->
                <div style="
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                ">
                    <h3 style="font-size: 16px; font-weight: 500; color: #6b7280; margin-bottom: 16px;">
                        Security Score
                    </h3>
                    ${generateScoreGauge(securityScore)}
                </div>

                <!-- Monitored Agents -->
                <div style="
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                ">
                    <h3 style="font-size: 16px; font-weight: 500; color: #6b7280; margin-bottom: 16px;">
                        Monitored Agents
                    </h3>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div style="
                            width: 48px;
                            height: 48px;
                            background: #dbeafe;
                            border-radius: 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">
                            <svg style="width: 24px; height: 24px; color: #2563eb;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                            </svg>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 32px; font-weight: 700; color: #1f2937;">
                                ${summary.totalAgents}
                            </div>
                            <div style="font-size: 14px; color: #6b7280;">Active agents</div>
                        </div>
                    </div>
                </div>

                <!-- Total Alerts -->
                <div style="
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                ">
                    <h3 style="font-size: 16px; font-weight: 500; color: #6b7280; margin-bottom: 16px;">
                        Total Alerts
                    </h3>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div style="
                            width: 48px;
                            height: 48px;
                            background: #f5d0fe;
                            border-radius: 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">
                            <svg style="width: 24px; height: 24px; color: #c026d3;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M13 10V3L4 14h7v7l9-11h-7z"/>
                            </svg>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 32px; font-weight: 700; color: #1f2937;">
                                ${summary.totalAlerts}
                            </div>
                            <div style="font-size: 14px; color: #6b7280;">Security events</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Key Findings -->
            <div style="margin-top: 48px;">
                <h3 style="font-size: 24px; font-weight: 600; color: #1f2937; margin-bottom: 24px;">
                    Key Findings
                </h3>
                ${generateKeyFindings(summary)}
            </div>
        </div>
    </div>`;
}
