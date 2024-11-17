import React from 'react';
import {StyleSheet, Text, View} from '@react-pdf/renderer';

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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#64748b',
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: '#334155',
  },
  pageNumber: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: '#64748b',
  },
  dots: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'dotted',
    marginHorizontal: 8,
  },
});

interface TableOfContentsProps {
  agentCount: number;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ agentCount }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Table of Contents</Text>

      <View style={styles.section}>
        <View style={styles.item}>
          <Text style={styles.itemText}>Executive Summary</Text>
          <View style={styles.dots} />
          <Text style={styles.pageNumber}>3</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.itemText}>Vulnerability Analysis</Text>
          <View style={styles.dots} />
          <Text style={styles.pageNumber}>4</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.itemText}>MITRE ATT&CK Analysis</Text>
          <View style={styles.dots} />
          <Text style={styles.pageNumber}>5</Text>
        </View>
      </View>

      {agentCount > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Agent Details</Text>
          {Array.from({ length: agentCount }).map((_, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemText}>Agent {index + 1}</Text>
              <View style={styles.dots} />
              <Text style={styles.pageNumber}>{6 + index}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
