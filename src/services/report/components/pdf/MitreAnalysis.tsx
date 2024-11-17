import React from 'react';
import {StyleSheet, Text, View} from '@react-pdf/renderer';
import {GroupSummary} from '../../summary';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: 16,
  },
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    width: '48%',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
  },
  cardCount: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
    backgroundColor: '#dbeafe',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  description: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#64748b',
    lineHeight: 1.4,
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
  decorativeLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#2563eb',
    borderRadius: 1.5,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statsCard: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statsValue: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#64748b',
  },
  techniqueCard: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  techniqueMeta: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  techniqueTag: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
    backgroundColor: '#f1f5f9',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  tacticsList: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tacticTag: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1e40af',
    backgroundColor: '#dbeafe',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
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

const MITRE_TACTIC_DESCRIPTIONS: { [key: string]: string } = {
  'initial-access': 'Techniques used by adversaries to gain initial access to a network, including social engineering and exploiting vulnerabilities.',
  'execution': 'Techniques that result in execution of adversary-controlled code on a local or remote system.',
  'persistence': 'Techniques used by adversaries to maintain access to systems across restarts, changed credentials, and other interruptions.',
  'privilege-escalation': 'Techniques that adversaries use to gain higher-level permissions on a system or network.',
  'defense-evasion': 'Techniques used by adversaries to avoid detection throughout their compromise, including encryption and masquerading.',
  'credential-access': 'Techniques for stealing credentials like account names and passwords, including keylogging and credential dumping.',
  'discovery': 'Techniques used by adversaries to gain knowledge about system and network configuration and characteristics.',
  'lateral-movement': 'Techniques that enable adversaries to access and control remote systems on a network.',
  'collection': 'Techniques used to identify and gather information, such as sensitive files, from a target system.',
  'command-and-control': 'Techniques that adversaries use to communicate with systems under their control within a target network.',
  'exfiltration': 'Techniques that adversaries use to steal data from your network, often involving compression and encryption.',
  'impact': 'Techniques that adversaries use to disrupt availability or compromise integrity by manipulating business processes.',
};

interface MitreAnalysisProps {
  summary: GroupSummary;
}

const TacticCard: React.FC<{ name: string; count: number; maxCount: number }> = ({ name, count, maxCount }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>
        {name.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')}
      </Text>
      <Text style={styles.cardCount}>{count}</Text>
    </View>
    <Text style={styles.description}>
      {MITRE_TACTIC_DESCRIPTIONS[name] || 'Techniques related to this tactic'}
    </Text>
    <View style={styles.progressBar}>
      <View style={[styles.progressFill, { width: `${(count / maxCount) * 100}%` }]} />
    </View>
  </View>
);

const TechniqueCard: React.FC<{ 
  technique: string; 
  count: number;
  maxCount: number;
  relatedTactics: string[];
}> = ({ technique, count, maxCount, relatedTactics }) => (
  <View style={styles.techniqueCard}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{technique}</Text>
      <Text style={styles.cardCount}>{count}</Text>
    </View>
    <View style={styles.techniqueMeta}>
      <Text style={styles.techniqueTag}>ID: {technique}</Text>
      <Text style={styles.techniqueTag}>Occurrences: {count}</Text>
    </View>
    <View style={styles.progressBar}>
      <View style={[styles.progressFill, { width: `${(count / maxCount) * 100}%` }]} />
    </View>
    <View style={styles.tacticsList}>
      {relatedTactics.map((tactic, index) => (
        <Text key={index} style={styles.tacticTag}>
          {tactic.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </Text>
      ))}
    </View>
  </View>
);

export const MitreAnalysis: React.FC<MitreAnalysisProps> = ({ summary }) => {
  const { tactics, techniques } = summary.mitreCoverage;
  const totalTactics = Object.keys(tactics).length;
  const totalTechniques = Object.keys(techniques).length;
  const totalDetections = Object.values(techniques).reduce((sum, count) => sum + count, 0);

  const maxTacticCount = Math.max(...Object.values(tactics));
  const maxTechniqueCount = Math.max(...Object.values(techniques));

  // Find related tactics for each technique
  const findRelatedTactics = (techniqueId: string): string[] => {
    return Object.keys(tactics).filter(tactic => 
      summary.agentSummaries.some(agent =>
        agent.recentAlerts.some(alert =>
          alert._source.rule.mitre?.technique?.includes(techniqueId) &&
          alert._source.rule.mitre?.tactic?.includes(tactic)
        )
      )
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.decorativeLine} />
      <Text style={styles.header}>MITRE ATT&CK Analysis</Text>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>
          Security monitoring covers <Text style={styles.summaryHighlight}>{totalTactics} MITRE ATT&CK tactics</Text> and 
          <Text style={styles.summaryHighlight}> {totalTechniques} unique techniques</Text>, with a total of 
          <Text style={styles.summaryHighlight}> {totalDetections} technique detections</Text>. This analysis provides insights 
          into potential adversary behaviors and helps identify areas for security improvements.
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>{totalTactics}</Text>
          <Text style={styles.statsLabel}>Tactics Monitored</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>{totalTechniques}</Text>
          <Text style={styles.statsLabel}>Unique Techniques</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>{totalDetections}</Text>
          <Text style={styles.statsLabel}>Total Detections</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tactics Coverage</Text>
        <View style={styles.grid}>
          {Object.entries(tactics).length > 0 ? (
            Object.entries(tactics).map(([tactic, count], index) => (
              <TacticCard 
                key={index} 
                name={tactic} 
                count={count} 
                maxCount={maxTacticCount}
              />
            ))
          ) : (
            <Text style={styles.noData}>No MITRE tactics detected</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Techniques</Text>
        {Object.entries(techniques).length > 0 ? (
          Object.entries(techniques)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6)
            .map(([technique, count], index) => (
              <TechniqueCard 
                key={index} 
                technique={technique} 
                count={count}
                maxCount={maxTechniqueCount}
                relatedTactics={findRelatedTactics(technique)}
              />
            ))
        ) : (
          <Text style={styles.noData}>No MITRE techniques detected</Text>
        )}
      </View>
    </View>
  );
};
