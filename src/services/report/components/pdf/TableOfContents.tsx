import React from 'react';
import {StyleSheet, Text, View} from '@react-pdf/renderer';

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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#64748b',
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#334155',
  },
  pageNumber: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#64748b',
  },
  dots: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'dotted',
    marginHorizontal: 6,
  },
  subsection: {
    marginLeft: 12,
    marginBottom: 6,
  },
  subsectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  subsectionText: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#64748b',
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
  badge: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#1e40af',
    backgroundColor: '#dbeafe',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
    marginLeft: 6,
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
  mainSection: {
    marginBottom: 8,
  },
  mainSectionText: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
  },
});

interface TableOfContentsProps {
  agentCount: number;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ agentCount }) => {
  return (
    <View style={styles.container}>
      <View style={styles.decorativeLine} />
      <Text style={styles.header}>Table of Contents</Text>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>
          This security analysis report provides a comprehensive assessment of your security posture, 
          including vulnerability analysis, MITRE ATT&CK coverage, and detailed agent-specific information. 
          The report is organized into {3 + agentCount} main sections for easy navigation.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        
        <View style={styles.mainSection}>
          <View style={styles.item}>
            <Text style={styles.mainSectionText}>Executive Summary</Text>
            <View style={styles.dots} />
            <Text style={styles.pageNumber}>3</Text>
          </View>
        </View>
        
        <View style={styles.subsection}>
          <View style={styles.subsectionItem}>
            <Text style={styles.subsectionText}>Security Score Assessment</Text>
            <View style={styles.dots} />
            <Text style={styles.pageNumber}>3</Text>
          </View>
          <View style={styles.subsectionItem}>
            <Text style={styles.subsectionText}>Key Metrics and Statistics</Text>
            <View style={styles.dots} />
            <Text style={styles.pageNumber}>3</Text>
          </View>
          <View style={styles.subsectionItem}>
            <Text style={styles.subsectionText}>Security Recommendations</Text>
            <View style={styles.dots} />
            <Text style={styles.pageNumber}>3</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security Analysis</Text>
        
        <View style={styles.mainSection}>
          <View style={styles.item}>
            <Text style={styles.mainSectionText}>Vulnerability Analysis</Text>
            <View style={styles.dots} />
            <Text style={styles.pageNumber}>4</Text>
          </View>
        </View>
        <View style={styles.subsection}>
          <View style={styles.subsectionItem}>
            <Text style={styles.subsectionText}>Critical Vulnerabilities</Text>
            <View style={styles.dots} />
            <Text style={styles.pageNumber}>4</Text>
          </View>
          <View style={styles.subsectionItem}>
            <Text style={styles.subsectionText}>CVSS Score Analysis</Text>
            <View style={styles.dots} />
            <Text style={styles.pageNumber}>4</Text>
          </View>
        </View>

        <View style={styles.mainSection}>
          <View style={styles.item}>
            <Text style={styles.mainSectionText}>MITRE ATT&CK Analysis</Text>
            <View style={styles.dots} />
            <Text style={styles.pageNumber}>5</Text>
          </View>
        </View>
        <View style={styles.subsection}>
          <View style={styles.subsectionItem}>
            <Text style={styles.subsectionText}>Tactics Coverage</Text>
            <View style={styles.dots} />
            <Text style={styles.pageNumber}>5</Text>
          </View>
          <View style={styles.subsectionItem}>
            <Text style={styles.subsectionText}>Top Techniques</Text>
            <View style={styles.dots} />
            <Text style={styles.pageNumber}>5</Text>
          </View>
        </View>
      </View>

      {agentCount > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Agent Details</Text>
          {Array.from({ length: agentCount }).map((_, index) => (
            <React.Fragment key={index}>
              <View style={styles.mainSection}>
                <View style={styles.item}>
                  <Text style={styles.mainSectionText}>
                    Agent {index + 1} Analysis
                    <Text style={styles.badge}>Page {6 + index}</Text>
                  </Text>
                  <View style={styles.dots} />
                  <Text style={styles.pageNumber}>{6 + index}</Text>
                </View>
              </View>
              <View style={styles.subsection}>
                <View style={styles.subsectionItem}>
                  <Text style={styles.subsectionText}>Security Events</Text>
                  <View style={styles.dots} />
                  <Text style={styles.pageNumber}>{6 + index}</Text>
                </View>
                <View style={styles.subsectionItem}>
                  <Text style={styles.subsectionText}>Top Rules</Text>
                  <View style={styles.dots} />
                  <Text style={styles.pageNumber}>{6 + index}</Text>
                </View>
                <View style={styles.subsectionItem}>
                  <Text style={styles.subsectionText}>Recent Alerts</Text>
                  <View style={styles.dots} />
                  <Text style={styles.pageNumber}>{6 + index}</Text>
                </View>
              </View>
            </React.Fragment>
          ))}
        </View>
      )}
    </View>
  );
};
