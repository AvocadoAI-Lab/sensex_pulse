import React from 'react';
import {StyleSheet, Text, View} from '@react-pdf/renderer';
import {GroupSummary} from "@/services/report/summary";

const styles = StyleSheet.create({
  // Remove header style since it's handled by Document.tsx
  metricsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  metricBox: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
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
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  metricSubtext: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#64748b',
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
  alertList: {
    gap: 12,
  },
  alertItem: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertDescription: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
  },
  alertLevel: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  alertMeta: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#64748b',
    lineHeight: 1.4,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statsCard: {
    width: '48%',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statsHeader: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  statsList: {
    gap: 8,
  },
  statsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  statsLabel: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#64748b',
  },
  statsValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
  },
  recommendationList: {
    gap: 12,
  },
  recommendationItem: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  recommendationTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#64748b',
    lineHeight: 1.4,
  },
  scoreIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  scoreBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  scoreProgress: {
    height: '100%',
    borderRadius: 2,
  },
  scoreLabel: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginLeft: 4,
  },
});

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
  let color = '#dc2626';
  let backgroundColor = '#fee2e2';

  if (score >= 90) {
    label = 'Excellent';
    color = '#059669';
    backgroundColor = '#d1fae5';
  } else if (score >= 80) {
    label = 'Good';
    color = '#2563eb';
    backgroundColor = '#dbeafe';
  } else if (score >= 70) {
    label = 'Fair';
    color = '#d97706';
    backgroundColor = '#fef3c7';
  } else if (score >= 60) {
    label = 'Needs Improvement';
    color = '#dc2626';
    backgroundColor = '#fee2e2';
  }

  return { score, label, color, backgroundColor };
};

interface ExecutiveSummaryProps {
  summary: GroupSummary;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ summary }) => {
  const securityScore = calculateSecurityScore(summary);
  const highSeverityCount = summary.overallSeverityDistribution[12] || (summary.overallSeverityDistribution[15] || 0);
  const mediumSeverityCount = summary.overallSeverityDistribution[8] || (summary.overallSeverityDistribution[10] || 0);
  const tacticsCovered = Object.keys(summary.mitreCoverage.tactics).length;
  const activeAgents = summary.agentSummaries.filter(agent => agent.totalAlerts > 0).length;

  const generateRecommendations = () => {
    const recommendations = [];

    if (summary.criticalVulnerabilities.length > 0) {
      recommendations.push({
        title: 'Critical Vulnerabilities',
        text: `Patch ${summary.criticalVulnerabilities.length} critical vulnerabilities identified across systems to prevent potential exploitation.`
      });
    }

    if (highSeverityCount > 0) {
      recommendations.push({
        title: 'High Severity Alerts',
        text: `Review and respond to ${highSeverityCount} high severity security events that may indicate significant security threats.`
      });
    }

    if (Object.keys(summary.mitreCoverage.tactics).length < 8) {
      recommendations.push({
        title: 'MITRE Coverage',
        text: 'Expand security monitoring to cover more MITRE ATT&CK tactics for comprehensive threat detection.'
      });
    }

    return recommendations;
  };

  return (
    <>
      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>
          Security assessment across <Text style={styles.summaryHighlight}>{summary.totalAgents} agents</Text> reveals 
          a security score of <Text style={styles.summaryHighlight}>{securityScore.score}</Text> ({securityScore.label}). 
          The analysis identified <Text style={styles.summaryHighlight}>{summary.criticalVulnerabilities.length} critical vulnerabilities</Text> and 
          <Text style={styles.summaryHighlight}> {highSeverityCount} high-severity alerts</Text> that require attention. 
          Security monitoring covers <Text style={styles.summaryHighlight}>{tacticsCovered} MITRE ATT&CK tactics</Text>.
        </Text>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricBox}>
          <Text style={styles.metricTitle}>Security Score</Text>
          <Text style={[styles.metricValue, { color: securityScore.color }]}>
            {securityScore.score}
          </Text>
          <View style={styles.scoreIndicator}>
            <View style={styles.scoreBar}>
              <View 
                style={[
                  styles.scoreProgress, 
                  { 
                    width: `${securityScore.score}%`,
                    backgroundColor: securityScore.color 
                  }
                ]} 
              />
            </View>
            <Text style={[styles.scoreLabel, { color: securityScore.color }]}>
              {securityScore.label}
            </Text>
          </View>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricTitle}>Active Agents</Text>
          <Text style={[styles.metricValue, { color: '#2563eb' }]}>
            {activeAgents}
          </Text>
          <Text style={styles.metricSubtext}>of {summary.totalAgents} Total</Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricTitle}>Total Alerts</Text>
          <Text style={[styles.metricValue, { color: '#dc2626' }]}>
            {summary.totalAlerts}
          </Text>
          <Text style={styles.metricSubtext}>Security Events</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statsCard}>
          <Text style={styles.statsHeader}>Security Events Distribution</Text>
          <View style={styles.statsList}>
            <View style={styles.statsItem}>
              <Text style={styles.statsLabel}>Critical Vulnerabilities</Text>
              <Text style={[styles.statsValue, { color: '#dc2626' }]}>
                {summary.criticalVulnerabilities.length}
              </Text>
            </View>
            <View style={styles.statsItem}>
              <Text style={styles.statsLabel}>High Severity Alerts</Text>
              <Text style={[styles.statsValue, { color: '#ea580c' }]}>
                {highSeverityCount}
              </Text>
            </View>
            <View style={styles.statsItem}>
              <Text style={styles.statsLabel}>Medium Severity Alerts</Text>
              <Text style={[styles.statsValue, { color: '#d97706' }]}>
                {mediumSeverityCount}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsHeader}>Security Coverage</Text>
          <View style={styles.statsList}>
            <View style={styles.statsItem}>
              <Text style={styles.statsLabel}>MITRE Tactics Covered</Text>
              <Text style={[styles.statsValue, { color: '#2563eb' }]}>
                {tacticsCovered}
              </Text>
            </View>
            <View style={styles.statsItem}>
              <Text style={styles.statsLabel}>Active Monitoring</Text>
              <Text style={[styles.statsValue, { color: '#2563eb' }]}>
                {activeAgents} Agents
              </Text>
            </View>
            <View style={styles.statsItem}>
              <Text style={styles.statsLabel}>Total Vulnerabilities</Text>
              <Text style={[styles.statsValue, { color: '#2563eb' }]}>
                {summary.agentSummaries.reduce((total, agent) => total + agent.vulnerabilities.length, 0)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Recommendations</Text>
        <View style={styles.recommendationList}>
          {generateRecommendations().map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
              <Text style={styles.recommendationText}>{recommendation.text}</Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );
};
