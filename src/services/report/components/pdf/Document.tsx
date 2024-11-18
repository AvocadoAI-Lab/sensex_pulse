import React from 'react';
import {Page, StyleSheet, Text, View} from '@react-pdf/renderer';
import {GroupSummary} from '../../summary';
import {CoverPage} from './CoverPage';
import {TableOfContents} from './TableOfContents';
import {ExecutiveSummary} from './ExecutiveSummary';
import {VulnerabilityAnalysis} from './VulnerabilityAnalysis';
import {MitreAnalysis} from './MitreAnalysis';
import {AgentDetails} from './AgentDetails';

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  coverPage: {
    padding: 0,
    backgroundColor: '#1e293b',
  },
  pageContent: {
    flex: 1,
    padding: 16,
    paddingTop: 64, // Increased from 40 to 64 to add more space below header
    paddingBottom: 60, // Keep footer spacing the same
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 48, // Increased from 40 to 48 to make header slightly taller
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff', // Added to ensure header is visible
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
  },
  headerDate: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#64748b',
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
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderTop: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#ffffff', // Added to ensure footer is visible
  },
  footerLeft: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
    backgroundColor: '#dbeafe',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  pageNumber: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#64748b',
  },
  poweredBy: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#64748b',
  },
  brandText: {
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
  },
});

interface ReportProps {
  summary: GroupSummary;
}

export const Report: React.FC<ReportProps> = ({ summary }) => {
  const activeAgents = summary.agentSummaries.filter(agent => agent.totalAlerts > 0);
  const totalAgents = activeAgents.length;
  const totalPages = 5 + totalAgents; // 5 fixed pages + agent pages
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const PageHeader = ({ title }: { title: string }) => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerDate}>{date}</Text>
      </View>
    </View>
  );

  const PageFooter = ({ 
    pageNumber, 
    showPrevious = true,
    showNext = true,
  }: { 
    pageNumber: number;
    showPrevious?: boolean;
    showNext?: boolean;
  }) => (
    <View style={styles.footer}>
      <View style={styles.footerLeft}>
        {showPrevious && (
          <Text style={styles.navButton}>← Previous</Text>
        )}
        {showNext && (
          <Text style={styles.navButton}>Next →</Text>
        )}
        <Text style={styles.pageNumber}>
          Page {pageNumber} of {totalPages}
        </Text>
      </View>
      <View style={styles.footerRight}>
        <Text style={styles.poweredBy}>
          Powered by <Text style={styles.brandText}>SenseX</Text> Analytics
        </Text>
      </View>
    </View>
  );

  return (
    <>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <CoverPage />
      </Page>

      {/* Table of Contents */}
      <Page size="A4" style={styles.page}>
        <View style={styles.decorativeLine} />
        <PageHeader title="Table of Contents" />
        <View style={styles.pageContent}>
          <TableOfContents agentCount={totalAgents} />
        </View>
        <PageFooter pageNumber={2} />
      </Page>

      {/* Executive Summary */}
      <Page size="A4" style={styles.page} id="page_3">
        <View style={styles.decorativeLine} />
        <PageHeader title="Executive Summary" />
        <View style={styles.pageContent}>
          <ExecutiveSummary summary={summary} />
        </View>
        <PageFooter pageNumber={3} />
      </Page>

      {/* Vulnerability Analysis */}
      <Page size="A4" style={styles.page} id="page_4">
        <View style={styles.decorativeLine} />
        <PageHeader title="Vulnerability Analysis" />
        <View style={styles.pageContent}>
          <VulnerabilityAnalysis summary={summary} />
        </View>
        <PageFooter pageNumber={4} />
      </Page>

      {/* MITRE Analysis */}
      <Page size="A4" style={styles.page} id="page_5">
        <View style={styles.decorativeLine} />
        <PageHeader title="MITRE Analysis" />
        <View style={styles.pageContent}>
          <MitreAnalysis summary={summary} />
        </View>
        <PageFooter pageNumber={5} />
      </Page>

      {/* Agent Details */}
      {activeAgents.map((agent, index) => (
        <Page 
          key={agent.id} 
          size="A4" 
          style={styles.page}
          id={`page_${6 + index}`}
        >
          <View style={styles.decorativeLine} />
          <PageHeader title={`Agent Details: ${agent.name}`} />
          <View style={styles.pageContent}>
            <AgentDetails agent={agent} />
          </View>
          <PageFooter 
            pageNumber={6 + index}
            showPrevious={index > 0}
            showNext={index < totalAgents - 1}
          />
        </Page>
      ))}
    </>
  );
};
