import React from 'react';
import {Page, StyleSheet} from '@react-pdf/renderer';
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
  },
  coverPage: {
    padding: 0,
    backgroundColor: '#1e293b',
  },
});

interface ReportProps {
  summary: GroupSummary;
}

export const Report: React.FC<ReportProps> = ({ summary }) => {
  const activeAgents = summary.agentSummaries.filter(agent => agent.totalAlerts > 0);

  return (
    <>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <CoverPage />
      </Page>

      {/* Table of Contents */}
      <Page size="A4" style={styles.page}>
        <TableOfContents agentCount={activeAgents.length} />
      </Page>

      {/* Executive Summary */}
      <Page 
        size="A4" 
        style={styles.page}
        id="page_3"
      >
        <ExecutiveSummary summary={summary} />
      </Page>

      {/* Vulnerability Analysis */}
      <Page 
        size="A4" 
        style={styles.page}
        id="page_4"
      >
        <VulnerabilityAnalysis summary={summary} />
      </Page>

      {/* MITRE Analysis */}
      <Page 
        size="A4" 
        style={styles.page}
        id="page_5"
      >
        <MitreAnalysis summary={summary} />
      </Page>

      {/* Agent Details */}
      {activeAgents.map((agent, index) => (
        <Page 
          key={agent.id} 
          size="A4" 
          style={styles.page}
          id={`page_${6 + index}`}
        >
          <AgentDetails agent={agent} index={index} />
        </Page>
      ))}
    </>
  );
};
