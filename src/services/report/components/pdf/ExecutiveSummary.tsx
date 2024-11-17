import React from 'react';
import {StyleSheet, Text, View} from '@react-pdf/renderer';
import {GroupSummary} from '../../summary';

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
  metricsGrid: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 40,
  },
  metricBox: {
    flex: 1,
    padding: 24,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  metricTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: '#64748b',
    marginBottom: 16,
  },
  metricValue: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  metricSubtext: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: '#64748b',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    marginBottom: 24,
  },
  alertList: {
    gap: 16,
  },
  alertItem: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertDescription: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
  },
  alertLevel: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  alertMeta: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#64748b',
  },
});

interface ExecutiveSummaryProps {
  summary: GroupSummary;
}

const calculateSecurityScore = (summary: GroupSummary) => {
  const criticalVulns = summary.criticalVulnerabilities.length;
  const severityDistribution = summary.overallSeverityDistribution;
  
  const highSeverityAlerts = severityDistribution[12] || (severityDistribution[15] || 0);
  const mediumSeverityAlerts = severityDistribution[8] || (severityDistribution[10] || 0);
  
  let score = 100;
  score -= (criticalVulns * 10);
  score -= (highSeverityAlerts * 5);
  score -= (mediumSeverityAlerts * 2);
  score = Math.max(0, Math.min(100, score));

  let label = 'Critical';
  let color = '#7f1d1d';

  if (score >= 90) {
    label = 'Excellent';
    color = '#059669';
  } else if (score >= 80) {
    label = 'Good';
    color = '#2563eb';
  } else if (score >= 70) {
    label = 'Fair';
    color = '#d97706';
  } else if (score >= 60) {
    label = 'Needs Improvement';
    color = '#dc2626';
  }

  return { score, label, color };
};

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ summary }) => {
  const securityScore = calculateSecurityScore(summary);
  const highSeverityCount = summary.overallSeverityDistribution[12] || (summary.overallSeverityDistribution[15] || 0);
  const tacticsCovered = Object.keys(summary.mitreCoverage.tactics).length;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Executive Summary</Text>

      <View style={styles.metricsGrid}>
        <View style={styles.metricBox}>
          <Text style={styles.metricTitle}>Security Score</Text>
          <Text style={[styles.metricValue, { color: securityScore.color }]}>
            {securityScore.score}
          </Text>
          <Text style={styles.metricSubtext}>{securityScore.label}</Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricTitle}>Agents Status</Text>
          <Text style={[styles.metricValue, { color: '#2563eb' }]}>
            {summary.totalAgents}
          </Text>
          <Text style={styles.metricSubtext}>Active Agents</Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricTitle}>Total Alerts</Text>
          <Text style={[styles.metricValue, { color: '#dc2626' }]}>
            {summary.totalAlerts}
          </Text>
          <Text style={styles.metricSubtext}>Security Events</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Key Findings</Text>
      
      <View style={styles.alertList}>
        {summary.criticalVulnerabilities.length > 0 && (
          <View style={styles.alertItem}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertDescription}>Critical Vulnerabilities Detected</Text>
              <Text style={[styles.alertLevel, { backgroundColor: '#fee2e2', color: '#991b1b' }]}>
                Critical
              </Text>
            </View>
            <Text style={styles.alertMeta}>
              Found {summary.criticalVulnerabilities.length} critical vulnerabilities that require immediate attention
            </Text>
          </View>
        )}

        {highSeverityCount > 0 && (
          <View style={styles.alertItem}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertDescription}>High Severity Alerts</Text>
              <Text style={[styles.alertLevel, { backgroundColor: '#ffedd5', color: '#9a3412' }]}>
                High
              </Text>
            </View>
            <Text style={styles.alertMeta}>
              Detected {highSeverityCount} high severity security alerts that should be investigated
            </Text>
          </View>
        )}

        <View style={styles.alertItem}>
          <View style={styles.alertHeader}>
            <Text style={styles.alertDescription}>MITRE ATT&CK Coverage</Text>
            <Text style={[styles.alertLevel, { backgroundColor: '#dbeafe', color: '#1e40af' }]}>
              Info
            </Text>
          </View>
          <Text style={styles.alertMeta}>
            Security monitoring covers {tacticsCovered} MITRE ATT&CK tactics
          </Text>
        </View>
      </View>
    </View>
  );
};
