import {AgentSummary} from '../summary';
import type {Hit} from '../../../types/wql';

function generateAlertTimeline(alerts: Hit[]): string {
    const alertsPerGroup = 5; // Show 5 alerts per group
    const alertGroups = [];
    
    for (let i = 0; i < alerts.length; i += alertsPerGroup) {
        const groupAlerts = alerts.slice(i, i + alertsPerGroup);
        const groupHtml = `
        <section class="alert-section">
            ${i === 0 ? '<h3>Recent Alerts Timeline</h3>' : ''}
            <div class="alert-list">
                ${groupAlerts.map(alert => `
                <div class="alert-item" style="
                    background: ${alert._source.rule.level >= 12 ? '#fee2e2' : 
                               alert._source.rule.level >= 8 ? '#ffedd5' : 
                               alert._source.rule.level >= 4 ? '#fef3c7' : '#f3f4f6'};
                ">
                    <div class="alert-header">
                        <span class="alert-description">${alert._source.rule.description}</span>
                        <span class="alert-level" style="
                            background: white;
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
                `).join('')}
            </div>
        </section>`;
        alertGroups.push(groupHtml);
    }

    return alertGroups.join('\n');
}

function generateRuleDistribution(agent: AgentSummary): string {
    return `
    <section class="rule-section">
        <h3>Top Triggered Rules</h3>
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
    </section>`;
}

function generateMitreOverview(agent: AgentSummary): string {
    const { tactics, techniques } = agent.mitreAttacks;
    const maxTacticCount = Math.max(...Object.values(tactics));
    const maxTechniqueCount = Math.max(...Object.values(techniques));

    return `
    <section class="mitre-section">
        <h3>MITRE ATT&CK Coverage</h3>
        <div class="metrics-grid">
            <div>
                <h4>Top Tactics</h4>
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
                <h4>Top Techniques</h4>
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
    </section>`;
}

export function generateAgentDetails(agent: AgentSummary): string {
    const headerSection = `
        <header class="agent-header">
            <h2>Agent: ${agent.name}</h2>
            <p>ID: ${agent.id}</p>
        </header>`;

    const metricsSection = `
        <div class="metrics-grid">
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
        ${headerSection}
        ${metricsSection}
        ${generateAlertTimeline(agent.recentAlerts)}
        ${generateRuleDistribution(agent)}
        ${generateMitreOverview(agent)}`;
}
