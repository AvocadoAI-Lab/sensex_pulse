import {AgentSummary} from '../summary';
import type {Hit} from '@/types/wql';

export function hasAgentData(agent: AgentSummary): boolean {
    // Check if agent has any meaningful data
    const hasAlerts = agent.totalAlerts > 0 || 
                     (agent.severityDistribution[12] || 0) > 0 || 
                     (agent.severityDistribution[8] || 0) > 0;
    const hasRecentAlerts = agent.recentAlerts && agent.recentAlerts.length > 0;
    const hasTopRules = agent.topRules && agent.topRules.length > 0;
    const hasMitreData = agent.mitreAttacks.tactics && 
                        Object.keys(agent.mitreAttacks.tactics).length > 0 &&
                        agent.mitreAttacks.techniques &&
                        Object.keys(agent.mitreAttacks.techniques).length > 0;

    return hasAlerts || hasRecentAlerts || hasTopRules || hasMitreData;
}

function generateMetricsGrid(agent: AgentSummary): string | null {
    const totalAlerts = agent.totalAlerts;
    const criticalAlerts = agent.severityDistribution[12] || 0;
    const highAlerts = agent.severityDistribution[8] || 0;

    if (totalAlerts === 0 && criticalAlerts === 0 && highAlerts === 0) {
        return null;
    }

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
    `;

    const subtextStyle = `
        color: #4B5563;
        font-size: 12px;
        font-weight: normal;
    `;

    return `
    <div style="display: flex; gap: 16px; margin-bottom: 32px;">
        <div style="${metricBoxStyle}">
            <div style="${titleStyle}">TOTAL ALERTS</div>
            <div style="${valueStyle}">${totalAlerts}</div>
            <div style="${subtextStyle}">All Alerts</div>
        </div>

        <div style="${metricBoxStyle}">
            <div style="${titleStyle}">CRITICAL ALERTS</div>
            <div style="${valueStyle}; color: #DC2626;">${criticalAlerts}</div>
            <div style="${subtextStyle}">Critical Issues</div>
        </div>

        <div style="${metricBoxStyle}">
            <div style="${titleStyle}">HIGH ALERTS</div>
            <div style="${valueStyle}; color: #EA580C;">${highAlerts}</div>
            <div style="${subtextStyle}">High Issues</div>
        </div>
    </div>`;
}

function generateAlertTimeline(alerts: Hit[]): string | null {
    if (!alerts || alerts.length === 0) {
        return null;
    }

    return `
    <h3 style="margin: 30px 0 20px; color: #1F2937;">Recent Alerts Timeline</h3>
    ${alerts.map(alert => `
        <div style="
            padding: 16px;
            margin-bottom: 12px;
            border-radius: 8px;
            background: ${alert._source.rule.level >= 12 ? '#FEE2E2' : 
                        alert._source.rule.level >= 8 ? '#FFEDD5' : 
                        alert._source.rule.level >= 4 ? '#FEF3C7' : '#F3F4F6'};
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-weight: 500;">${alert._source.rule.description}</span>
                <span style="
                    padding: 4px 8px;
                    border-radius: 4px;
                    background: white;
                    font-size: 12px;
                    color: ${alert._source.rule.level >= 12 ? '#991B1B' : 
                            alert._source.rule.level >= 8 ? '#9A3412' : 
                            alert._source.rule.level >= 4 ? '#854D0E' : '#374151'};
                ">Level ${alert._source.rule.level}</span>
            </div>
            <div style="display: flex; gap: 16px; font-size: 12px; color: #4B5563;">
                <span>${new Date(alert._source.timestamp).toLocaleString()}</span>
                <span>Rule ID: ${alert._source.rule.id}</span>
            </div>
        </div>
    `).join('')}`;
}

function generateRuleDistribution(agent: AgentSummary): string | null {
    if (!agent.topRules || agent.topRules.length === 0) {
        return null;
    }

    return `
    <h3 style="margin: 30px 0 20px; color: #1F2937;">Top Triggered Rules</h3>
    ${agent.topRules.map(rule => `
        <div style="padding: 16px; margin-bottom: 12px; border: 1px solid #E5E7EB; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-weight: 500;">${rule.description}</span>
                <span style="
                    padding: 4px 8px;
                    border-radius: 4px;
                    background: ${rule.level >= 12 ? '#FEE2E2' : 
                                rule.level >= 8 ? '#FFEDD5' : 
                                rule.level >= 4 ? '#FEF3C7' : '#F3F4F6'};
                    font-size: 12px;
                    color: ${rule.level >= 12 ? '#991B1B' : 
                            rule.level >= 8 ? '#9A3412' : 
                            rule.level >= 4 ? '#854D0E' : '#374151'};
                ">Level ${rule.level}</span>
            </div>
            <div style="display: flex; gap: 16px; font-size: 12px; color: #4B5563;">
                <span>Rule ID: ${rule.id}</span>
                <span>Groups: ${rule.groups.join(', ')}</span>
            </div>
        </div>
    `).join('')}`;
}

function generateMitreOverview(agent: AgentSummary): string | null {
    const { tactics, techniques } = agent.mitreAttacks;
    
    if (!tactics || Object.keys(tactics).length === 0 || !techniques || Object.keys(techniques).length === 0) {
        return null;
    }

    const maxTacticCount = Math.max(...Object.values(tactics));
    const maxTechniqueCount = Math.max(...Object.values(techniques));

    const generateMetricItem = (name: string, count: number, max: number) => `
        <div style="padding: 12px 0; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center;">
            <div style="flex: 1;">${name}</div>
            <div style="margin: 0 16px;">${count}</div>
            <div style="width: 120px; height: 8px; background: #F3F4F6; border-radius: 4px; overflow: hidden;">
                <div style="width: ${(count / max) * 100}%; height: 100%; background: #6D28D9; border-radius: 4px;"></div>
            </div>
        </div>`;

    return `
    <h3 style="margin: 30px 0 20px; color: #1F2937;">MITRE ATT&CK Coverage</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
        <div>
            <h4 style="margin-bottom: 16px; color: #4B5563;">Top Tactics</h4>
            ${Object.entries(tactics)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([tactic, count]) => generateMetricItem(tactic, count, maxTacticCount))
                .join('')}
        </div>
        <div>
            <h4 style="margin-bottom: 16px; color: #4B5563;">Top Techniques</h4>
            ${Object.entries(techniques)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([technique, count]) => generateMetricItem(technique, count, maxTechniqueCount))
                .join('')}
        </div>
    </div>`;
}

export function generateAgentDetails(agent: AgentSummary): string | null {
    if (!hasAgentData(agent)) {
        return null;
    }

    const metricsGrid = generateMetricsGrid(agent);
    const alertTimeline = generateAlertTimeline(agent.recentAlerts);
    const ruleDistribution = generateRuleDistribution(agent);
    const mitreOverview = generateMitreOverview(agent);

    return `
    <div style="display: flex; align-items: center; margin-bottom: 24px;">
        <div style="
            width: 40px;
            height: 40px;
            border-radius: 8px;
            background: #1F2937;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
        ">
            <svg style="width: 24px; height: 24px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
        </div>
        <div>
            <h2 style="color: #1F2937; margin: 0;">Agent: ${agent.name}</h2>
            <p style="color: #6B7280; margin: 4px 0 0 0;">ID: ${agent.id}</p>
        </div>
    </div>

    ${metricsGrid || ''}
    ${alertTimeline || ''}
    ${ruleDistribution || ''}
    ${mitreOverview || ''}`;
}
