import React from 'react';
import {Link, StyleSheet, Text, View} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: 40,
    paddingVertical: 32, // Reduced from 40
  },
  title: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    marginBottom: 24, // Reduced from 32
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  decorativeLine: {
    position: 'absolute',
    top: 62, // Adjusted for new spacing
    left: 40,
    right: 40,
    height: 2,
    backgroundColor: '#e2e8f0',
  },
  decorativeAccent: {
    position: 'absolute',
    top: 61, // Adjusted for new spacing
    left: '50%',
    width: 100,
    height: 4,
    backgroundColor: '#2563eb',
    marginLeft: -50,
    borderRadius: 2,
  },
  content: {
    marginTop: 32, // Reduced from 48
  },
  section: {
    marginBottom: 16, // Reduced from 24
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#64748b',
    marginBottom: 12, // Reduced from 16
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mainItem: {
    marginBottom: 8, // Reduced from 16
  },
  mainItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6, // Reduced from 8
    paddingHorizontal: 12, // Reduced from 16
    backgroundColor: '#f8fafc',
    borderRadius: 6, // Reduced from 8
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  mainItemText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
  },
  pageNumber: {
    fontSize: 12, // Reduced from 13
    fontFamily: 'Helvetica',
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    paddingVertical: 2,
    paddingHorizontal: 6, // Reduced from 8
    borderRadius: 4,
  },
  agentSection: {
    marginTop: 24, // Reduced from 32
  },
  agentSectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#64748b',
    marginBottom: 12, // Reduced from 16
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingBottom: 6, // Reduced from 8
    borderBottom: 2,
    borderBottomColor: '#e2e8f0',
  },
});

interface TableOfContentsProps {
  agentCount: number;
}

const MainItem: React.FC<{
  title: string;
  page: number;
}> = ({ title, page }) => (
  <View style={styles.mainItem}>
    <Link src={`#page_${page}`}>
      <View style={styles.mainItemContent}>
        <Text style={styles.mainItemText}>{title}</Text>
        <Text style={styles.pageNumber}>{page}</Text>
      </View>
    </Link>
  </View>
);

export const TableOfContents: React.FC<TableOfContentsProps> = ({ agentCount }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contents</Text>
      <View style={styles.decorativeLine} />
      <View style={styles.decorativeAccent} />
      
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <MainItem title="Executive Summary" page={3} />
          <MainItem title="Vulnerability Analysis" page={4} />
          <MainItem title="MITRE ATT&CK Analysis" page={5} />
        </View>

        {agentCount > 0 && (
          <View style={styles.agentSection}>
            <Text style={styles.agentSectionTitle}>Agent Analysis</Text>
            {Array.from({ length: agentCount }).map((_, index) => (
              <MainItem 
                key={index}
                title={`Agent ${index + 1} Analysis`}
                page={6 + index}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};
