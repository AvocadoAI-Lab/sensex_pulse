import {AgentSummary} from '../summary';
import {Hit} from '@/types/wql';

function generateAlertTimeline(alerts: Hit[]): string {
    return `
    <div style="
        background: white;
        border-radius: 12px;
        padding: 24px;
        border: 1px solid #e5e7eb;
        margin-bottom: 24px;
    ">
        <h4 style="font-size: 18px; font-weight: 500; color: #111827; margin-bottom: 16px;">
            Recent Alerts Timeline
        </h4>
        <div style="display: flex; flex-direction: column; gap: 16px;">
            ${alerts.map(alert => `
            <div style="
                display: flex;
                align-items: flex-start;
                padding: 16px;
                border-radius: 8px;
                background: ${alert._source.rule.level >= 12 ? '#fee2e2' : 
                           alert._source.rule.level >= 8 ? '#ffedd5' : 
                           alert._source.rule.level >= 4 ? '#fef3c7' : '#f3f4f6'};
            ">
                <div style="
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 16px;
                    flex-shrink: 0;
                ">
                    <svg style="
                        width: 20px;
                        height: 20px;
                        color: ${alert._source.rule.level >= 12 ? '#dc2626' : 
                               alert._source.rule.level >= 8 ? '#ea580c' : 
                               alert._source.rule.level >= 4 ? '#ca8a04' : '#6b7280'};
                    " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                </div>
                <div style="flex-grow: 1; min-width: 0;">
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 4px;
                    ">
                        <span style="
                            font-size: 14px;
                            font-weight: 500;
                            color: #111827;
                            display: block;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                        ">
                            ${alert._source.rule.description}
                        </span>
                        <span style="
                            padding: 4px 8px;
                            border-radius: 9999px;
                            font-size: 12px;
                            font-weight: 500;
                            background: white;
                            color: ${alert._source.rule.level >= 12 ? '#991b1b' : 
                                   alert._source.rule.level >= 8 ? '#9a3412' : 
                                   alert._source.rule.level >= 4 ? '#854d0e' : '#374151'};
                            flex-shrink: 0;
                            margin-left: 8px;
                        ">
                            Level ${alert._source.rule.level}
                        </span>
                    </div>
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 12px;
                        color: #6b7280;
                    ">
                        <span>${new Date(alert._source.timestamp).toLocaleString()}</span>
                        <span>Rule ID: ${alert._source.rule.id}</span>
                    </div>
                </div>
            </div>
            `).join('')}
        </div>
    </div>`;
}

