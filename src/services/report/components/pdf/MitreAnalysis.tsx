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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    width: '48%',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
  },
  cardCount: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
  },
  description: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#64748b',
    lineHeight: 1.4,
  },
  noData: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 24,
  },
  summaryBox: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#dbeafe',
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: '#1e40af',
    lineHeight: 1.4,
  },
});

const MITRE_TACTIC_DESCRIPTIONS: { [key: string]: string } = {
  'initial-access': 'Techniques used to gain initial access to the network',
  'execution': 'Techniques used to execute malicious code',
  'persistence': 'Techniques used to maintain presence in the system',
  'privilege-escalation': 'Techniques used to gain higher-level permissions',
  'defense-evasion': 'Techniques used to avoid detection',
  'credential-access': 'Techniques used to steal credentials',
  'discovery': 'Techniques used to gain knowledge about the system and network',
  'lateral-movement': 'Techniques used to move through the environment',
  'collection': 'Techniques used to gather data of interest',
  'command-and-control': 'Techniques used to communicate with compromised systems',
  'exfiltration': 'Techniques used to steal data',
  'impact': 'Techniques used to manipulate, interrupt, or destroy systems and data',
};

interface MitreAnalysisProps {
  summary: GroupSummary;
}

export const MitreAnalysis: React.FC<MitreAnalysisProps> = ({ summary }) => {
  const { tactics, techniques } = summary.mitreCoverage;
  const totalTactics = Object.keys(tactics).length;
  const totalTechniques = Object.keys(techniques).length;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>MITRE ATT&CK Analysis</Text>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>
          Security monitoring covers {totalTactics} MITRE ATT&CK tactics and {totalTechniques} techniques, 
          providing comprehensive coverage against various attack vectors and methodologies.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tactics Coverage</Text>
        <View style={styles.grid}>
          {Object.entries(tactics).length > 0 ? (
            Object.entries(tactics).map(([tactic, count], index) => (
              <View key={index} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>
                    {tactic.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Text>
                  <Text style={styles.cardCount}>{count}</Text>
                </View>
                <Text style={styles.description}>
                  {MITRE_TACTIC_DESCRIPTIONS[tactic] || 'Techniques related to this tactic'}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noData}>No MITRE tactics detected</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Techniques</Text>
        <View style={styles.grid}>
          {Object.entries(techniques).length > 0 ? (
            Object.entries(techniques)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 6)
              .map(([technique, count], index) => (
                <View key={index} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{technique}</Text>
                    <Text style={styles.cardCount}>{count}</Text>
                  </View>
                  <Text style={styles.description}>
                    Detected {count} instances of this attack technique
                  </Text>
                </View>
              ))
          ) : (
            <Text style={styles.noData}>No MITRE techniques detected</Text>
          )}
        </View>
      </View>
    </View>
  );
};
