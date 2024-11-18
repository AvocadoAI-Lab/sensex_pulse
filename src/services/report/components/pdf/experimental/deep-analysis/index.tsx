import React from 'react';
import {Text, View} from '@react-pdf/renderer';
import {GroupSummary} from '../../../../summary';
import {analyzeRulePatterns, analyzeVulnerabilities, analyzeWindowsEvents} from './analyzers';
import {styles} from './styles';

interface DeepAnalysisProps {
  summary: GroupSummary;
}

export const DeepAnalysis: React.FC<DeepAnalysisProps> = ({ summary }) => {
  const allAlerts = summary.agentSummaries.flatMap(agent => agent.recentAlerts);
  const windowsAnalysis = analyzeWindowsEvents(allAlerts);
  const vulnAnalysis = analyzeVulnerabilities(allAlerts);
  const ruleAnalysis = analyzeRulePatterns(allAlerts);

  return (
    <>
      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>
          Deep analysis reveals <Text style={styles.summaryHighlight}>{vulnAnalysis.recentVulnsCount} new vulnerabilities</Text> in 
          the last 30 days, with <Text style={styles.summaryHighlight}>
            {vulnAnalysis.criticalPackages.length} critical packages
          </Text> affected. Windows security events show <Text style={styles.summaryHighlight}>
            {windowsAnalysis.authFailures.length} authentication anomalies
          </Text> and <Text style={styles.summaryHighlight}>
            {windowsAnalysis.suspiciousProcesses.length} suspicious process activities
          </Text>.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Windows Security Events</Text>
        <View style={styles.systemCard}>
          <Text style={styles.systemTitle}>Authentication Anomalies</Text>
          <Text style={styles.systemDescription}>
            Analysis of failed authentication attempts and suspicious login patterns.
          </Text>
          <View style={styles.locationList}>
            {windowsAnalysis.authFailures.map(([user, data], index) => (
              <View key={index} style={styles.locationItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationName}>{user}</Text>
                  {data.workstation && (
                    <Text style={[styles.technique, { marginTop: 4 }]}>
                      From: {data.workstation}
                    </Text>
                  )}
                </View>
                <Text style={styles.locationCount}>{data.count} failures</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.systemCard}>
          <Text style={styles.systemTitle}>Suspicious Process Activity</Text>
          <Text style={styles.systemDescription}>
            Processes with unusual execution patterns or multiple binary locations.
          </Text>
          <View style={styles.locationList}>
            {windowsAnalysis.suspiciousProcesses.map(([process, data], index) => (
              <View key={index} style={styles.locationItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationName}>{process}</Text>
                  <Text style={[styles.technique, { marginTop: 4 }]}>
                    {data.paths.size} different paths
                  </Text>
                </View>
                <Text style={styles.locationCount}>{data.count} executions</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vulnerability Impact</Text>
        <View style={styles.systemCard}>
          <Text style={styles.systemTitle}>Critical Packages</Text>
          <Text style={styles.systemDescription}>
            Software packages with high-severity vulnerabilities requiring immediate attention.
          </Text>
          <View style={styles.locationList}>
            {vulnAnalysis.criticalPackages.map(([pkg, data], index) => (
              <View key={index} style={styles.locationItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationName}>{pkg}</Text>
                  <Text style={[styles.technique, { marginTop: 4 }]}>
                    Max CVSS: {data.maxCVSS.toFixed(1)}
                  </Text>
                  {data.criticalVectors.size > 0 && (
                    <Text style={[styles.technique, { marginTop: 2 }]}>
                      Critical: {Array.from(data.criticalVectors).slice(0, 2).join(', ')}
                    </Text>
                  )}
                </View>
                <Text style={styles.locationCount}>{data.cves.size} CVEs</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rule Pattern Analysis</Text>
        <View style={styles.systemCard}>
          <Text style={styles.systemTitle}>Top Security Rule Groups</Text>
          <Text style={styles.systemDescription}>
            Most active security rule categories with their severity distribution and MITRE coverage.
          </Text>
          <View style={styles.locationList}>
            {ruleAnalysis.topGroups.map((data, index) => (
              <View key={index} style={styles.locationItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationName}>{data.group}</Text>
                  <Text style={[styles.technique, { marginTop: 4 }]}>
                    {data.uniqueLevels} severity levels, {data.mitreCoverage} MITRE tactics
                  </Text>
                </View>
                <Text style={styles.locationCount}>{data.count} alerts</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.systemCard}>
          <Text style={styles.systemTitle}>Critical Security Rules</Text>
          <Text style={styles.systemDescription}>
            Most frequently triggered security rules and their compliance impact.
          </Text>
          <View style={styles.locationList}>
            {ruleAnalysis.topRules.map(([id, data], index) => (
              <View key={index} style={styles.locationItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationName}>Rule {id}</Text>
                  <Text style={[styles.technique, { marginTop: 4 }]}>
                    {data.description}
                  </Text>
                  {data.compliance.length > 0 && (
                    <Text style={[styles.technique, { marginTop: 2 }]}>
                      Compliance: {data.compliance.join(', ')}
                    </Text>
                  )}
                </View>
                <Text style={styles.locationCount}>{data.count}x</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </>
  );
};

export default DeepAnalysis;
