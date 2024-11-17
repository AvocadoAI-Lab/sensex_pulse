import React from 'react';
import {Path, StyleSheet, Svg, Text, View} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    backgroundColor: '#1e40af',
    color: '#ffffff',
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 700,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 500,
    marginBottom: 60,
    opacity: 0.9,
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 60,
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 24,
    borderRadius: 8,
  },
  cardIcon: {
    width: 32,
    height: 32,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: '#ffffff',
    opacity: 0.8,
  },
  footerText: {
    fontSize: 12,
    lineHeight: 1.4,
  },
});

const ShieldIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24">
    <Path
      stroke="#ffffff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
    />
  </Svg>
);

const AlertIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24">
    <Path
      stroke="#ffffff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
    />
  </Svg>
);

const ImpactIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24">
    <Path
      stroke="#ffffff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
    />
  </Svg>
);

const RecommendationIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24">
    <Path
      stroke="#ffffff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
    />
  </Svg>
);

export const CoverPage: React.FC = () => {
  const date = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <ShieldIcon />
      </View>
      
      <Text style={styles.title}>Security Analysis Report</Text>
      <Text style={styles.subtitle}>Comprehensive Security Assessment</Text>

      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <AlertIcon />
          </View>
          <Text style={styles.cardTitle}>Threat Analysis</Text>
          <Text style={styles.cardDescription}>
            Comprehensive security assessment and risk evaluation
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <ImpactIcon />
          </View>
          <Text style={styles.cardTitle}>Impact Analysis</Text>
          <Text style={styles.cardDescription}>
            Detailed evaluation of security incidents and vulnerabilities
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <RecommendationIcon />
          </View>
          <Text style={styles.cardTitle}>Recommendations</Text>
          <Text style={styles.cardDescription}>
            Actionable insights and security improvement strategies
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerText}>Generated on</Text>
          <Text style={styles.footerText}>{date}</Text>
        </View>
        <View>
          <Text style={styles.footerText}>Powered by</Text>
          <Text style={styles.footerText}>Sensex Analytics</Text>
        </View>
      </View>
    </View>
  );
};
