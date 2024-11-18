import type {Hit} from '@/types/wql';
import {RuleAnalysis} from "@/services/report/components/pdf/experimental/deep-analysis/types";

export const analyzeRulePatterns = (alerts: Hit[]): RuleAnalysis => {
  const ruleGroups = new Map<string, {
    count: number;
    levels: Set<number>;
    mitreTactics: Set<string>;
  }>();
  const frequentRules = new Map<string, {
    count: number;
    description: string;
    level: number;
    groups: string[];
    compliance: string[];
  }>();

  alerts.forEach(alert => {
    const rule = alert._source.rule;

    // Enhanced rule group analysis
    rule.groups.forEach(group => {
      const current = ruleGroups.get(group) || {
        count: 0,
        levels: new Set<number>(),
        mitreTactics: new Set<string>()
      };
      current.count++;
      current.levels.add(rule.level);
      if (rule.mitre?.tactic) {
        rule.mitre.tactic.forEach(t => current.mitreTactics.add(t));
      }
      ruleGroups.set(group, current);
    });

    // Enhanced frequent rules analysis
    if (!frequentRules.has(rule.id)) {
      const compliance = [
        rule.pci_dss && 'PCI DSS',
        rule.gdpr && 'GDPR',
        rule.hipaa && 'HIPAA',
        rule.nist_800_53 && 'NIST',
        rule.tsc && 'TSC'
      ].filter(Boolean) as string[];

      frequentRules.set(rule.id, {
        count: 0,
        description: rule.description,
        level: rule.level,
        groups: rule.groups,
        compliance
      });
    }
    frequentRules.get(rule.id)!.count++;
  });

  return {
    topGroups: Array.from(ruleGroups.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .map(([group, data]) => ({
        group,
        count: data.count,
        uniqueLevels: data.levels.size,
        mitreCoverage: data.mitreTactics.size
      }))
      .slice(0, 5),
    topRules: Array.from(frequentRules.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5),
  };
};
