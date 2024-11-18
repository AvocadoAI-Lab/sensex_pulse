import React from 'react';
import {StyleSheet, Text, View} from '@react-pdf/renderer';
import {AgentSummary} from '../../summary';
import type {Rule} from '@/types/wql';

// ... (keep all styles unchanged)
const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 24,
    color: '#1e293b',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  metricBox: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  metricTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#64748b',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  metricSubtext: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#64748b',
  },
  systemInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  infoCard: {
    width: '48%',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoLabel: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#64748b',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
  },
  ruleList: {
    gap: 16,
  },
  ruleItem: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  ruleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ruleId: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
  },
  ruleSeverity: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  ruleDescription: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 1.4,
  },
  ruleGroups: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  groupTag: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
    backgroundColor: '#f1f5f9',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  complianceTag: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1e40af',
    backgroundColor: '#dbeafe',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  alertTimeline: {
    gap: 12,
  },
  timelineItem: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#64748b',
  },
  timelineDescription: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#1e293b',
    marginBottom: 8,
    lineHeight: 1.4,
  },
  timelineMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  timelineTag: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
    backgroundColor: '#f1f5f9',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  noData: {
    fontSize: 13,
    fontFamily: 'Helvetica',
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  summaryBox: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryText: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#1e293b',
    lineHeight: 1.5,
  },
  summaryHighlight: {
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 2,
  },
});

const getSeverityStyle = (level: number) => {
  if (level >= 12) {
    return {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
    };
  } else if (level >= 8) {
    return {
      backgroundColor: '#ffedd5',
      color: '#9a3412',
    };
  } else if (level >= 4) {
    return {
      backgroundColor: '#fef3c7',
      color: '#92400e',
    };
  } else {
    return {
      backgroundColor: '#f3f4f6',
      color: '#374151',
    };
  }
};

const RuleCard: React.FC<{ rule: Rule }> = ({ rule }) => {
  const severityStyle = getSeverityStyle(rule.level);
  const complianceFrameworks = [
    { key: 'pci_dss', name: 'PCI DSS' },
    { key: 'gdpr', name: 'GDPR' },
    { key: 'hipaa', name: 'HIPAA' },
    { key: 'nist_800_53', name: 'NIST 800-53' },
    { key: 'tsc', name: 'TSC' },
  ];

  return (
    <View style={styles.ruleItem}>
      <View style={styles.ruleHeader}>
        <Text style={styles.ruleId}>Rule {rule.id}</Text>
        <Text style={[styles.ruleSeverity, severityStyle]}>
          Level {rule.level}
        </Text>
      </View>
      <Text style={styles.ruleDescription}>{rule.description}</Text>
      
      <View style={styles.ruleGroups}>
        {rule.groups.map((group, index) => (
          <Text key={index} style={styles.groupTag}>{group}</Text>
        ))}
        {complianceFrameworks.map(({ key, name }) => (
          rule[key as keyof Rule] && (
            <Text key={key} style={styles.complianceTag}>{name}</Text>
          )
        ))}
      </View>
      
      {rule.mitre && (
        <View style={styles.timelineMeta}>
          {rule.mitre.tactic.map((tactic, index) => (
            <Text key={index} style={styles.timelineTag}>
              {tactic.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(rule.level / 15) * 100}%` }]} />
      </View>
    </View>
  );
};

interface AgentDetailsProps {
  agent: AgentSummary;
}

export const AgentDetails: React.FC<AgentDetailsProps> = ({ agent }) => {
  const highSeverityCount = agent.recentAlerts.filter(
    alert => alert._source.rule.level >= 12
  ).length;

  const getComplianceCount = () => {
    const frameworks = ['pci_dss', 'gdpr', 'hipaa', 'nist_800_53', 'tsc'];
    return agent.topRules.reduce((count, rule) => {
      return count + frameworks.filter(framework => rule[framework as keyof Rule]).length;
    }, 0);
  };

  return (
    <>
      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>
          Agent <Text style={styles.summaryHighlight}>{agent.name}</Text> has reported 
          <Text style={styles.summaryHighlight}> {agent.totalAlerts} security events</Text>, 
          including <Text style={styles.summaryHighlight}>{highSeverityCount} high-severity alerts</Text>. 
          The agent monitors <Text style={styles.summaryHighlight}>{Object.keys(agent.mitreAttacks.tactics).length} MITRE ATT&CK tactics</Text> and 
          has detected <Text style={styles.summaryHighlight}>{agent.vulnerabilities.length} vulnerabilities</Text>.
        </Text>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricBox}>
          <Text style={styles.metricTitle}>Total Alerts</Text>
          <Text style={[styles.metricValue, { color: '#2563eb' }]}>{agent.totalAlerts}</Text>
          <Text style={styles.metricSubtext}>Security Events</Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricTitle}>High Severity</Text>
          <Text style={[styles.metricValue, { color: '#dc2626' }]}>{highSeverityCount}</Text>
          <Text style={styles.metricSubtext}>Critical Events</Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricTitle}>Compliance</Text>
          <Text style={[styles.metricValue, { color: '#059669' }]}>{getComplianceCount()}</Text>
          <Text style={styles.metricSubtext}>Framework Controls</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Information</Text>
        <View style={styles.systemInfoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Agent ID</Text>
            <Text style={styles.infoValue}>{agent.id}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Agent Name</Text>
            <Text style={styles.infoValue}>{agent.name}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>MITRE Coverage</Text>
            <Text style={styles.infoValue}>
              {Object.keys(agent.mitreAttacks.tactics).length} Tactics
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Vulnerabilities</Text>
            <Text style={styles.infoValue}>{agent.vulnerabilities.length}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Rules</Text>
        <View style={styles.ruleList}>
          {agent.topRules.length > 0 ? (
            agent.topRules.map((rule, index) => (
              <RuleCard key={index} rule={rule} />
            ))
          ) : (
            <Text style={styles.noData}>No rules triggered</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Alerts</Text>
        <View style={styles.alertTimeline}>
          {agent.recentAlerts.length > 0 ? (
            agent.recentAlerts.map((alert, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineHeader}>
                  <Text style={styles.timestamp}>
                    {new Date(alert._source['@timestamp']).toLocaleString()}
                  </Text>
                  <Text style={[styles.ruleSeverity, getSeverityStyle(alert._source.rule.level)]}>
                    Level {alert._source.rule.level}
                  </Text>
                </View>
                <Text style={styles.timelineDescription}>
                  {alert._source.rule.description}
                </Text>
                {alert._source.rule.mitre && (
                  <View style={styles.timelineMeta}>
                    {alert._source.rule.mitre.tactic.map((tactic, idx) => (
                      <Text key={idx} style={styles.timelineTag}>
                        {tactic.split('-').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noData}>No recent alerts</Text>
          )}
        </View>
      </View>
    </>
  );
};
