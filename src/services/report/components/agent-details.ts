import {AgentSummary} from '../summary';
import {Hit} from '@/types/wql';

function generateAlertTimeline(alerts: Hit[]): string {
    // Process alerts in smaller groups
    const alertsPerGroup = 5; // Show 5 alerts per group
    const alertGroups = [];
    
    for (let i = 0; i < alerts.length; i += alertsPerGroup) {
        const groupAlerts = alerts.slice(i, i + alertsPerGroup);
        const groupHtml = `
        <div class="content-section alert-section">
            ${i === 0 ? '<h4>Recent Alerts Timeline</h4>' : ''}
            <div class="alert-list">
                ${groupAlerts.map(alert => `
                <div class="alert-item" style="
                    background: ${alert._source.rule.level >= 12 ? '#fee2e2' : 
                               alert._source.rule.level >= 8 ? '#ffedd5' : 
                               alert._source.rule.level >= 4 ? '#fef3c7' : '#f3f4f6'};
                ">
                    <div class="alert-icon" style="
                        color: ${alert._source.rule.level >= 12 ? '#dc2626' : 
                               alert._source.rule.level >= 8 ? '#ea580c' : 
                               alert._source.rule.level >= 4 ? '#ca8a04' : '#6b7280'};
                    ">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                        </svg>
                    </div>
                    <div class="alert-content">
                        <div class="alert-header">
                            <span class="alert-description">${alert._source.rule.description}</span>
                            <span class="alert-level" style="
                                color: ${alert._source.rule.level >= 12 ? '#991b1b' : 
                                       alert._source.rule.level >= 8 ? '#9a3412' : 
                                       alert._source.rule.level >= 4 ? '#854d0e' : '#374151'};
                            ">Level ${alert._source.rule.level}</span>
                        </div>
                        <div class="alert-meta">
                            <span>${new Date(alert._source.timestamp).toLocaleString()}</span>
                            <span>Rule ID: ${alert._source.rule.id}</span>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>`;
        alertGroups.push(groupHtml);
    }

    return alertGroups.join('\n');
}

function generateRuleDistribution(agent: AgentSummary): string {
    return `
    <div class="content-section">
        <h4>Top Triggered Rules</h4>
        <div class="rule-list">
            ${agent.topRules.map(rule => `
            <div class="rule-item">
                <div class="rule-header">
                    <span class="rule-description">${rule.description}</span>
                    <span class="rule-level" style="
                        background: ${rule.level >= 12 ? '#fee2e2' : 
                                   rule.level >= 8 ? '#ffedd5' : 
                                   rule.level >= 4 ? '#fef3c7' : '#f3f4f6'};
                        color: ${rule.level >= 12 ? '#991b1b' : 
                               rule.level >= 8 ? '#9a3412' : 
                               rule.level >= 4 ? '#854d0e' : '#374151'};
                    ">Level ${rule.level}</span>
                </div>
                <div class="rule-meta">
                    <span>Rule ID: ${rule.id}</span>
                    <span>Groups: ${rule.groups.join(', ')}</span>
                </div>
            </div>
            `).join('')}
        </div>
    </div>`;
}

function generateMitreOverview(agent: AgentSummary): string {
    const { tactics, techniques } = agent.mitreAttacks;
    const maxTacticCount = Math.max(...Object.values(tactics));
    const maxTechniqueCount = Math.max(...Object.values(techniques));

    return `
    <div class="content-section">
        <h4>MITRE ATT&CK Coverage</h4>
        <div class="mitre-grid">
            <div>
                <h5>Top Tactics</h5>
                ${Object.entries(tactics).slice(0, 5).map(([tactic, count]) => `
                <div class="metric-item">
                    <div class="metric-header">
                        <span>${tactic}</span>
                        <span>${count}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-bar-fill" style="width: ${(count / maxTacticCount) * 100}%;"></div>
                    </div>
                </div>
                `).join('')}
            </div>
            <div>
                <h5>Top Techniques</h5>
                ${Object.entries(techniques).slice(0, 5).map(([technique, count]) => `
                <div class="metric-item">
                    <div class="metric-header">
                        <span>${technique}</span>
                        <span>${count}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-bar-fill" style="width: ${(count / maxTechniqueCount) * 100}%;"></div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </div>`;
}

export function generateAgentDetails(agent: AgentSummary): string {
    const headerSection = `
        <div class="agent-header">
            <div class="agent-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
            </div>
            <div>
                <h2>Agent: ${agent.name}</h2>
                <p>ID: ${agent.id}</p>
            </div>
        </div>`;

    const metricsSection = `
        <div class="agent-metrics">
            <div class="metric-box">
                <h3>Total Alerts</h3>
                <p>${agent.totalAlerts}</p>
            </div>

            <div class="metric-box">
                <h3>Critical Alerts</h3>
                <p class="critical">${agent.severityDistribution[12] || 0}</p>
            </div>

            <div class="metric-box">
                <h3>High Alerts</h3>
                <p class="high">${agent.severityDistribution[8] || 0}</p>
            </div>
        </div>`;

    return `
    <div class="agent-details new-agent-page">
        ${headerSection}
        ${metricsSection}
        ${generateAlertTimeline(agent.recentAlerts)}
        ${generateRuleDistribution(agent)}
        ${generateMitreOverview(agent)}
    </div>`;
}
