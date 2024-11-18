import React from 'react';
import {Link, StyleSheet, Text, View} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  header: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 24,
    color: '#1e293b',
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 8,
  },
  summaryBox: {
    marginBottom: 32,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  summaryText: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#475569',
    lineHeight: 1.5,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    marginBottom: 16,
    borderRadius: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
  },
  mainItem: {
    marginBottom: 12,
  },
  mainItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  mainItemText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
  },
  pageNumber: {
    fontSize: 13,
    fontFamily: 'Helvetica',
    color: '#64748b',
    marginLeft: 8,
  },
  dots: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'dotted',
    marginHorizontal: 8,
    marginBottom: 4,
  },
  subItems: {
    marginLeft: 16,
    marginTop: 4,
  },
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  subItemText: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#475569',
  },
  subItemDots: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'dotted',
    marginHorizontal: 8,
    marginBottom: 2,
  },
  subItemPage: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#64748b',
  },
  agentSection: {
    marginBottom: 16,
  },
  agentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  agentTitle: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
  },
  badge: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
    backgroundColor: '#dbeafe',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginRight: 8,
  },
});

interface TableOfContentsProps {
  agentCount: number;
}

const MainItem: React.FC<{
  title: string;
  page: number;
  children?: React.ReactNode;
}> = ({ title, page, children }) => (
  <View style={styles.mainItem}>
    <Link src={`#page_${page}`}>
      <View style={styles.mainItemContent}>
        <Text style={styles.mainItemText}>{title}</Text>
        <View style={styles.dots} />
        <Text style={styles.pageNumber}>{page}</Text>
      </View>
    </Link>
    {children}
  </View>
);

const SubItem: React.FC<{
  title: string;
  page: number;
}> = ({ title, page }) => (
  <Link src={`#page_${page}`}>
    <View style={styles.subItem}>
      <Text style={styles.subItemText}>{title}</Text>
      <View style={styles.subItemDots} />
      <Text style={styles.subItemPage}>{page}</Text>
    </View>
  </Link>
);

export const TableOfContents: React.FC<TableOfContentsProps> = ({ agentCount }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Table of Contents</Text>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>
          This security analysis report provides a comprehensive assessment of your security posture, 
          including vulnerability analysis, MITRE ATT&CK coverage, and detailed agent-specific information. 
          Click on any section title to navigate directly to that page.
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Overview</Text>
        </View>
        
        <MainItem title="Executive Summary" page={3}>
          <View style={styles.subItems}>
            <SubItem title="Security Score Assessment" page={3} />
            <SubItem title="Key Metrics and Statistics" page={3} />
            <SubItem title="Security Recommendations" page={3} />
          </View>
        </MainItem>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Security Analysis</Text>
        </View>
        
        <MainItem title="Vulnerability Analysis" page={4}>
          <View style={styles.subItems}>
            <SubItem title="Critical Vulnerabilities" page={4} />
            <SubItem title="CVSS Score Analysis" page={4} />
          </View>
        </MainItem>

        <MainItem title="MITRE ATT&CK Analysis" page={5}>
          <View style={styles.subItems}>
            <SubItem title="Tactics Coverage" page={5} />
            <SubItem title="Top Techniques" page={5} />
          </View>
        </MainItem>
      </View>

      {agentCount > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Agent Details</Text>
          </View>
          
          {Array.from({ length: agentCount }).map((_, index) => (
            <View key={index} style={styles.agentSection}>
              <Link src={`#page_${6 + index}`}>
                <View style={styles.agentHeader}>
                  <Text style={styles.agentTitle}>Agent {index + 1} Analysis</Text>
                  <Text style={styles.badge}>Page {6 + index}</Text>
                  <View style={styles.dots} />
                  <Text style={styles.pageNumber}>{6 + index}</Text>
                </View>
              </Link>
              <View style={styles.subItems}>
                <SubItem title="Security Events" page={6 + index} />
                <SubItem title="Top Rules" page={6 + index} />
                <SubItem title="Recent Alerts" page={6 + index} />
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
