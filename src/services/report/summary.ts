import {Hit, Rule, Vulnerability, WQL_result} from '@/types/wql';

export interface AgentSummary {
    id: string;
    name: string;
    totalAlerts: number;
    severityDistribution: { [key: number]: number };
    topRules: Rule[];
    vulnerabilities: Vulnerability[];
    mitreAttacks: {
        tactics: { [key: string]: number };
        techniques: { [key: string]: number };
    };
    recentAlerts: Hit[];
}

export interface GroupSummary {
    groupName: string;
    totalAgents: number;
    totalAlerts: number;
    agentSummaries: AgentSummary[];
    overallSeverityDistribution: { [key: number]: number };
    commonRules: Rule[];
    criticalVulnerabilities: Vulnerability[];
    mitreCoverage: {
        tactics: { [key: string]: number };
        techniques: { [key: string]: number };
    };
}

interface AgentResult {
    agent_name: string;
    data: WQL_result;
}

interface GroupResponse {
    group: string;
    results: AgentResult[];
}

export class ReportSummaryService {
    private static readonly TOP_RULES_LIMIT = 5;
    private static readonly RECENT_ALERTS_LIMIT = 10;

    public static generateGroupSummaryFromResponse(groupResponse: GroupResponse): GroupSummary {
        const agentSummaries = groupResponse.results.map(result => 
            this.generateAgentSummaryFromResult(result)
        );

        const overallSeverityDist = this.aggregateSeverityDistribution(agentSummaries);
        const commonRules = this.findCommonRulesFromAgents(agentSummaries);
        const criticalVulns = this.findCriticalVulnerabilitiesFromAgents(agentSummaries);
        const mitreCoverage = this.aggregateMitreCoverage(agentSummaries);

        return {
            groupName: groupResponse.group,
            totalAgents: agentSummaries.length,
            totalAlerts: agentSummaries.reduce((sum, agent) => sum + agent.totalAlerts, 0),
            agentSummaries,
            overallSeverityDistribution: overallSeverityDist,
            commonRules,
            criticalVulnerabilities: criticalVulns,
            mitreCoverage
        };
    }

    private static generateAgentSummaryFromResult(result: AgentResult): AgentSummary {
        const hits = result.data.hits.hits;
        const severityDist = this.calculateSeverityDistribution(hits);
        const topRules = this.findTopRules(hits);
        const vulnerabilities = this.extractVulnerabilities(hits);
        const mitreAttacks = this.analyzeMitreAttacks(hits);

        // Find agent ID from the first hit
        const agentId = hits[0]?._source.agent.id || 'unknown';

        return {
            id: agentId,
            name: result.agent_name,
            totalAlerts: hits.length,
            severityDistribution: severityDist,
            topRules,
            vulnerabilities,
            mitreAttacks,
            recentAlerts: hits.slice(0, this.RECENT_ALERTS_LIMIT)
        };
    }

    private static calculateSeverityDistribution(hits: Hit[]): { [key: number]: number } {
        const distribution: { [key: number]: number } = {};
        hits.forEach(hit => {
            const level = hit._source.rule.level;
            distribution[level] = (distribution[level] || 0) + 1;
        });
        return distribution;
    }

    private static findTopRules(hits: Hit[]): Rule[] {
        const ruleCount = new Map<string, { count: number; rule: Rule }>();
        
        hits.forEach(hit => {
            const rule = hit._source.rule;
            const existing = ruleCount.get(rule.id);
            if (existing) {
                existing.count++;
            } else {
                ruleCount.set(rule.id, { count: 1, rule });
            }
        });

        return Array.from(ruleCount.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, this.TOP_RULES_LIMIT)
            .map(item => item.rule);
    }

    private static extractVulnerabilities(hits: Hit[]): Vulnerability[] {
        return hits
            .filter(hit => hit._source.data?.vulnerability)
            .map(hit => hit._source.data!.vulnerability!)
            .filter((vuln, index, self) => 
                index === self.findIndex(v => v.cve === vuln.cve)
            );
    }

    private static analyzeMitreAttacks(hits: Hit[]): {
        tactics: { [key: string]: number };
        techniques: { [key: string]: number };
    } {
        const tactics: { [key: string]: number } = {};
        const techniques: { [key: string]: number } = {};

        hits.forEach(hit => {
            const mitre = hit._source.rule.mitre;
            if (!mitre) return;

            mitre.tactic.forEach(tactic => {
                tactics[tactic] = (tactics[tactic] || 0) + 1;
            });
            mitre.technique.forEach(technique => {
                techniques[technique] = (techniques[technique] || 0) + 1;
            });
        });

        return { tactics, techniques };
    }

    private static aggregateSeverityDistribution(
        agentSummaries: AgentSummary[]
    ): { [key: number]: number } {
        const distribution: { [key: number]: number } = {};
        agentSummaries.forEach(summary => {
            Object.entries(summary.severityDistribution).forEach(([level, count]) => {
                distribution[Number(level)] = (distribution[Number(level)] || 0) + count;
            });
        });
        return distribution;
    }

    private static findCommonRulesFromAgents(agentSummaries: AgentSummary[]): Rule[] {
        const ruleCount = new Map<string, { count: number; rule: Rule }>();
        
        agentSummaries.forEach(summary => {
            summary.topRules.forEach(rule => {
                const existing = ruleCount.get(rule.id);
                if (existing) {
                    existing.count++;
                } else {
                    ruleCount.set(rule.id, { count: 1, rule });
                }
            });
        });

        return Array.from(ruleCount.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, this.TOP_RULES_LIMIT)
            .map(item => item.rule);
    }

    private static findCriticalVulnerabilitiesFromAgents(agentSummaries: AgentSummary[]): Vulnerability[] {
        const allVulnerabilities = agentSummaries.flatMap(summary => summary.vulnerabilities);
        return allVulnerabilities
            .filter(vuln => vuln.severity.toLowerCase() === 'critical')
            .filter((vuln, index, self) => 
                index === self.findIndex(v => v.cve === vuln.cve)
            );
    }

    private static aggregateMitreCoverage(agentSummaries: AgentSummary[]): {
        tactics: { [key: string]: number };
        techniques: { [key: string]: number };
    } {
        const tactics: { [key: string]: number } = {};
        const techniques: { [key: string]: number } = {};

        agentSummaries.forEach(summary => {
            Object.entries(summary.mitreAttacks.tactics).forEach(([tactic, count]) => {
                tactics[tactic] = (tactics[tactic] || 0) + count;
            });
            Object.entries(summary.mitreAttacks.techniques).forEach(([technique, count]) => {
                techniques[technique] = (techniques[technique] || 0) + count;
            });
        });

        return { tactics, techniques };
    }
}
