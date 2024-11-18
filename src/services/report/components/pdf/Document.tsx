import React from 'react';
import {Link, Page, StyleSheet, Text, View} from '@react-pdf/renderer';
import {GroupSummary} from '../../summary';
import {CoverPage} from './CoverPage';
import {TableOfContents} from './TableOfContents';
import {ExecutiveSummary} from './ExecutiveSummary';
import {VulnerabilityAnalysis} from './VulnerabilityAnalysis';
import {MitreAnalysis} from './MitreAnalysis';
import {AgentDetails} from './AgentDetails';
import DeepAnalysis from './experimental/deep-analysis';

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
    paddingTop: 64,
    paddingBottom: 60,
  },
  tocPage: {
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  tocContent: {
    flex: 1,
    paddingBottom: 60,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
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
    backgroundColor: '#ffffff',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  redirectButton: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
    backgroundColor: '#dbeafe',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
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
  anchor: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 1,
    height: 1,
  },
});

interface ReportProps {
  summary: GroupSummary;
}

export const Report: React.FC<ReportProps> = ({ summary }) => {
  const activeAgents = summary.agentSummaries.filter(agent => agent.totalAlerts > 0);
  const totalAgents = activeAgents.length;
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

  const PageFooter = () => (
    <View style={styles.footer}>
      <View style={styles.footerLeft}>
        <Link src="#page_2">
          <Text style={styles.redirectButton}>Go to Table of Contents</Text>
        </Link>
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
      <Page size="A4" style={styles.tocPage}>
        <View style={styles.anchor} id="page_2" />
        <View style={styles.tocContent}>
          <TableOfContents agentCount={totalAgents} />
        </View>
        <PageFooter />
      </Page>

      {/* Executive Summary */}
      <Page size="A4" style={styles.page}>
        <View style={styles.anchor} id="page_3" />
        <View style={styles.decorativeLine} />
        <PageHeader title="Executive Summary" />
        <View style={styles.pageContent}>
          <ExecutiveSummary summary={summary} />
        </View>
        <PageFooter />
      </Page>

      {/* Vulnerability Analysis */}
      <Page size="A4" style={styles.page}>
        <View style={styles.anchor} id="page_4" />
        <View style={styles.decorativeLine} />
        <PageHeader title="Vulnerability Analysis" />
        <View style={styles.pageContent}>
          <VulnerabilityAnalysis summary={summary} />
        </View>
        <PageFooter />
      </Page>

      {/* MITRE Analysis */}
      <Page size="A4" style={styles.page}>
        <View style={styles.anchor} id="page_5" />
        <View style={styles.decorativeLine} />
        <PageHeader title="MITRE Analysis" />
        <View style={styles.pageContent}>
          <MitreAnalysis summary={summary} />
        </View>
        <PageFooter />
      </Page>

      {/* Agent Details */}
      {activeAgents.map((agent, index) => (
        <Page 
          key={agent.id} 
          size="A4" 
          style={styles.page}
        >
          <View style={styles.anchor} id={`page_${6 + index}`} />
          <View style={styles.decorativeLine} />
          <PageHeader title={`Agent ${index + 1} Analysis`} />
          <View style={styles.pageContent}>
            <AgentDetails agent={agent} />
          </View>
          <PageFooter />
        </Page>
      ))}

      {/* Deep Analysis */}
      <Page size="A4" style={styles.page}>
        <View style={styles.anchor} id={`page_${6 + activeAgents.length}`} />
        <View style={styles.decorativeLine} />
        <PageHeader title="Deep Analysis" />
        <View style={styles.pageContent}>
          <DeepAnalysis summary={summary} />
        </View>
        <PageFooter />
      </Page>
    </>
  );
};
