import React from 'react';
import {Link, StyleSheet, Text, View} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  mainItem: {
    marginBottom: 16,
  },
  mainItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainItemText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
  },
  dots: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'dotted',
    marginHorizontal: 8,
    marginBottom: 4,
  },
  pageNumber: {
    fontSize: 13,
    fontFamily: 'Helvetica',
    color: '#64748b',
    marginLeft: 8,
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
        <View style={styles.dots} />
        <Text style={styles.pageNumber}>{page}</Text>
      </View>
    </Link>
  </View>
);

export const TableOfContents: React.FC<TableOfContentsProps> = ({ agentCount }) => {
  return (
    <View style={styles.container}>
      <MainItem title="Executive Summary" page={3} />
      <MainItem title="Vulnerability Analysis" page={4} />
      <MainItem title="MITRE ATT&CK Analysis" page={5} />
      
      {/* Agent Details */}
      {Array.from({ length: agentCount }).map((_, index) => (
        <MainItem 
          key={index}
          title={`Agent ${index + 1} Analysis`}
          page={6 + index}
        />
      ))}
    </View>
  );
};