function generateRuleDistribution(agent: AgentSummary): string {
    return `
    <div style="
        background: white;
        border-radius: 12px;
        padding: 24px;
        border: 1px solid #e5e7eb;
        margin-bottom: 24px;
    ">
        <h4 style="font-size: 18px; font-weight: 500; color: #111827; margin-bottom: 16px;">
            Top Triggered Rules
        </h4>
        <div style="display: flex; flex-direction: column; gap: 16px;">
            ${agent.topRules.map(rule => `
            <div style="
                padding: 16px;
                border-radius: 8px;
                background: #f9fafb;
                border: 1px solid #e5e7eb;
            ">
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 8px;
                ">
                    <span style="font-size: 14px; font-weight: 500; color: #111827;">
                        ${rule.description}
                    </span>
                    <span style="
                        padding: 4px 8px;
                        border-radius: 9999px;
                        font-size: 12px;
                        font-weight: 500;
                        background: ${rule.level >= 12 ? '#fee2e2' : 
                                   rule.level >= 8 ? '#ffedd5' : 
                                   rule.level >= 4 ? '#fef3c7' : '#f3f4f6'};
                        color: ${rule.level >= 12 ? '#991b1b' : 
                               rule.level >= 8 ? '#9a3412' : 
                               rule.level >= 4 ? '#854d0e' : '#374151'};
                    ">
                        Level ${rule.level}
                    </span>
                </div>
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 12px;
                    color: #6b7280;
                ">
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
    <div style="
        background: white;
        border-radius: 12px;
        padding: 24px;
        border: 1px solid #e5e7eb;
        margin-bottom: 24px;
    ">
        <h4 style="font-size: 18px; font-weight: 500; color: #111827; margin-bottom: 16px;">
            MITRE ATT&CK Coverage
        </h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            <div>
                <h5 style="font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 12px;">
                    Top Tactics
                </h5>
                ${Object.entries(tactics).slice(0, 5).map(([tactic, count]) => `
                <div style="margin-bottom: 12px;">
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        font-size: 14px;
                        margin-bottom: 4px;
                    ">
                        <span style="color: #111827;">${tactic}</span>
                        <span style="color: #6b7280;">${count}</span>
                    </div>
                    <div style="
                        height: 4px;
                        background: #e5e7eb;
                        border-radius: 2px;
                        overflow: hidden;
                    ">
                        <div style="
                            height: 100%;
                            width: ${(count / maxTacticCount) * 100}%;
                            background: linear-gradient(90deg, #6d28d9, #4c1d95);
                            border-radius: 2px;
                        "></div>
                    </div>
                </div>
                `).join('')}
            </div>
            <div>
                <h5 style="font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 12px;">
                    Top Techniques
                </h5>
                ${Object.entries(techniques).slice(0, 5).map(([technique, count]) => `
                <div style="margin-bottom: 12px;">
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        font-size: 14px;
                        margin-bottom: 4px;
                    ">
                        <span style="color: #111827;">${technique}</span>
                        <span style="color: #6b7280;">${count}</span>
                    </div>
                    <div style="
                        height: 4px;
                        background: #e5e7eb;
                        border-radius: 2px;
                        overflow: hidden;
                    ">
                        <div style="
                            height: 100%;
                            width: ${(count / maxTechniqueCount) * 100}%;
                            background: linear-gradient(90deg, #6d28d9, #4c1d95);
                            border-radius: 2px;
                        "></div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </div>`;
}

export function generateAgentDetails(agent: AgentSummary): string {
    return `
    <div class="page" style="padding: 48px; height: 100%; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);">
        <div style="max-width: 800px; margin: 0 auto;">
            <!-- Agent Header -->
            <div style="
                display: flex;
                align-items: center;
                margin-bottom: 48px;
                padding-bottom: 24px;
                border-bottom: 1px solid #e5e7eb;
            ">
                <div style="
                    width: 64px;
                    height: 64px;
                    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 24px;
                ">
                    <svg style="width: 32px; height: 32px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                </div>
                <div>
                    <h2 style="font-size: 32px; font-weight: 700; color: #1f2937;">
                        Agent: ${agent.name}
                    </h2>
                    <p style="font-size: 16px; color: #6b7280;">ID: ${agent.id}</p>
                </div>
            </div>

            <!-- Agent Metrics -->
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
                    <h3 style="font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 8px;">
                        Total Alerts
                    </h3>
                    <p style="font-size: 32px; font-weight: 700; color: #1f2937;">
                        ${agent.totalAlerts}
                    </p>
                </div>

                <div style="
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    border: 1px solid #e5e7eb;
                ">
                    <h3 style="font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 8px;">
                        Critical Alerts
                    </h3>
                    <p style="font-size: 32px; font-weight: 700; color: #dc2626;">
                        ${agent.severityDistribution[12] || 0}
                    </p>
                </div>

                <div style="
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    border: 1px solid #e5e7eb;
                ">
                    <h3 style="font-size: 14px; font-weight: 500; color: #6b7280; margin-bottom: 8px;">
                        High Alerts
                    </h3>
                    <p style="font-size: 32px; font-weight: 700; color: #ea580c;">
                        ${agent.severityDistribution[8] || 0}
                    </p>
                </div>
            </div>

            <!-- Alert Timeline -->
            ${generateAlertTimeline(agent.recentAlerts)}

            <!-- Rule Distribution -->
            ${generateRuleDistribution(agent)}

            <!-- MITRE Overview -->
            ${generateMitreOverview(agent)}
        </div>
    </div>`;
}
