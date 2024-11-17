import React from 'react';
import {StyleSheet, Text, View} from '@react-pdf/renderer';
import {AgentSummary} from '../../summary';
import type {Rule} from '@/types/wql';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 32,
    color: '#1e293b',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    marginBottom: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  metricBox: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  metricTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: '#64748b',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  metricSubtext: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#64748b',
  },
  ruleList: {
    gap: 16,
  },
  ruleItem: {
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  ruleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ruleId: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
  },
  ruleSeverity: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  ruleDescription: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#64748b',
    marginBottom: 8,
  },
  ruleGroups: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  groupTag: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#475569',
    backgroundColor: '#f1f5f9',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  alertTimeline: {
    gap: 12,
  },
  timelineItem: {
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#64748b',
  },
  timelineDescription: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#1e293b',
  },
  noData: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 24,
  },
});

interface AgentDetailsProps {
  agent: AgentSummary;
  index: number;
}

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
      </View>
    </View>
  );
};

export const AgentDetails: React.FC<AgentDetailsProps> = ({ agent }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Agent Details: {agent.name}</Text>

      <View style={styles.metricsGrid}>
        <View style={styles.metricBox}>
          <Text style={styles.metricTitle}>Total Alerts</Text>
          <Text style={styles.metricValue}>{agent.totalAlerts}</Text>
          <Text style={styles.metricSubtext}>Security Events</Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricTitle}>Vulnerabilities</Text>
          <Text style={styles.metricValue}>{agent.vulnerabilities.length}</Text>
          <Text style={styles.metricSubtext}>Detected Issues</Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricTitle}>MITRE Coverage</Text>
          <Text style={styles.metricValue}>
            {Object.keys(agent.mitreAttacks.tactics).length}
          </Text>
          <Text style={styles.metricSubtext}>Tactics Monitored</Text>
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
              </View>
            ))
          ) : (
            <Text style={styles.noData}>No recent alerts</Text>
          )}
        </View>
      </View>
    </View>
  );
};
